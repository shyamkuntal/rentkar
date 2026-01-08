package backend

import (
	"context"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type RegisterReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Phone    string `json:"phone"`
}

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// HandleRegister handles user registration
func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req RegisterReq
	if err := DecodeJSON(r, &req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	if req.Email == "" || req.Password == "" || req.Name == "" {
		JSONError(w, http.StatusBadRequest, "Email, password, and name required")
		return
	}

	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check existing user
	var existing User
	if err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existing); err == nil {
		JSONError(w, http.StatusConflict, "Email already exists")
		return
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	// Create user
	user := User{
		ID:        primitive.NewObjectID(),
		Email:     req.Email,
		Password:  string(hash),
		Name:      req.Name,
		Phone:     req.Phone,
		Avatar:    "https://randomuser.me/api/portraits/men/1.jpg",
		Rating:    0,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if _, err := collection.InsertOne(ctx, user); err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	token, _ := GenerateToken(user.ID, user.Email)

	JSON(w, http.StatusCreated, map[string]interface{}{
		"message": "User registered successfully",
		"token":   token,
		"user": map[string]interface{}{
			"id":     user.ID,
			"email":  user.Email,
			"name":   user.Name,
			"phone":  user.Phone,
			"avatar": user.Avatar,
		},
	})
}

// HandleLogin handles user login
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req LoginReq
	if err := DecodeJSON(r, &req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User
	if err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user); err != nil {
		JSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		JSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	token, _ := GenerateToken(user.ID, user.Email)

	// Calculate real counts
	itemsCollection := GetCollection("items")
	listingsCount, _ := itemsCollection.CountDocuments(ctx, bson.M{"ownerId": user.ID})

	bookingsCollection := GetCollection("bookings")
	rentalsCount, _ := bookingsCollection.CountDocuments(ctx, bson.M{"userId": user.ID})

	JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"token":   token,
		"user": map[string]interface{}{
			"id":            user.ID,
			"email":         user.Email,
			"name":          user.Name,
			"phone":         user.Phone,
			"avatar":        user.Avatar,
			"location":      user.Location,
			"rating":        user.Rating,
			"listingsCount": listingsCount,
			"rentalsCount":  rentalsCount,
			"totalListings": listingsCount,
			"totalBookings": rentalsCount,
		},
	})
}

// HandleGetMe gets current user
func HandleGetMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := GetUserID(r)
	if err != nil {
		JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User
	if err := collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
		JSONError(w, http.StatusNotFound, "User not found")
		return
	}

	// Calculate real counts
	itemsCollection := GetCollection("items")
	listingsCount, _ := itemsCollection.CountDocuments(ctx, bson.M{"ownerId": userID})

	bookingsCollection := GetCollection("bookings")
	rentalsCount, _ := bookingsCollection.CountDocuments(ctx, bson.M{"userId": userID})

	JSON(w, http.StatusOK, map[string]interface{}{
		"user": map[string]interface{}{
			"id":            user.ID,
			"email":         user.Email,
			"name":          user.Name,
			"phone":         user.Phone,
			"avatar":        user.Avatar,
			"location":      user.Location,
			"rating":        user.Rating,
			"totalRatings":  user.TotalRatings,
			"listingsCount": listingsCount,
			"rentalsCount":  rentalsCount,
			"totalListings": listingsCount, // Keep backward compatibility if needed
			"totalBookings": rentalsCount,
		},
	})
}
