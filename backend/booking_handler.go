package backend

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// generateTrackingID creates an 8-character alphanumeric tracking ID
func generateTrackingID() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, 8)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

func HandleBookings(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getMyBookings(w, r)
	case http.MethodPost:
		createBooking(w, r)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleOwnerBookings(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		getOwnerBookings(w, r)
	} else {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandlePendingRequestsCount(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	userID, _ := GetUserID(r)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Count bookings where user is owner and status is pending
	count, err := collection.CountDocuments(ctx, bson.M{"ownerId": userID, "status": "pending"})
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to count pending requests")
		return
	}
	
	JSON(w, http.StatusOK, map[string]interface{}{"count": count})
}

func HandleBookingByID(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/bookings/")
	
	// Skip if this is a known sub-route (these should be handled by specific handlers)
	if path == "owner" || path == "pending-count" {
		JSONError(w, http.StatusNotFound, "Not found")
		return
	}
	
	id := path
	switch r.Method {
	case http.MethodGet:
		getBooking(w, r, id)
	case http.MethodPatch:
		updateBookingStatus(w, r, id)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func createBooking(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)

	// Use intermediate struct to parse string IDs and dates from frontend
	var req struct {
		ItemID        string  `json:"itemId"`
		StartDate     string  `json:"startDate"`
		EndDate       string  `json:"endDate"`
		TotalPrice    float64 `json:"totalPrice"`
		PickupAddress string  `json:"pickupAddress"`
		DropAddress   string  `json:"dropAddress"`
		Notes         string  `json:"notes"`
	}
	DecodeJSON(r, &req)

	// Parse itemId string to ObjectID
	itemID, err := primitive.ObjectIDFromHex(req.ItemID)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid item ID")
		return
	}

	// Parse dates
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid start date format")
		return
	}
	endDate, err := time.Parse(time.RFC3339, req.EndDate)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid end date format")
		return
	}

	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get item to find owner
	var item Item
	if err := GetCollection("items").FindOne(ctx, bson.M{"_id": itemID}).Decode(&item); err != nil {
		JSONError(w, http.StatusNotFound, "Item not found")
		return
	}

	booking := Booking{
		ID:            primitive.NewObjectID(),
		TrackingID:    generateTrackingID(),
		ItemID:        itemID,
		RenterID:      userID,
		OwnerID:       item.OwnerID,
		StartDate:     startDate,
		EndDate:       endDate,
		TotalPrice:    req.TotalPrice,
		Status:        "pending",
		PaymentStatus: "pending",
		PickupAddress: req.PickupAddress,
		DropAddress:   req.DropAddress,
		Notes:         req.Notes,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	collection.InsertOne(ctx, booking)
	JSON(w, http.StatusCreated, map[string]interface{}{"message": "Booking created", "booking": booking})
}

func getMyBookings(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"renterId": userID}, options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}))
	defer cursor.Close(ctx)

	var bookings []Booking
	cursor.All(ctx, &bookings)

	// Populate item for each booking
	itemCol := GetCollection("items")
	userCol := GetCollection("users")

	type PopulatedBooking struct {
		ID            primitive.ObjectID `json:"id" bson:"_id"`
		TrackingID    string             `json:"trackingId" bson:"trackingId"`
		ItemID        primitive.ObjectID `json:"itemId" bson:"itemId"`
		RenterID      primitive.ObjectID `json:"renterId" bson:"renterId"`
		OwnerID       primitive.ObjectID `json:"ownerId" bson:"ownerId"`
		StartDate     time.Time          `json:"startDate" bson:"startDate"`
		EndDate       time.Time          `json:"endDate" bson:"endDate"`
		TotalAmount   float64            `json:"totalPrice" bson:"totalPrice"`
		Status        string             `json:"status" bson:"status"`
		PaymentStatus string             `json:"paymentStatus" bson:"paymentStatus"`
		PickupAddress string             `json:"pickupAddress" bson:"pickupAddress"`
		DropAddress   string             `json:"dropAddress" bson:"dropAddress"`
		Notes         string             `json:"notes" bson:"notes"`
		CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
		UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
		Item          *Item              `json:"item,omitempty"`
		Owner         *User              `json:"owner,omitempty"`
	}

	var populatedBookings []PopulatedBooking
	for _, b := range bookings {
		pb := PopulatedBooking{
			ID:            b.ID,
			TrackingID:    b.TrackingID,
			ItemID:        b.ItemID,
			RenterID:      b.RenterID,
			OwnerID:       b.OwnerID,
			StartDate:     b.StartDate,
			EndDate:       b.EndDate,
			TotalAmount:   b.TotalPrice,
			Status:        b.Status,
			PaymentStatus: b.PaymentStatus,
			PickupAddress: b.PickupAddress,
			DropAddress:   b.DropAddress,
			Notes:         b.Notes,
			CreatedAt:     b.CreatedAt,
			UpdatedAt:     b.UpdatedAt,
		}

		// Populate item
		var item Item
		if err := itemCol.FindOne(ctx, bson.M{"_id": b.ItemID}).Decode(&item); err == nil {
			pb.Item = &Item{
				ID: item.ID, Title: item.Title, Images: item.Images, Price: item.Price, 
				Category: item.Category, Location: item.Location, Description: item.Description,
				Rating: item.Rating, Reviews: item.Reviews,
			}
		}

		// Populate owner
		var owner User
		if err := userCol.FindOne(ctx, bson.M{"_id": b.OwnerID}).Decode(&owner); err == nil {
			pb.Owner = &User{
				ID: owner.ID, Name: owner.Name, Avatar: owner.Avatar,
				Rating: owner.Rating, TotalRatings: owner.TotalRatings,
			}
		}

		populatedBookings = append(populatedBookings, pb)
	}

	JSON(w, http.StatusOK, map[string]interface{}{"bookings": populatedBookings, "total": len(populatedBookings)})
}

