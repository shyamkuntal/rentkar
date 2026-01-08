# Frontend-Backend Integration Guide

## ✅ Integration Complete!

The RentKar React Native frontend is now integrated with the Go backend.

## 🔧 Setup Instructions

### 1. Start Backend Server

```bash
# Navigate to backend
cd backend

# Ensure MongoDB is running
brew services start mongodb-community

# Start server
go run cmd/backend/main.go
```

Server runs on `http://localhost:8080`

### 2. Configure API Endpoint

The API URL is configured in `src/config/api.js`:

**For iOS Simulator:**
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

**For Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:8080/api';
```

**For Real Device:**
```javascript
// Replace with your computer's IP address
const API_BASE_URL = 'http://192.168.1.x:8080/api';
```

To find your IP:
```bash
# macOS
ipconfig getifaddr en0

# Or check System Preferences → Network
```

### 3. Run Frontend

```bash
# In project root
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📦 What Was Integrated

### ✅ Created Files

1. **`src/config/api.js`** - API endpoint configuration
2. **`src/services/api.js`** - API request utilities with JWT handling
3. **`src/services/authService.js`** - Authentication service functions
4. **`src/services/itemService.js`** - Item/listing service functions

### ✅ Updated Files

1. **`src/context/AuthContext.jsx`**
   - Real API integration for login/register/logout
   - Token management with AsyncStorage
   - User state management
   - Error handling

2. **`src/screens/auth/LoginScreen.jsx`**
   - Email/password state
   - Loading states
   - Error handling with alerts
   - Real authentication flow

### 🎯 Features Working

- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Management
- ✅ Protected Routes
- ✅ Auto-login on app start
- ✅ Logout functionality

## 🧪 Testing the Integration

### 1. Test Registration

1. Open the app
2. Tap "Sign Up"
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
   - Phone: `+91-9876543210`
4. Tap "Create Account"

### 2. Test Login

1. Use the credentials from registration
2. Tap "Sign In"
3. You should be logged in and see the Home screen

### 3. Verify Backend

```bash
# Check if user was created in MongoDB
mongosh

use rentkar
db.users.find().pretty()
```

## 📝 Next Steps to Integrate

### Items/Listings

Update `HomeScreen.jsx`:
```javascript
import { getItems } from '../services/itemService';

const [items, setItems] = useState([]);

useEffect(() => {
  loadItems();
}, []);

const loadItems = async () => {
  try {
    const response = await getItems({ category: selectedCategory });
    setItems(response.items);
  } catch (error) {
    console.error('Error loading items:', error);
  }
};
```

### Create Listing

Update `AddItemScreen.jsx`:
```javascript
import { createItem } from '../services/itemService';

const handleSubmit = async () => {
  try {
    const itemData = {
      title,
      description,
      category,
      subCategory,
      price: parseFloat(price),
      location,
      images
    };
    
    await createItem(itemData);
    navigation.navigate('Ads');
  } catch (error) {
    Alert.alert('Error', 'Failed to create listing');
  }
};
```

### User Profile

Update `ProfileScreen.jsx`:
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  
  // Use user.name, user.email, user.avatar, etc.
};
```

## 🔐 Authentication Flow

1. **App Starts**
   - Checks for stored token in AsyncStorage
   - If token exists, fetches user data
   - If token invalid, clears and shows login

2. **User Logs In**
   - Sends email/password to `/api/auth/login`
   - Receives JWT token and user data
   - Stores token in AsyncStorage
   - Updates user context

3. **Protected Requests**
   - All API requests automatically include token
   - Format: `Authorization: Bearer <token>`
   - Backend validates and returns data

4. **Token Expiry**
   - Token expires after 24 hours
   - User must login again
   - Can implement auto-refresh later

## 🛠️ Troubleshooting

### "Network request failed"

**Problem:** Can't connect to backend

**Solutions:**
1. Check backend is running: `http://localhost:8080/health`
2. Update API_BASE_URL for your environment
3. Check firewall/network settings
4. For Android emulator, use `10.0.2.2` not `localhost`

### "Invalid or expired token"

**Problem:** Token authentication failing

**Solutions:**
1. Clear app data and login again
2. Check JWT_SECRET matches in backend
3. Verify token in AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check stored token
AsyncStorage.getItem('userToken').then(console.log);

// Clear token
AsyncStorage.removeItem('userToken');
```

### MongoDB Connection Error

**Problem:** Backend can't connect to MongoDB

**Solutions:**
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

## 📊 API Response Structure

### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "token": "jwt-token"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## 🚀 Performance Tips

1. **Caching**: Store frequently accessed data locally
2. **Debouncing**: Debounce search requests
3. **Pagination**: Implement pagination for large lists
4. **Image Optimization**: Compress images before upload
5. **Error Boundaries**: Add error boundaries to catch crashes

## 📱 Environment-Specific Setup

### Development
```javascript
const API_BASE_URL = __DEV__ 
  ? Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api'
  : 'https://your-production-api.com/api';
```

### Production
- Deploy backend to cloud service (AWS, Digital Ocean, etc.)
- Update API_BASE_URL to production URL
- Enable HTTPS
- Set proper CORS configuration

## ✨ Complete!

Your frontend is now connected to the backend! All authentication flows are working. Continue integrating other features (items, bookings, chat) using the same pattern.

---

**Need Help?**
- Check backend logs: Terminal running `go run cmd/backend/main.go`
- Check frontend logs: Metro bundler terminal
- Use React Native Debugger for network inspection
