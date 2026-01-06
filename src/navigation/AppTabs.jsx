import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import MyRentalsScreen from '../screens/rent/MyRentalsScreen';
import AddItemScreen from '../screens/list/AddItemScreen';
import MyListingsScreen from '../screens/list/MyListingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';

// Import SVG Icons
import HomeIcon from '../assets/icons/HomeIcon.svg';
import AddIcon from '../assets/icons/AddIcon.svg';
import ListingsIcon from '../assets/icons/ListingsIcon.svg';
import ProfileIcon from '../assets/icons/ProfileIcon.svg';
import { Heart } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
            screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          width:"80%",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'rgba(30, 30, 35, 0.7)', // Dark frosted glass
          borderRadius: 30,
          height: 70,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
          // iOS shadow for depth
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          paddingBottom: 0,
          overflow: 'hidden', // Important for backdrop effect
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(30, 30, 35, 0.5)',
              backdropFilter: 'blur(20px)', // Glass blur effect
            }}
          />
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarItemStyle: {
          paddingVertical: 10,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon 
              width={24} 
              height={24} 
              fill={focused ? colors.primary : colors.text.secondary} 
            />
          )
        }} 
      />
      <Tab.Screen 
        name="Rentals" 
        component={MyRentalsScreen} 
        options={{ 
          tabBarLabel: 'Rentals',
          tabBarIcon: ({ focused }) => (
            <Heart 
              size={24} 
              color={focused ? colors.primary : colors.text.secondary} 
              strokeWidth={2.5}
            />
          )
        }} 
      />
      <Tab.Screen 
        name="Add" 
        component={AddItemScreen} 
        options={{ 
          tabBarLabel: 'Add',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: colors.primary,
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20, // Lift it up slightly
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <AddIcon width={24} height={24} fill={colors.white} />
            </View>
          )
        }} 
      />
      <Tab.Screen 
        name="Listings" 
        component={MyListingsScreen} 
        options={{ 
          tabBarLabel: 'Listings',
          tabBarIcon: ({ focused }) => (
            <ListingsIcon 
              width={24} 
              height={24} 
              fill={focused ? colors.primary : colors.text.secondary} 
            />
          )
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <ProfileIcon 
              width={24} 
              height={24} 
              fill={focused ? colors.primary : colors.text.secondary} 
            />
          )
        }} 
      />
    </Tab.Navigator>
  );
};

export default AppTabs;