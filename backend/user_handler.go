package backend

import (
	"context"
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
