# RentKar Backend API

Complete REST API backend using Go standard library (`net/http`).

## 📁 Project Structure

```
backend/
├── cmd/
│   └── backend/
│       └── main.go           # Entry point
├── models.go                  # All data models
├── database.go                # MongoDB connection
├── middleware.go              # JWT auth middleware
├── router.go                  # Route setup & helpers
├── auth_handler.go            # Auth endpoints
├── item_handler.go            # Item CRUD
├── booking_handler.go         # Booking management
├── chat_handler.go            # Chat & messaging
├── favorite_handler.go        # Favorites
├── user_handler.go            # User profiles
├── go.mod                     # Dependencies
└── .env.example               # Config template
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
go mod download

# 2. Copy environment file
cp .env.example .env

# 3. Start MongoDB (if not running)
brew services start mongodb-community

# 4. Run the server
go run cmd/backend/main.go
```

Server runs on `http://localhost:8080`

## 📊 Database Schemas

### User
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "name": "string",
  "phone": "string",
  "avatar": "string (URL)",
  "location": "string",
  "rating": "float64",
  "totalRatings": "int",
  "totalListings": "int",
  "totalBookings": "int",
  "createdAt": "time.Time",
  "updatedAt": "time.Time"
}
```

### Item
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "category": "string",
  "subCategory": "string",
  "price": "float64 (per day)",
  "location": "string",
  "images": ["string"],
  "ownerId": "ObjectId",
  "status": "string (active|rented|inactive)",
  "views": "int",
  "favorites": "int",
  "createdAt": "time.Time",
  "updatedAt": "time.Time"
}
```

### Booking
```json
{
  "_id": "ObjectId",
  "itemId": "ObjectId",
  "renterId": "ObjectId",
  "ownerId": "ObjectId",
  "startDate": "time.Time",
  "endDate": "time.Time",
  "totalPrice": "float64",
  "status": "string (pending|confirmed|completed|cancelled)",
  "paymentStatus": "string (pending|paid|refunded)",
  "createdAt": "time.Time",
  "updatedAt": "time.Time"
}
```

### Chat
```json
{
  "_id": "ObjectId",
  "participants": ["ObjectId"],
  "itemId": "ObjectId",
  "unreadCount": "map[string]int",
  "createdAt": "time.Time",
  "updatedAt": "time.Time"
}
```

### Message
```json
{
  "_id": "ObjectId",
  "chatId": "ObjectId",
  "senderId": "ObjectId",
  "content": "string",
  "isRead": "bool",
  "createdAt": "time.Time"
}
```

### Favorite
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "itemId": "ObjectId",
  "createdAt": "time.Time"
}
```

## 🔐 Authentication

Protected routes require JWT token in `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 API Endpoints

### Auth APIs

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+91-9876543210"
}

# cURL
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

#### Login
```bash
POST /api/auth/login

{
  "email": "user@example.com",
  "password": "password123"
}

# cURL
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Item APIs

#### Get All Items
```bash
GET /api/items?category=Electronics&search=camera

# cURL
curl "http://localhost:8080/api/items?category=Electronics"
```

#### Get Single Item
```bash
GET /api/items/:id

# cURL
curl http://localhost:8080/api/items/ITEM_ID
```

#### Create Item
```bash
POST /api/items
Authorization: Bearer TOKEN

{
  "title": "Camera",
  "description": "Professional camera",
  "category": "Electronics",
  "price": 1200,
  "location": "Mumbai",
  "images": ["https://..."]
}

# cURL
curl -X POST http://localhost:8080/api/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Camera","description":"Test","category":"Electronics","price":500,"location":"Mumbai","images":["https://example.com/img.jpg"]}'
```

#### Update Item
```bash
PUT /api/items/:id
Authorization: Bearer TOKEN

{
  "price": 1000,
  "description": "Updated"
}

# cURL
curl -X PUT http://localhost:8080/api/items/ITEM_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":1000}'
```

#### Delete Item
```bash
DELETE /api/items/:id
Authorization: Bearer TOKEN

# cURL
curl -X DELETE http://localhost:8080/api/items/ITEM_ID \
  -H "Authorization: Bearer TOKEN"
