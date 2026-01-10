package backend

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func HandleUserRoutes(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/users/")

	if path == "profile" && r.Method == http.MethodPut {
		AuthMiddleware(updateProfile)(w, r)
	} else if r.Method == http.MethodGet {
		getUser(w, r, path)
	} else {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func getUser(w http.ResponseWriter, r *http.Request, id string) {
	userID, _ := primitive.ObjectIDFromHex(id)
	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User
	if err := collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
		JSONError(w, http.StatusNotFound, "User not found")
		return
	}

	JSON(w, http.StatusOK, map[string]interface{}{
		"user": map[string]interface{}{
			"id":            user.ID,
			"name":          user.Name,
			"avatar":        user.Avatar,
			"location":      user.Location,
			"rating":        user.Rating,
			"totalRatings":  user.TotalRatings,
			"totalListings": user.TotalListings,
			"totalBookings": func() int64 {
				count, _ := GetCollection("bookings").CountDocuments(ctx, bson.M{
					"renterId": userID,
					"status":   bson.M{"$in": []string{"confirmed", "ongoing", "completed", "expired"}},
				})
				return count
			}(),
		},
	})
}

func updateProfile(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)

	var updateData map[string]interface{}
	DecodeJSON(r, &updateData)

	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	delete(updateData, "password")
	delete(updateData, "_id")
	delete(updateData, "email")
	updateData["updatedAt"] = time.Now()

	collection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": updateData})

	JSON(w, http.StatusOK, map[string]string{"message": "Profile updated successfully"})
}

// HandleFCMToken registers or updates user's FCM token for push notifications
func HandleFCMToken(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := GetUserID(r)
	if err != nil {
		JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req struct {
		FCMToken string `json:"fcmToken"`
	}
	if err := DecodeJSON(r, &req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.FCMToken == "" {
		JSONError(w, http.StatusBadRequest, "FCM token is required")
		return
	}

	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// First, remove this token from any OTHER users to prevent duplication
	// This fixes the issue where notifications go to the wrong user if they share a device
	_, err = collection.UpdateMany(ctx, bson.M{
		"fcmToken": req.FCMToken,
		"_id":      bson.M{"$ne": userID},
	}, bson.M{
		"$unset": bson.M{"fcmToken": ""},
	})
	if err != nil {
		log.Printf("Error clearing old FCM tokens: %v", err)
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{
		"$set": bson.M{
			"fcmToken":  req.FCMToken,
			"updatedAt": time.Now(),
		},
	})

	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to update FCM token")
		return
	}

	JSON(w, http.StatusOK, map[string]string{"message": "FCM token registered successfully"})
}
