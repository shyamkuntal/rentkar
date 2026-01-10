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
	FCMToken      string             `json:"fcmToken,omitempty" bson:"fcmToken,omitempty"`
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
	Brand       string             `json:"brand,omitempty" bson:"brand,omitempty"`
	Model       string             `json:"model,omitempty" bson:"model,omitempty"`
	Attributes  map[string]string  `json:"attributes,omitempty" bson:"attributes,omitempty"`
	Price       float64            `json:"price" bson:"price"`
	Location    string             `json:"location" bson:"location"`
	Images      []string           `json:"images" bson:"images"`
	OwnerID     primitive.ObjectID `json:"ownerId" bson:"ownerId"`
	Owner       *User              `json:"owner,omitempty" bson:"-"`
	Status      string             `json:"status" bson:"status"`
	Views       int                `json:"views" bson:"views"`
	Favorites   int                `json:"favorites" bson:"favorites"`
	Rating      float64            `json:"rating" bson:"rating"`
	Reviews     int                `json:"reviews" bson:"reviews"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Booking model
type Booking struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	TrackingID    string             `json:"trackingId" bson:"trackingId"`
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
	PaymentStatus      string             `json:"paymentStatus" bson:"paymentStatus"`
	PickupAddress      string             `json:"pickupAddress" bson:"pickupAddress"`
	DropAddress        string             `json:"dropAddress" bson:"dropAddress"`
	Notes              string             `json:"notes" bson:"notes"`
	CancelledBy        primitive.ObjectID `json:"cancelledBy,omitempty" bson:"cancelledBy,omitempty"`
	CancellationReason string             `json:"cancellationReason,omitempty" bson:"cancellationReason,omitempty"`
	CreatedAt          time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt          time.Time          `json:"updatedAt" bson:"updatedAt"`
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

// BlockedUser model
type BlockedUser struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID    primitive.ObjectID `json:"userId" bson:"userId"`       // Who blocked
	BlockedID primitive.ObjectID `json:"blockedId" bson:"blockedId"` // Who is blocked
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}

// Report model
type Report struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ReporterID  primitive.ObjectID `json:"reporterId" bson:"reporterId"`
	ReportedID  primitive.ObjectID `json:"reportedId" bson:"reportedId"` // User ID or Item ID
	TargetType  string             `json:"targetType" bson:"targetType"` // "user" or "item"
	Reason      string             `json:"reason" bson:"reason"`
	Description string             `json:"description" bson:"description"`
	Status      string             `json:"status" bson:"status"` // "pending", "resolved"
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
}

// Review model - for item and user reviews
type Review struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	BookingID  primitive.ObjectID `json:"bookingId" bson:"bookingId"`
	ReviewerID primitive.ObjectID `json:"reviewerId" bson:"reviewerId"`
	Reviewer   *User              `json:"reviewer,omitempty" bson:"-"`
	TargetType string             `json:"targetType" bson:"targetType"` // "item" or "user"
	TargetID   primitive.ObjectID `json:"targetId" bson:"targetId"`
	Rating     int                `json:"rating" bson:"rating"`   // 1-5 stars
	Comment    string             `json:"comment" bson:"comment"` // max 100 chars
	CreatedAt  time.Time          `json:"createdAt" bson:"createdAt"`
}
