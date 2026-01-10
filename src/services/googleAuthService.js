import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/firebase';

// Configure Google Sign-In
// Call this once when app starts (in App.jsx or AuthContext)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
};

/**
 * Sign in with Google
 * @returns {Promise<{user: object, idToken: string}>} Firebase user and ID token
 */
export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the user's ID token
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult?.data?.idToken;

    if (!idToken) {
      throw new Error('No ID token returned from Google Sign-In');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with the Google credential
    const userCredential = await auth().signInWithCredential(googleCredential);

    return {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        avatar: userCredential.user.photoURL,
      },
      idToken,
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Sign in was cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Sign in is already in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services is not available');
    } else {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }
};

/**
 * Sign out from Google
 */
export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error('Google Sign-Out error:', error);
  }
};

/**
 * Check if user is currently signed in with Google
 */
export const isGoogleSignedIn = async () => {
  return await GoogleSignin.isSignedIn();
};

/**
 * Get current Google user (if signed in)
 */
export const getCurrentGoogleUser = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser?.user || null;
  } catch (error) {
    return null;
  }
};
