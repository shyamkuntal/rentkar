package backend

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
}

type Client struct {
	ID     string
	UserID primitive.ObjectID
	Conn   *websocket.Conn
	Send   chan []byte
	Rooms  map[string]bool
}

type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	Rooms      map[string]map[*Client]bool
	mu         sync.RWMutex
}

var hub = &Hub{
	Clients:    make(map[*Client]bool),
	Broadcast:  make(chan []byte),
	Register:   make(chan *Client),
	Unregister: make(chan *Client),
	Rooms:      make(map[string]map[*Client]bool),
}

func init() {
	go hub.Run()
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client] = true
			h.mu.Unlock()
			log.Printf("Client registered: %s", client.ID)

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)

				// Remove from all rooms
				for room := range client.Rooms {
					if clients, ok := h.Rooms[room]; ok {
						delete(clients, client)
					}
				}
			}
			h.mu.Unlock()
			log.Printf("Client unregistered: %s", client.ID)

		case message := <-h.Broadcast:
			h.mu.RLock()
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *Hub) JoinRoom(client *Client, room string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.Rooms[room] == nil {
		h.Rooms[room] = make(map[*Client]bool)
	}

	h.Rooms[room][client] = true
	client.Rooms[room] = true
	log.Printf("Client %s joined room %s", client.ID, room)
}

func (h *Hub) LeaveRoom(client *Client, room string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.Rooms[room]; ok {
		delete(clients, client)
		delete(client.Rooms, room)
	}
	log.Printf("Client %s left room %s", client.ID, room)
}

func (h *Hub) BroadcastToRoom(room string, message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if clients, ok := h.Rooms[room]; ok {
		for client := range clients {
			select {
			case client.Send <- message:
			default:
				close(client.Send)
				delete(h.Clients, client)
			}
		}
	}
}

func (c *Client) ReadPump() {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}

		var msg map[string]interface{}
		if err := json.Unmarshal(message, &msg); err != nil {
			continue
		}

		handleWebSocketMessage(c, msg)
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func handleWebSocketMessage(client *Client, msg map[string]interface{}) {
	msgType, ok := msg["type"].(string)
	if !ok {
		return
	}

	switch msgType {
	case "join_chat":
		if chatID, ok := msg["chatId"].(string); ok {
			hub.JoinRoom(client, chatID)
		}

	case "leave_chat":
		if chatID, ok := msg["chatId"].(string); ok {
			hub.LeaveRoom(client, chatID)
		}

	case "send_message":
		if chatID, ok := msg["chatId"].(string); ok {
			if content, ok := msg["content"].(string); ok {
				saveAndBroadcastMessage(client, chatID, content)
			}
		}

	case "typing":
		if chatID, ok := msg["chatId"].(string); ok {
			if isTyping, ok := msg["isTyping"].(bool); ok {
				broadcastTyping(client, chatID, isTyping)
			}
		}
	}
}

func saveAndBroadcastMessage(client *Client, chatID, content string) {
	chatObjID, err := primitive.ObjectIDFromHex(chatID)
	if err != nil {
		return
	}

	collection := GetCollection("messages")
	chatCollection := GetCollection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	message := Message{
		ID:        primitive.NewObjectID(),
		ChatID:    chatObjID,
		SenderID:  client.UserID,
		Content:   content,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	if _, err := collection.InsertOne(ctx, message); err != nil {
		log.Printf("Error saving message: %v", err)
		return
	}

	// Get chat to find participants
	var chat Chat
	if err := chatCollection.FindOne(ctx, bson.M{"_id": chatObjID}).Decode(&chat); err != nil {
		log.Printf("Error finding chat: %v", err)
		return
	}

	// Update chat's updatedAt and increment unread count for all participants except sender
	updateFields := bson.M{"updatedAt": time.Now()}
	for _, participantID := range chat.Participants {
		if participantID != client.UserID {
			// Increment unread count for this participant
			key := "unreadCount." + participantID.Hex()
			chatCollection.UpdateOne(ctx, bson.M{"_id": chatObjID}, bson.M{
				"$set": updateFields,
				"$inc": bson.M{key: 1},
			})
		}
	}
	// Also update updatedAt in case no other participants (shouldn't happen but just in case)
	chatCollection.UpdateOne(ctx, bson.M{"_id": chatObjID}, bson.M{"$set": updateFields})

	// Broadcast to room
	responseData, _ := json.Marshal(map[string]interface{}{
		"type":    "new_message",
		"message": message,
	})

	hub.BroadcastToRoom(chatID, responseData)
}

func broadcastTyping(client *Client, chatID string, isTyping bool) {
	data, _ := json.Marshal(map[string]interface{}{
		"type":     "user_typing",
		"userId":   client.UserID.Hex(),
		"chatId":   chatID,
		"isTyping": isTyping,
	})

	hub.BroadcastToRoom(chatID, data)
}

// HandleWebSocket handles WebSocket connections
func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Try to get user ID from context (if auth middleware was used)
	userIDStr, ok := r.Context().Value(UserIDKey).(string)

	// If not in context, try to get from query parameter
	if !ok {
		token := r.URL.Query().Get("token")
		if token == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Validate token manually
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "your-secret-key-change-this-in-production"
		}

		claims := &Claims{}
		parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !parsedToken.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		userIDStr = claims.UserID
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	client := &Client{
		ID:     primitive.NewObjectID().Hex(),
		UserID: userID,
		Conn:   conn,
		Send:   make(chan []byte, 256),
		Rooms:  make(map[string]bool),
	}

	hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
