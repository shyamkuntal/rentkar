package backend

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User model
type User struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Email         string             `json:"email" bson:"email"`
	Password      string             `json:"-" bson:"password"`
	Name          string             `json:"name" bson:"name"`
	Phone         string             `json:"phone" bson:"phone"`
	Avatar        string             `json:"avatar" bson:"avatar"`
	Location      string             `json:"location" bson:"location"`
	Rating        float64            `json:"rating" bson:"rating"`
	TotalRatings  int                `json:"totalRatings" bson:"totalRatings"`
	TotalListings int                `json:"totalListings" bson:"totalListings"`
	TotalBookings int                `json:"totalBookings" bson:"totalBookings"`
	CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Item model
type Item struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Category    string             `json:"category" bson:"category"`
	SubCategory string             `json:"subCategory" bson:"subCategory"`
	Price       float64            `json:"price" bson:"price"`
	Location    string             `json:"location" bson:"location"`
	Images      []string           `json:"images" bson:"images"`
	OwnerID     primitive.ObjectID `json:"ownerId" bson:"ownerId"`
	Owner       *User              `json:"owner,omitempty" bson:"-"`
	Status      string             `json:"status" bson:"status"`
	Views       int                `json:"views" bson:"views"`
	Favorites   int                `json:"favorites" bson:"favorites"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Booking model
type Booking struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ItemID        primitive.ObjectID `json:"itemId" bson:"itemId"`
	Item          *Item              `json:"item,omitempty" bson:"-"`
	RenterID      primitive.ObjectID `json:"renterId" bson:"renterId"`
	Renter        *User              `json:"renter,omitempty" bson:"-"`
	OwnerID       primitive.ObjectID `json:"ownerId" bson:"ownerId"`
	Owner         *User              `json:"owner,omitempty" bson:"-"`
	StartDate     time.Time          `json:"startDate" bson:"startDate"`
	EndDate       time.Time          `json:"endDate" bson:"endDate"`
	TotalPrice    float64            `json:"totalPrice" bson:"totalPrice"`
	Status        string             `json:"status" bson:"status"`
	PaymentStatus string             `json:"paymentStatus" bson:"paymentStatus"`
	CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Chat model
type Chat struct {
	ID           primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Participants []primitive.ObjectID `json:"participants" bson:"participants"`
	ItemID       primitive.ObjectID   `json:"itemId" bson:"itemId"`
	Item         *Item                `json:"item,omitempty" bson:"-"`
	LastMessage  *Message             `json:"lastMessage,omitempty" bson:"-"`
	UnreadCount  map[string]int       `json:"unreadCount" bson:"unreadCount"`
	CreatedAt    time.Time            `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time            `json:"updatedAt" bson:"updatedAt"`
}

// Message model
type Message struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ChatID    primitive.ObjectID `json:"chatId" bson:"chatId"`
	SenderID  primitive.ObjectID `json:"senderId" bson:"senderId"`
	Sender    *User              `json:"sender,omitempty" bson:"-"`
	Content   string             `json:"content" bson:"content"`
	IsRead    bool               `json:"isRead" bson:"isRead"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}

// Favorite model
type Favorite struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID    primitive.ObjectID `json:"userId" bson:"userId"`
	ItemID    primitive.ObjectID `json:"itemId" bson:"itemId"`
	Item      *Item              `json:"item,omitempty" bson:"-"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}
