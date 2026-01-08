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

func HandleChatByID(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/chats/")
	if strings.HasSuffix(path, "/messages") {
		chatID := strings.TrimSuffix(path, "/messages")
		getMessages(w, r, chatID)
	}
}

func HandleSendMessage(w http.ResponseWriter, r *http.Request) {
	sendMessage(w, r)
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

	JSON(w, http.StatusOK, map[string]interface{}{"chats": chats, "total": len(chats)})
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
