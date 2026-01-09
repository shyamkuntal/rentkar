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

func HandleFavorites(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		getFavorites(w, r)
	} else {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleFavoriteByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/favorites/")
	switch r.Method {
	case http.MethodPost:
		addFavorite(w, r, id)
	case http.MethodDelete:
		removeFavorite(w, r, id)
	case http.MethodGet:
		if strings.HasSuffix(id, "/check") {
			checkFavorite(w, r, strings.TrimSuffix(id, "/check"))
		}
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func getFavorites(w http.ResponseWriter, r *http.Request) {
	userID, _ := GetUserID(r)
	collection := GetCollection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := collection.Find(ctx, bson.M{"userId": userID}, options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}))
	defer cursor.Close(ctx)

	var favorites []Favorite
	cursor.All(ctx, &favorites)

	// Populate item details for each favorite
	itemCol := GetCollection("items")
	type PopulatedFavorite struct {
		ID        primitive.ObjectID `json:"id"`
		Title     string             `json:"title"`
		Images    []string           `json:"images"`
		Price     float64            `json:"price"`
		Category  string             `json:"category"`
		Rating    float64            `json:"rating,omitempty"`
		CreatedAt time.Time          `json:"createdAt"`
	}

	var populatedFavorites []PopulatedFavorite
	for _, fav := range favorites {
		var item Item
		if err := itemCol.FindOne(ctx, bson.M{"_id": fav.ItemID}).Decode(&item); err == nil {
			populatedFavorites = append(populatedFavorites, PopulatedFavorite{
				ID:        item.ID,
				Title:     item.Title,
				Images:    item.Images,
				Price:     item.Price,
				Category:  item.Category,
				Rating:    item.Rating,
				CreatedAt: fav.CreatedAt,
			})
		}
	}

	JSON(w, http.StatusOK, map[string]interface{}{"favorites": populatedFavorites, "total": len(populatedFavorites)})
}

func addFavorite(w http.ResponseWriter, r *http.Request, itemID string) {
	userID, _ := GetUserID(r)
	itemObjID, _ := primitive.ObjectIDFromHex(itemID)

	collection := GetCollection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	favorite := Favorite{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		ItemID:    itemObjID,
		CreatedAt: time.Now(),
	}

	collection.InsertOne(ctx, favorite)
	GetCollection("items").UpdateOne(ctx, bson.M{"_id": itemObjID}, bson.M{"$inc": bson.M{"favorites": 1}})

	JSON(w, http.StatusCreated, map[string]string{"message": "Item added to favorites"})
}

func removeFavorite(w http.ResponseWriter, r *http.Request, itemID string) {
	userID, _ := GetUserID(r)
	itemObjID, _ := primitive.ObjectIDFromHex(itemID)

	collection := GetCollection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection.DeleteOne(ctx, bson.M{"userId": userID, "itemId": itemObjID})
	GetCollection("items").UpdateOne(ctx, bson.M{"_id": itemObjID}, bson.M{"$inc": bson.M{"favorites": -1}})

	JSON(w, http.StatusOK, map[string]string{"message": "Item removed from favorites"})
}

func checkFavorite(w http.ResponseWriter, r *http.Request, itemID string) {
	userID, _ := GetUserID(r)
	itemObjID, _ := primitive.ObjectIDFromHex(itemID)

	collection := GetCollection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var fav Favorite
	err := collection.FindOne(ctx, bson.M{"userId": userID, "itemId": itemObjID}).Decode(&fav)

	JSON(w, http.StatusOK, map[string]bool{"isFavorite": err == nil})
}