func getOwnerBookings(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"ownerId": userID}, options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}))
	defer cursor.Close(ctx)

	var bookings []Booking
	cursor.All(ctx, &bookings)

	// Populate item and renter for each booking
	itemCol := GetCollection("items")
	userCol := GetCollection("users")

	type PopulatedBooking struct {
		ID            primitive.ObjectID `json:"id" bson:"_id"`
		TrackingID    string             `json:"trackingId" bson:"trackingId"`
		ItemID        primitive.ObjectID `json:"itemId" bson:"itemId"`
		RenterID      primitive.ObjectID `json:"renterId" bson:"renterId"`
		OwnerID       primitive.ObjectID `json:"ownerId" bson:"ownerId"`
		StartDate     time.Time          `json:"startDate" bson:"startDate"`
		EndDate       time.Time          `json:"endDate" bson:"endDate"`
		TotalAmount   float64            `json:"totalPrice" bson:"totalPrice"`
		Status        string             `json:"status" bson:"status"`
		PaymentStatus string             `json:"paymentStatus" bson:"paymentStatus"`
		PickupAddress string             `json:"pickupAddress" bson:"pickupAddress"`
		DropAddress   string             `json:"dropAddress" bson:"dropAddress"`
		Notes         string             `json:"notes" bson:"notes"`
		CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
		UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
		Item          *Item              `json:"item,omitempty"`
		Renter        *User              `json:"renter,omitempty"`
	}

	var populatedBookings []PopulatedBooking
	for _, b := range bookings {
		pb := PopulatedBooking{
			ID:            b.ID,
			TrackingID:    b.TrackingID,
			ItemID:        b.ItemID,
			RenterID:      b.RenterID,
			OwnerID:       b.OwnerID,
			StartDate:     b.StartDate,
			EndDate:       b.EndDate,
			TotalAmount:   b.TotalPrice,
			Status:        b.Status,
			PaymentStatus: b.PaymentStatus,
			PickupAddress: b.PickupAddress,
			DropAddress:   b.DropAddress,
			Notes:         b.Notes,
			CreatedAt:     b.CreatedAt,
			UpdatedAt:     b.UpdatedAt,
		}

		// Populate item
		var item Item
		if err := itemCol.FindOne(ctx, bson.M{"_id": b.ItemID}).Decode(&item); err == nil {
			pb.Item = &Item{
				ID: item.ID, Title: item.Title, Images: item.Images, Price: item.Price, 
				Category: item.Category, Location: item.Location, Description: item.Description,
				Rating: item.Rating, Reviews: item.Reviews,
			}
		}

		// Populate renter
		var renter User
		if err := userCol.FindOne(ctx, bson.M{"_id": b.RenterID}).Decode(&renter); err == nil {
			pb.Renter = &User{
				ID: renter.ID, Name: renter.Name, Avatar: renter.Avatar,
				Rating: renter.Rating, TotalRatings: renter.TotalRatings,
			}
		}

		populatedBookings = append(populatedBookings, pb)
	}

	JSON(w, http.StatusOK, map[string]interface{}{"bookings": populatedBookings, "total": len(populatedBookings)})
}

