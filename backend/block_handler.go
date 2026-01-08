package backend

import (
	"context"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// HandleBlockUser blocks a user
func HandleBlockUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, _ := GetUserID(r)
	blockedIDStr := strings.TrimPrefix(r.URL.Path, "/api/users/")
	blockedIDStr = strings.TrimSuffix(blockedIDStr, "/block")
	
	blockedID, err := primitive.ObjectIDFromHex(blockedIDStr)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if userID == blockedID {
		JSONError(w, http.StatusBadRequest, "Cannot block yourself")
		return
	}

	collection := GetCollection("blocked_users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if already blocked
	count, _ := collection.CountDocuments(ctx, bson.M{"userId": userID, "blockedId": blockedID})
	if count > 0 {
		JSON(w, http.StatusOK, map[string]string{"message": "User already blocked"})
		return
	}

	block := BlockedUser{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		BlockedID: blockedID,
		CreatedAt: time.Now(),
	}

	if _, err := collection.InsertOne(ctx, block); err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to block user")
		return
	}

	JSON(w, http.StatusOK, map[string]string{"message": "User blocked successfully"})
}

// HandleUnblockUser unblocks a user
func HandleUnblockUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, _ := GetUserID(r)
	blockedIDStr := strings.TrimPrefix(r.URL.Path, "/api/users/")
	blockedIDStr = strings.TrimSuffix(blockedIDStr, "/block")
	
	blockedID, err := primitive.ObjectIDFromHex(blockedIDStr)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	collection := GetCollection("blocked_users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := collection.DeleteOne(ctx, bson.M{"userId": userID, "blockedId": blockedID}); err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to unblock user")
		return
	}

	JSON(w, http.StatusOK, map[string]string{"message": "User unblocked successfully"})
}

// HandleReport creates a report
func HandleReport(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, _ := GetUserID(r)
	var req struct {
		ReportedID  string `json:"reportedId"`
		TargetType  string `json:"targetType"`
		Reason      string `json:"reason"`
		Description string `json:"description"`
	}
	DecodeJSON(r, &req)

	reportedID, _ := primitive.ObjectIDFromHex(req.ReportedID)

	collection := GetCollection("reports")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	report := Report{
		ID:          primitive.NewObjectID(),
		ReporterID:  userID,
		ReportedID:  reportedID,
		TargetType:  req.TargetType,
		Reason:      req.Reason,
		Description: req.Description,
		Status:      "pending",
		CreatedAt:   time.Now(),
	}

	if _, err := collection.InsertOne(ctx, report); err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to submit report")
		return
	}

	JSON(w, http.StatusCreated, map[string]string{"message": "Report submitted successfully"})
}
