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

// HandleItems handles GET all items and POST create item
func HandleItems(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getItems(w, r)
	case http.MethodPost:
		AuthMiddleware(createItem)(w, r)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleItemByID handles GET, PUT, DELETE for specific item
func HandleItemByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/items/")
	if id == "" {
		JSONError(w, http.StatusBadRequest, "Invalid item ID")
		return
	}

	switch r.Method {
	case http.MethodGet:
		getItemByID(w, r, id)
	case http.MethodPut:
		AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			updateItem(w, r, id)
		})(w, r)
	case http.MethodDelete:
		AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			deleteItem(w, r, id)
		})(w, r)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleMyListings gets user's listings
func HandleMyListings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, _ := GetUserID(r)
	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"ownerId": userID}, options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}))
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to fetch items")
		return
	}
	defer cursor.Close(ctx)

	var items []Item
	cursor.All(ctx, &items)

	JSON(w, http.StatusOK, map[string]interface{}{
		"items": items,
		"total": len(items),
	})
}

func getItems(w http.ResponseWriter, r *http.Request) {
	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	
	// When filtering by specific owner, show all their items
	// Otherwise only show active items that are not currently booked
	if ownerId := r.URL.Query().Get("ownerId"); ownerId != "" {
		ownerObjId, _ := primitive.ObjectIDFromHex(ownerId)
		filter["ownerId"] = ownerObjId
		filter["status"] = "active" // Only show active items for now
	} else {
		filter["status"] = "active"
		
		// Exclude items that have active bookings (pending or confirmed)
		bookingCol := GetCollection("bookings")
		bookingCursor, err := bookingCol.Find(ctx, bson.M{
			"status": bson.M{"$in": []string{"pending", "confirmed"}},
		})
		if err == nil {
			defer bookingCursor.Close(ctx)
			var bookedItemIDs []primitive.ObjectID
			for bookingCursor.Next(ctx) {
				var booking struct {
					ItemID primitive.ObjectID `bson:"itemId"`
				}
				if err := bookingCursor.Decode(&booking); err == nil {
					bookedItemIDs = append(bookedItemIDs, booking.ItemID)
				}
			}
			if len(bookedItemIDs) > 0 {
				filter["_id"] = bson.M{"$nin": bookedItemIDs}
			}
		}
	}
	
	if cat := r.URL.Query().Get("category"); cat != "" {
		filter["category"] = cat
	}
	if search := r.URL.Query().Get("search"); search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"description": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	cursor, err := collection.Find(ctx, filter, options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}))
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to fetch items")
		return
	}
	defer cursor.Close(ctx)

	var items []Item
	cursor.All(ctx, &items)

	// Populate owners
	userCol := GetCollection("users")
	for i := range items {
		var user User
		userCol.FindOne(ctx, bson.M{"_id": items[i].OwnerID}).Decode(&user)
		items[i].Owner = &User{ID: user.ID, Name: user.Name, Avatar: user.Avatar, Rating: user.Rating}
	}

	JSON(w, http.StatusOK, map[string]interface{}{
		"items": items,
		"total": len(items),
	})
}

func getItemByID(w http.ResponseWriter, r *http.Request, id string) {
	itemID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid item ID")
		return
	}

	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var item Item
	if err := collection.FindOne(ctx, bson.M{"_id": itemID}).Decode(&item); err != nil {
		JSONError(w, http.StatusNotFound, "Item not found")
		return
	}

	// Increment views
	collection.UpdateOne(ctx, bson.M{"_id": itemID}, bson.M{"$inc": bson.M{"views": 1}})

	// Populate owner
	var user User
	GetCollection("users").FindOne(ctx, bson.M{"_id": item.OwnerID}).Decode(&user)
	item.Owner = &user

	JSON(w, http.StatusOK, map[string]interface{}{"item": item})
}

func createItem(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)

	var item Item
	if err := DecodeJSON(r, &item); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	item.ID = primitive.NewObjectID()
	item.OwnerID = userID
	item.Status = "active"
	item.Views = 0
	item.Favorites = 0
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()

	if _, err := collection.InsertOne(ctx, item); err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to create item")
		return
	}

	JSON(w, http.StatusCreated, map[string]interface{}{
		"message": "Item created successfully",
		"item":    item,
	})
}

func updateItem(w http.ResponseWriter, r *http.Request, id string) {
	userID, _ := GetUserID(r)
	itemID, _ := primitive.ObjectIDFromHex(id)

	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify ownership
	var item Item
	if err := collection.FindOne(ctx, bson.M{"_id": itemID}).Decode(&item); err != nil {
		JSONError(w, http.StatusNotFound, "Item not found")
		return
	}

	if item.OwnerID != userID {
		JSONError(w, http.StatusForbidden, "Access denied")
		return
	}

	var updateData map[string]interface{}
	DecodeJSON(r, &updateData)
	updateData["updatedAt"] = time.Now()
	delete(updateData, "_id")
	delete(updateData, "ownerId")

	collection.UpdateOne(ctx, bson.M{"_id": itemID}, bson.M{"$set": updateData})

	JSON(w, http.StatusOK, map[string]string{"message": "Item updated successfully"})
}

func deleteItem(w http.ResponseWriter, r *http.Request, id string) {
	userID, _ := GetUserID(r)
	itemID, _ := primitive.ObjectIDFromHex(id)

	collection := GetCollection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify ownership
	var item Item
	if err := collection.FindOne(ctx, bson.M{"_id": itemID}).Decode(&item); err != nil {
		JSONError(w, http.StatusNotFound, "Item not found")
		return
	}

	if item.OwnerID != userID {
		JSONError(w, http.StatusForbidden, "Access denied")
		return
	}

	collection.DeleteOne(ctx, bson.M{"_id": itemID})

	JSON(w, http.StatusOK, map[string]string{"message": "Item deleted successfully"})
}
