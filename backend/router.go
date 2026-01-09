package backend

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

// SetupRouter sets up all routes
func SetupRouter() http.Handler {
	mux := http.NewServeMux()

	// Apply CORS middleware
	handler := corsMiddleware(mux)

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		JSON(w, http.StatusOK, map[string]interface{}{
			"status": "ok",
			"time":   time.Now(),
		})
	})

	// Auth routes
	mux.HandleFunc("/api/auth/register", HandleRegister)
	mux.HandleFunc("/api/auth/login", HandleLogin)
	mux.HandleFunc("/api/auth/me", AuthMiddleware(HandleGetMe))

	// User routes
	mux.HandleFunc("/api/users/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/block") {
			AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
				if r.Method == http.MethodPost {
					HandleBlockUser(w, r)
				} else if r.Method == http.MethodDelete {
					HandleUnblockUser(w, r)
				}
			})(w, r)
			return
		}
		HandleUserRoutes(w, r)
	})

	// Report routes
	mux.HandleFunc("/api/reports", AuthMiddleware(HandleReport))

	// Item routes
	mux.HandleFunc("/api/items", HandleItems)
	mux.HandleFunc("/api/items/", HandleItemByID)
	mux.HandleFunc("/api/items/my/listings", AuthMiddleware(HandleMyListings))

	// Booking routes - IMPORTANT: specific routes must come before wildcard /api/bookings/
	mux.HandleFunc("/api/bookings", AuthMiddleware(HandleBookings))
	mux.HandleFunc("/api/bookings/owner", AuthMiddleware(HandleOwnerBookings))
	mux.HandleFunc("/api/bookings/pending-count", AuthMiddleware(HandlePendingRequestsCount))
	mux.HandleFunc("/api/bookings/", AuthMiddleware(HandleBookingByID))

	//Chat routes
	mux.HandleFunc("/api/chats", AuthMiddleware(HandleChats))
	mux.HandleFunc("/api/chats/unread-count", AuthMiddleware(HandleUnreadCount))
	mux.HandleFunc("/api/chats/", AuthMiddleware(HandleChatByID))
	mux.HandleFunc("/api/chats/messages", AuthMiddleware(HandleSendMessage))

	// WebSocket for real-time chat (handles auth internally)
	mux.HandleFunc("/ws", HandleWebSocket)

	// Favorite routes
	mux.HandleFunc("/api/favorites", AuthMiddleware(HandleFavorites))
	mux.HandleFunc("/api/favorites/", AuthMiddleware(HandleFavoriteByID))

	// Review routes
	mux.HandleFunc("/api/reviews", AuthMiddleware(HandleReviews))
	mux.HandleFunc("/api/reviews/item/", HandleReviewsByItem)
	mux.HandleFunc("/api/reviews/user/", HandleReviewsByUser)
	mux.HandleFunc("/api/reviews/booking/", AuthMiddleware(HandleReviewsByBooking))

	return handler
}

// corsMiddleware adds CORS headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "3600")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// JSON writes JSON response
func JSON(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(data)
}

// JSONError writes error response
func JSONError(w http.ResponseWriter, code int, message string) {
	JSON(w, code, map[string]string{"error": message})
}

// DecodeJSON decodes JSON request body
func DecodeJSON(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}
