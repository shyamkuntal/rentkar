// Firebase configuration
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Web client ID for Google Sign-In
// Get this from Firebase Console > Authentication > Sign-in method > Google > Web client ID
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

export default firebaseConfig;