```

#### Get My Listings
```bash
GET /api/items/my/listings
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/items/my/listings \
  -H "Authorization: Bearer TOKEN"
```

### Booking APIs

#### Create Booking
```bash
POST /api/bookings
Authorization: Bearer TOKEN

{
  "itemId": "ITEM_ID",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-05T00:00:00Z",
  "totalPrice": 4800
}

# cURL
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemId":"ITEM_ID","startDate":"2024-02-01T00:00:00Z","endDate":"2024-02-05T00:00:00Z","totalPrice":4800}'
```

#### Get My Bookings
```bash
GET /api/bookings
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/bookings \
  -H "Authorization: Bearer TOKEN"
```

#### Update Booking Status
```bash
PATCH /api/bookings/:id
Authorization: Bearer TOKEN

{
  "status": "confirmed"
}

# cURL
curl -X PATCH http://localhost:8080/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

### Chat APIs

#### Get All Chats
```bash
GET /api/chats
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/chats \
  -H "Authorization: Bearer TOKEN"
```

#### Create Chat
```bash
POST /api/chats
Authorization: Bearer TOKEN

{
  "itemId": "ITEM_ID",
  "participantId": "USER_ID"
}

# cURL
curl -X POST http://localhost:8080/api/chats \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemId":"ITEM_ID","participantId":"USER_ID"}'
```

#### Get Messages
```bash
GET /api/chats/:id/messages
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/chats/CHAT_ID/messages \
  -H "Authorization: Bearer TOKEN"
```

#### Send Message
```bash
POST /api/chats/messages
Authorization: Bearer TOKEN

{
  "chatId": "CHAT_ID",
  "content": "Hello!"
}

# cURL
curl -X POST http://localhost:8080/api/chats/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"chatId":"CHAT_ID","content":"Hello!"}'
```

### Favorite APIs

#### Get Favorites
```bash
GET /api/favorites
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/favorites \
  -H "Authorization: Bearer TOKEN"
```

#### Add to Favorites
```bash
POST /api/favorites/:id
Authorization: Bearer TOKEN

# cURL
curl -X POST http://localhost:8080/api/favorites/ITEM_ID \
  -H "Authorization: Bearer TOKEN"
```

#### Remove from Favorites
```bash
DELETE /api/favorites/:id
Authorization: Bearer TOKEN

# cURL
curl -X DELETE http://localhost:8080/api/favorites/ITEM_ID \
  -H "Authorization: Bearer TOKEN"
```

#### Check if Favorited
```bash
GET /api/favorites/:id/check
Authorization: Bearer TOKEN

# cURL
curl http://localhost:8080/api/favorites/ITEM_ID/check \
  -H "Authorization: Bearer TOKEN"
```

### User APIs

#### Get User Profile
```bash
GET /api/users/:id

# cURL
curl http://localhost:8080/api/users/USER_ID
```

#### Update Profile
```bash
PUT /api/users/profile
Authorization: Bearer TOKEN

{
  "name": "Updated Name",
  "phone": "+91-1234567890",
  "location": "Delhi"
}

# cURL
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","location":"Delhi"}'
```

## ⚙️ Environment Variables

Create `.env` file:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017
DB_NAME=rentkar
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=24h
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:8080/health

# Complete flow
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}' \
  | jq -r '.token')

# 2. Create item
curl -X POST http://localhost:8080/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Item","description":"Desc","category":"Electronics","price":100,"location":"Mumbai","images":["https://test.com/img.jpg"]}'

# 3. Get all items
curl http://localhost:8080/api/items
```

## 📦 Dependencies

- `go.mongodb.org/mongo-driver` - MongoDB driver
- `github.com/golang-jwt/jwt/v5` - JWT tokens
- `golang.org/x/crypto/bcrypt` - Password hashing

Install:
```bash
go get go.mongodb.org/mongo-driver/mongo
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
```

## 🔥 Error Responses

All errors return:
```json
{
  "error": "Error message"
}
```

Status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📝 Notes

- Uses Go standard `net/http` library only
- Simple flat file structure
- JWT authentication
- MongoDB for data storage
- CORS enabled for all origins
- Graceful shutdown support

---

**Version:** 1.0.0
**Last Updated:** January 2026
