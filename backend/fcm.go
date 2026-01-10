package backend

import (
	"context"
	"log"
	"os"
	"sync"
	"time"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/api/option"
)

var (
	fcmClient     *messaging.Client
	fcmClientOnce sync.Once
	fcmInitError  error
)

// InitFCM initializes the Firebase Cloud Messaging client
func InitFCM() error {
	fcmClientOnce.Do(func() {
		ctx := context.Background()

		// Read service account JSON file
		credentialsJSON, err := os.ReadFile("Rentkar Firebase Admin SDK.json")
		if err != nil {
			log.Printf("Error reading Firebase credentials file: %v", err)
			fcmInitError = err
			return
		}

		// Use credentials JSON instead of deprecated file path
		opt := option.WithCredentialsJSON(credentialsJSON)

		app, err := firebase.NewApp(ctx, nil, opt)
		if err != nil {
			log.Printf("Error initializing Firebase app: %v", err)
			fcmInitError = err
			return
		}

		fcmClient, err = app.Messaging(ctx)
		if err != nil {
			log.Printf("Error getting Messaging client: %v", err)
			fcmInitError = err
			return
		}

		log.Println("FCM client initialized successfully")
	})

	return fcmInitError
}

// SendPushNotification sends a push notification to a specific user
func SendPushNotification(userID primitive.ObjectID, title, body string, data map[string]string) error {
	// Initialize FCM if not already done
	if err := InitFCM(); err != nil {
		log.Printf("FCM not initialized: %v", err)
		return err
	}

	if fcmClient == nil {
		log.Println("FCM client is nil, skipping push notification")
		return nil
	}

	// Get user's FCM token from database
	collection := GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	var user User
	if err := collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
		log.Printf("Error finding user for push notification: %v", err)
		return err
	}

	if user.FCMToken == "" {
		log.Printf("User %s has no FCM token, skipping push notification", userID.Hex())
		return nil
	}

	// Create the message
	message := &messaging.Message{
		Token: user.FCMToken,
		Notification: &messaging.Notification{
			Title: title,
			Body:  body,
		},
		Data: data,
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Notification: &messaging.AndroidNotification{
				Sound:       "default",
				ClickAction: "FLUTTER_NOTIFICATION_CLICK",
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Sound: "default",
					Badge: intPtr(1),
				},
			},
		},
	}

	// Send the message
	response, err := fcmClient.Send(ctx, message)
	if err != nil {
		log.Printf("Error sending FCM message: %v", err)
		return err
	}

	log.Printf("Push notification sent successfully. Message ID: %s", response)
	return nil
}

// Helper function to create int pointer
func intPtr(i int) *int {
	return &i
}

// SendChatPushNotification sends push notification for new chat message
func SendChatPushNotification(recipientID primitive.ObjectID, senderName, message, chatID string) {
	title := "New message from " + senderName

	// Truncate message for preview
	preview := message
	if len(preview) > 100 {
		preview = preview[:100] + "..."
	}

	data := map[string]string{
		"type":   "chat",
		"chatId": chatID,
	}

	go func() {
		if err := SendPushNotification(recipientID, title, preview, data); err != nil {
			log.Printf("Failed to send chat push notification: %v", err)
		}
	}()
}

// SendBookingPushNotification sends push notification for booking events
func SendBookingPushNotification(recipientID primitive.ObjectID, action, itemTitle, bookingID string) {
	var title, body string

	switch action {
	case "new_request":
		title = "New Booking Request"
		body = "Someone wants to rent your " + itemTitle
	case "confirmed":
		title = "Booking Confirmed!"
		body = "Your booking for " + itemTitle + " has been confirmed"
	case "rejected":
		title = "Booking Rejected"
		body = "Your booking for " + itemTitle + " was not approved"
	case "cancelled":
		title = "Booking Cancelled"
		body = "A booking for " + itemTitle + " has been cancelled"
	default:
		title = "Booking Update"
		body = "There's an update on your booking for " + itemTitle
	}

	data := map[string]string{
		"type":      "booking",
		"bookingId": bookingID,
		"action":    action,
	}

	go func() {
		if err := SendPushNotification(recipientID, title, body, data); err != nil {
			log.Printf("Failed to send booking push notification: %v", err)
		}
	}()
}
