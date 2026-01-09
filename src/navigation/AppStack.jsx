import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import LenderProfileScreen from '../screens/profile/LenderProfileScreen';
import RentBookingScreen from '../screens/rent/RentBookingScreen';
import BookingDetailScreen from '../screens/rent/BookingDetailScreen';
import BookingConfirmationScreen from '../screens/rent/BookingConfirmationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyAdDetailScreen from '../screens/list/MyAdDetailScreen';
import EditListingScreen from '../screens/list/EditListingScreen';
import ChatScreen from '../screens/chat/ChatScren';
import FavoritesScreen from '../screens/profile/FavoritesScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import PrivacySecurityScreen from '../screens/profile/PrivacySecurityScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ReviewsScreen from '../screens/profile/ReviewsScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="HomeTabs" component={AppTabs} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="LenderProfile" component={LenderProfileScreen} />

      <Stack.Screen name="RentBooking" component={RentBookingScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyAdDetail" component={MyAdDetailScreen} />
      <Stack.Screen name="EditListing" component={EditListingScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      {/* Profile Related Screens */}
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
