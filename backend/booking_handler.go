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

func HandleBookingByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/bookings/")
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
	var booking Booking
	DecodeJSON(r, &booking)

	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get item
	var item Item
	GetCollection("items").FindOne(ctx, bson.M{"_id": booking.ItemID}).Decode(&item)

	booking.ID = primitive.NewObjectID()
	booking.RenterID = userID
	booking.OwnerID = item.OwnerID
	booking.Status = "pending"
	booking.PaymentStatus = "pending"
	booking.CreatedAt = time.Now()
	booking.UpdatedAt = time.Now()

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

	JSON(w, http.StatusOK, map[string]interface{}{"bookings": bookings, "total": len(bookings)})
}

func getBooking(w http.ResponseWriter, r *http.Request, id string) {
	bookingID, _ := primitive.ObjectIDFromHex(id)
	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var booking Booking
	collection.FindOne(ctx, bson.M{"_id": bookingID}).Decode(&booking)
	JSON(w, http.StatusOK, map[string]interface{}{"booking": booking})
}

func updateBookingStatus(w http.ResponseWriter, r *http.Request, id string) {
	bookingID, _ := primitive.ObjectIDFromHex(id)
	var req struct {
		Status string `json:"status"`
	}
	DecodeJSON(r, &req)

	collection := GetCollection("bookings")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection.UpdateOne(ctx, bson.M{"_id": bookingID}, bson.M{"$set": bson.M{"status": req.Status, "updatedAt": time.Now()}})
	JSON(w, http.StatusOK, map[string]string{"message": "Booking updated"})
}
