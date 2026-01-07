import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import HomeStack from './HomeStack';
import MyRentalsScreen from '../screens/rent/MyRentalsScreen';
import AddItemScreen from '../screens/list/AddItemScreen';
import MyListingsScreen from '../screens/list/MyListingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';

// Icons
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
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 4, // Adjusted for closer spacing to icons, like in the image
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 20, // Slightly adjusted to match floating position in image
          left: 20,
          right: 20,
          height: 60, // Adjusted height to better match image proportions
          borderRadius: 30, // Rounded to match image
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 4, // Slight padding for vertical centering
          height: 60,
        },
        tabBarBackground: () => (
          <View style={styles.blurWrapper}>
            {Platform.OS === 'android' ? (
              <View style={styles.androidBackground} />
            ) : (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
              />
            )}
          </View>
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              width={22}
              height={22}
              fill={focused ? '#FFF' : 'transparent'}
              stroke={focused ? 'none' : '#888'} // Handle fill vs stroke icons
            />
          )
        }}
      />
      <Tab.Screen
        name="Rentals"
        component={MyRentalsScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <Heart
              size={22}
              color={focused ? '#FFF' : '#888'}
              fill={focused ? '#FFF' : 'transparent'}
            />
          )
        }}
      />
      
      {/* Middle "Post Ad" Button */}
      <Tab.Screen
        name="Add"
        component={AddItemScreen}
        options={{
          tabBarLabel: 'Post Ad',
          tabBarIcon: ({ focused }) => (
            <View style={styles.plusButtonContainer}>
              <AddIcon width={24} height={24} fill="#FFF" />
            </View>
          )
        }}
      />
      
      <Tab.Screen
        name="Listings"
        component={MyListingsScreen}
        options={{
          tabBarLabel: 'My Ads',
          tabBarIcon: ({ focused }) => (
            <ListingsIcon
              width={22}
              height={22}
              fill={focused ? '#FFF' : '#888'}
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
              width={22}
              height={22}
              fill={focused ? '#FFF' : '#888'}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  blurWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 25, 0.85)', // Fallback for glassmorphism
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A1A', // Solid dark for Android
    borderRadius: 30,
  },
});

export default AppTabs;