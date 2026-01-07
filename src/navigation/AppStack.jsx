import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import LenderProfileScreen from '../screens/profile/LenderProfileScreen';
import RentBookingScreen from '../screens/rent/RentBookingScreen';
import BookingDetailScreen from '../screens/rent/BookingDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen'; 
import MyAdDetailScreen from '../screens/list/MyAdDetailScreen';
import EditListingScreen from '../screens/list/EditListingScreen'; // Added

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="LenderProfile" component={LenderProfileScreen} />

      <Stack.Screen name="RentBooking" component={RentBookingScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyAdDetail" component={MyAdDetailScreen} />
      <Stack.Screen name="EditListing" component={EditListingScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