func getBooking(w http.ResponseWriter, r *http.Request, id string) {
	bookingID, _ := primitive.ObjectIDFromHex(id)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var booking Booking
	if err := collection.FindOne(ctx, bson.M{"_id": bookingID}).Decode(&booking); err != nil {
		JSONError(w, http.StatusNotFound, "Booking not found")
		return
	}

	// Populate Item, Owner, Renter
	itemCol := GetCollection("items")
	userCol := GetCollection("users")

	type PopulatedBooking struct {
		ID            primitive.ObjectID `json:"id" bson:"_id"`
		TrackingID    string             `json:"trackingId" bson:"trackingId"`
		ItemID        primitive.ObjectID `json:"itemId" bson:"itemId"`
		RenterID      primitive.ObjectID `json:"renterId" bson:"renterId"`
		OwnerID       primitive.ObjectID `json:"ownerId" bson:"ownerId"`
		StartDate     time.Time          `json:"startDate" bson:"startDate"`
		EndDate       time.Time          `json:"endDate" bson:"endDate"`
		TotalAmount   float64            `json:"totalPrice" bson:"totalPrice"`
		Status        string             `json:"status" bson:"status"`
		PaymentStatus string             `json:"paymentStatus" bson:"paymentStatus"`
		PickupAddress string             `json:"pickupAddress" bson:"pickupAddress"`
		DropAddress   string             `json:"dropAddress" bson:"dropAddress"`
		Notes         string             `json:"notes" bson:"notes"`
		CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
		UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
		Item          *Item              `json:"item,omitempty"`
		Owner         *User              `json:"owner,omitempty"`
		Renter        *User              `json:"renter,omitempty"`
	}

	pb := PopulatedBooking{
		ID:            booking.ID,
		TrackingID:    booking.TrackingID,
		ItemID:        booking.ItemID,
		RenterID:      booking.RenterID,
		OwnerID:       booking.OwnerID,
		StartDate:     booking.StartDate,
		EndDate:       booking.EndDate,
		TotalAmount:   booking.TotalPrice,
		Status:        booking.Status,
		PaymentStatus: booking.PaymentStatus,
		PickupAddress: booking.PickupAddress,
		DropAddress:   booking.DropAddress,
		Notes:         booking.Notes,
		CreatedAt:     booking.CreatedAt,
		UpdatedAt:     booking.UpdatedAt,
	}

	var item Item
	if err := itemCol.FindOne(ctx, bson.M{"_id": booking.ItemID}).Decode(&item); err == nil {
		pb.Item = &Item{
			ID: item.ID, Title: item.Title, Images: item.Images, Price: item.Price, 
			Category: item.Category, Location: item.Location, Description: item.Description,
			Rating: item.Rating, Reviews: item.Reviews,
		}
	}

	var owner User
	if err := userCol.FindOne(ctx, bson.M{"_id": booking.OwnerID}).Decode(&owner); err == nil {
		pb.Owner = &User{
			ID: owner.ID, Name: owner.Name, Avatar: owner.Avatar,
			Rating: owner.Rating, TotalRatings: owner.TotalRatings,
		}
	}

	var renter User
	if err := userCol.FindOne(ctx, bson.M{"_id": booking.RenterID}).Decode(&renter); err == nil {
		pb.Renter = &User{
			ID: renter.ID, Name: renter.Name, Avatar: renter.Avatar,
			Rating: renter.Rating, TotalRatings: renter.TotalRatings,
		}
	}

	JSON(w, http.StatusOK, map[string]interface{}{"booking": pb})
}

func updateBookingStatus(w http.ResponseWriter, r *http.Request, id string) {
	bookingID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid booking ID")
		return
	}

	var req struct {
		Status string `json:"status"`
		Reason string `json:"reason"`
	}
	DecodeJSON(r, &req)

	userID, _ := GetUserID(r)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get current booking to verify permissions
	var booking Booking
	if err := collection.FindOne(ctx, bson.M{"_id": bookingID}).Decode(&booking); err != nil {
		JSONError(w, http.StatusNotFound, "Booking not found")
		return
	}

	update := bson.M{}

	if req.Status == "cancelled" {
		// Both Owner and Renter can cancel
		if booking.OwnerID != userID && booking.RenterID != userID {
			JSONError(w, http.StatusForbidden, "Not authorized to cancel this booking")
			return
		}
		
		// Only allow cancelling properly (pending or confirmed)
		if booking.Status == "completed" || booking.Status == "rejected" || booking.Status == "cancelled" {
			JSONError(w, http.StatusBadRequest, "Cannot cancel a booking that is "+booking.Status)
			return
		}

		update = bson.M{
			"$set": bson.M{
				"status":             "cancelled",
				"updatedAt":          time.Now(),
				"cancelledBy":        userID,
				"cancellationReason": req.Reason,
			},
		}

	} else if req.Status == "confirmed" || req.Status == "rejected" {
		// Only Owner can confirm or reject
		if booking.OwnerID != userID {
			JSONError(w, http.StatusForbidden, "Only the owner can update status")
			return
		}
		update = bson.M{
			"$set": bson.M{
				"status":    req.Status,
				"updatedAt": time.Now(),
			},
		}
	} else {
		JSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": bookingID}, update)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to update booking")
		return
	}

	// If confirmed, increment Renter's TotalBookings
	if req.Status == "confirmed" {
		userCol := GetCollection("users")
		_, err = userCol.UpdateOne(ctx, bson.M{"_id": booking.RenterID}, bson.M{"$inc": bson.M{"totalBookings": 1}})
		if err != nil {
			// Log error but don't fail the request
			fmt.Println("Error incrementing totalBookings:", err)
		}
	}

	JSON(w, http.StatusOK, map[string]string{"message": "Booking updated"})
}
