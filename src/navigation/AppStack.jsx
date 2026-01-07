import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import LenderProfileScreen from '../screens/profile/LenderProfileScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import RentBookingScreen from '../screens/rent/RentBookingScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="LenderProfile" component={LenderProfileScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="RentBooking" component={RentBookingScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
