package backend

import (
	"context"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func HandleChats(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getChats(w, r)
	case http.MethodPost:
		createChat(w, r)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleSendMessage(w http.ResponseWriter, r *http.Request) {
	sendMessage(w, r)
}

func HandleUnreadCount(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	getUnreadCount(w, r)
}

func HandleChatByID(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/chats/")
	if strings.HasSuffix(path, "/messages") {
		chatID := strings.TrimSuffix(path, "/messages")
		getMessages(w, r, chatID)
	} else if r.Method == http.MethodDelete {
		deleteChat(w, r, path)
	}
}

func getChats(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	collection := GetCollection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"participants": userID}, options.Find().SetSort(bson.D{{Key: "updatedAt", Value: -1}}))
	defer cursor.Close(ctx)

	var chats []Chat
	cursor.All(ctx, &chats)

	// Populate participants and item for each chat
	userCol := GetCollection("users")
	itemCol := GetCollection("items")
	msgCol := GetCollection("messages")

	type PopulatedChat struct {
		ID           primitive.ObjectID `json:"id" bson:"_id"`
		Participants []User             `json:"participants"`
		Item         *Item              `json:"item,omitempty"`
		LastMessage  *Message           `json:"lastMessage,omitempty"`
		UnreadCount  map[string]int     `json:"unreadCount,omitempty"`
		CreatedAt    time.Time          `json:"createdAt"`
		UpdatedAt    time.Time          `json:"updatedAt"`
	}

	var populatedChats []PopulatedChat
	for _, chat := range chats {
		pc := PopulatedChat{
			ID:          chat.ID,
			UnreadCount: chat.UnreadCount,
			CreatedAt:   chat.CreatedAt,
			UpdatedAt:   chat.UpdatedAt,
		}

		// Populate participants
		var participants []User
		for _, pid := range chat.Participants {
			var u User
			userCol.FindOne(ctx, bson.M{"_id": pid}).Decode(&u)
			participants = append(participants, User{ID: u.ID, Name: u.Name, Avatar: u.Avatar})
		}
		pc.Participants = participants

		// Populate item
		if !chat.ItemID.IsZero() {
			var item Item
			itemCol.FindOne(ctx, bson.M{"_id": chat.ItemID}).Decode(&item)
			pc.Item = &Item{ID: item.ID, Title: item.Title, Images: item.Images, Price: item.Price}
		}

		// Get last message
		var lastMsg Message
		err := msgCol.FindOne(ctx, bson.M{"chatId": chat.ID}, options.FindOne().SetSort(bson.D{{Key: "createdAt", Value: -1}})).Decode(&lastMsg)
		if err == nil {
			pc.LastMessage = &lastMsg
		}

		populatedChats = append(populatedChats, pc)
	}

	JSON(w, http.StatusOK, map[string]interface{}{"chats": populatedChats, "total": len(populatedChats)})
}

func createChat(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	var req struct {
		ItemID        string `json:"itemId"`
		ParticipantID string `json:"participantId"`
	}
	DecodeJSON(r, &req)

	itemID, _ := primitive.ObjectIDFromHex(req.ItemID)
	participantID, _ := primitive.ObjectIDFromHex(req.ParticipantID)

	collection := GetCollection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	chat := Chat{
		ID:           primitive.NewObjectID(),
		Participants: []primitive.ObjectID{userID, participantID},
		ItemID:       itemID,
		UnreadCount:  make(map[string]int),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	collection.InsertOne(ctx, chat)
	JSON(w, http.StatusCreated, map[string]interface{}{"chat": chat})
}

func getMessages(w http.ResponseWriter, r *http.Request, chatID string) {
	chatObjID, _ := primitive.ObjectIDFromHex(chatID)
	collection := GetCollection("messages")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"chatId": chatObjID}, options.Find().SetSort(bson.D{{Key: "createdAt", Value: 1}}))
	defer cursor.Close(ctx)

	var messages []Message
	cursor.All(ctx, &messages)

	JSON(w, http.StatusOK, map[string]interface{}{"messages": messages, "total": len(messages)})
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	var req struct {
		ChatID  string `json:"chatId"`
		Content string `json:"content"`
	}
	DecodeJSON(r, &req)

	chatID, _ := primitive.ObjectIDFromHex(req.ChatID)

	collection := GetCollection("messages")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	message := Message{
		ID:        primitive.NewObjectID(),
		ChatID:    chatID,
		SenderID:  userID,
		Content:   req.Content,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	collection.InsertOne(ctx, message)
	GetCollection("chats").UpdateOne(ctx, bson.M{"_id": chatID}, bson.M{"$set": bson.M{"updatedAt": time.Now()}})

	JSON(w, http.StatusCreated, map[string]interface{}{"message": message})
}

func deleteChat(w http.ResponseWriter, r *http.Request, chatID string) {
	userID, _ := GetUserID(r)
	chatObjID, _ := primitive.ObjectIDFromHex(chatID)

	collection := GetCollection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify participant
	count, _ := collection.CountDocuments(ctx, bson.M{"_id": chatObjID, "participants": userID})
	if count == 0 {
		JSONError(w, http.StatusForbidden, "Access denied")
		return
	}

	// Delete chat and messages
	collection.DeleteOne(ctx, bson.M{"_id": chatObjID})
	GetCollection("messages").DeleteMany(ctx, bson.M{"chatId": chatObjID})

	JSON(w, http.StatusOK, map[string]string{"message": "Chat deleted"})
}

func getUnreadCount(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	userIDStr := userID.Hex()

	collection := GetCollection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"participants": userID})
	defer cursor.Close(ctx)

	var chats []Chat
	cursor.All(ctx, &chats)

	totalUnread := 0
	for _, chat := range chats {
		if count, ok := chat.UnreadCount[userIDStr]; ok {
			totalUnread += count
		}
	}

	JSON(w, http.StatusOK, map[string]int{"count": totalUnread})
}
