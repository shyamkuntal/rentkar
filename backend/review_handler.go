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

// HandleReviews - POST to create a review
func HandleReviews(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		createReview(w, r)
	} else {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleReviewsByItem - GET reviews for an item
func HandleReviewsByItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/reviews/item/")
	getReviewsByTarget(w, r, "item", id)
}

// HandleReviewsByUser - GET reviews for a user
func HandleReviewsByUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/reviews/user/")
	getReviewsByTarget(w, r, "user", id)
}

// HandleReviewsByBooking - GET reviews for a booking
func HandleReviewsByBooking(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/reviews/booking/")
	getReviewsByBooking(w, r, id)
}

func getReviewsByBooking(w http.ResponseWriter, r *http.Request, bookingIDStr string) {
	bookingID, err := primitive.ObjectIDFromHex(bookingIDStr)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid booking ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := GetCollection("reviews").Find(ctx,
		bson.M{"bookingId": bookingID},
		options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}),
	)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to fetch reviews")
		return
	}
	defer cursor.Close(ctx)

	var reviews []Review
	cursor.All(ctx, &reviews)

	// Populate reviewer info
	userCol := GetCollection("users")
	for i := range reviews {
		var user User
		if err := userCol.FindOne(ctx, bson.M{"_id": reviews[i].ReviewerID}).Decode(&user); err == nil {
			reviews[i].Reviewer = &user
		}
	}

	JSON(w, http.StatusOK, map[string]interface{}{"reviews": reviews})
}

func createReview(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)

	var req struct {
		BookingID  string `json:"bookingId"`
		TargetType string `json:"targetType"` // "item" or "user"
		TargetID   string `json:"targetId"`
		Rating     int    `json:"rating"`
		Comment    string `json:"comment"`
	}
	DecodeJSON(r, &req)

	// Validate rating (1-5)
	if req.Rating < 1 || req.Rating > 5 {
		JSONError(w, http.StatusBadRequest, "Rating must be between 1 and 5")
		return
	}

	// Validate comment length (max 100 chars)
	if len(req.Comment) > 100 {
		JSONError(w, http.StatusBadRequest, "Comment must be 100 characters or less")
		return
	}

	// Validate targetType
	if req.TargetType != "item" && req.TargetType != "user" {
		JSONError(w, http.StatusBadRequest, "Target type must be 'item' or 'user'")
		return
	}

	bookingID, err := primitive.ObjectIDFromHex(req.BookingID)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid booking ID")
		return
	}

	targetID, err := primitive.ObjectIDFromHex(req.TargetID)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid target ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify booking exists and is confirmed
	var booking Booking
	err = GetCollection("bookings").FindOne(ctx, bson.M{"_id": bookingID}).Decode(&booking)
	if err != nil {
		JSONError(w, http.StatusNotFound, "Booking not found")
		return
	}

	if booking.Status != "confirmed" && booking.Status != "completed" {
		JSONError(w, http.StatusForbidden, "Can only review confirmed or completed bookings")
		return
	}

	// Verify user is the renter of this booking
	if booking.RenterID != userID {
		JSONError(w, http.StatusForbidden, "Only the renter can leave a review")
		return
	}

	// Check if user already reviewed this target for this booking
	existingCount, _ := GetCollection("reviews").CountDocuments(ctx, bson.M{
		"bookingId":  bookingID,
		"reviewerId": userID,
		"targetType": req.TargetType,
		"targetId":   targetID,
	})
	if existingCount > 0 {
		JSONError(w, http.StatusConflict, "You have already reviewed this")
		return
	}

	review := Review{
		ID:         primitive.NewObjectID(),
		BookingID:  bookingID,
		ReviewerID: userID,
		TargetType: req.TargetType,
		TargetID:   targetID,
		Rating:     req.Rating,
		Comment:    req.Comment,
		CreatedAt:  time.Now(),
	}

	GetCollection("reviews").InsertOne(ctx, review)

	// Update average rating on target (item or user)
	updateTargetRating(ctx, req.TargetType, targetID)

	JSON(w, http.StatusCreated, map[string]interface{}{"message": "Review created", "review": review})
}

func getReviewsByTarget(w http.ResponseWriter, r *http.Request, targetType string, targetIDStr string) {
	targetID, err := primitive.ObjectIDFromHex(targetIDStr)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := GetCollection("reviews").Find(ctx,
		bson.M{"targetType": targetType, "targetId": targetID},
		options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}),
	)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to fetch reviews")
		return
	}
	defer cursor.Close(ctx)

	var reviews []Review
	cursor.All(ctx, &reviews)

	// Populate reviewer info
	userCol := GetCollection("users")
	for i := range reviews {
		var user User
		if err := userCol.FindOne(ctx, bson.M{"_id": reviews[i].ReviewerID}).Decode(&user); err == nil {
			reviews[i].Reviewer = &user
		}
	}

	JSON(w, http.StatusOK, map[string]interface{}{"reviews": reviews})
}

func updateTargetRating(ctx context.Context, targetType string, targetID primitive.ObjectID) {
	// Calculate average rating
	pipeline := []bson.M{
		{"$match": bson.M{"targetType": targetType, "targetId": targetID}},
		{"$group": bson.M{
			"_id":       nil,
			"avgRating": bson.M{"$avg": "$rating"},
			"count":     bson.M{"$sum": 1},
		}},
	}

	cursor, err := GetCollection("reviews").Aggregate(ctx, pipeline)
	if err != nil {
		return
	}
	defer cursor.Close(ctx)

	var results []struct {
		AvgRating float64 `bson:"avgRating"`
		Count     int     `bson:"count"`
	}
	cursor.All(ctx, &results)

	if len(results) == 0 {
		return
	}

	avgRating := results[0].AvgRating
	reviewCount := results[0].Count

	// Update the target's rating field
	if targetType == "item" {
		GetCollection("items").UpdateOne(ctx,
			bson.M{"_id": targetID},
			bson.M{"$set": bson.M{"rating": avgRating, "reviews": reviewCount}},
		)
	} else {
		GetCollection("users").UpdateOne(ctx,
			bson.M{"_id": targetID},
			bson.M{"$set": bson.M{"rating": avgRating, "reviewCount": reviewCount}},
		)
	}
}
