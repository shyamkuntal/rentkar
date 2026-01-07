import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import HomeStack from './HomeStack';
import MyRentalsScreen from '../screens/rent/MyRentalsScreen';
import AddItemScreen from '../screens/list/AddItemScreen';
import MyListingsScreen from '../screens/list/MyListingsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import { colors } from '../theme/colors';

// Icons
import HomeIcon from '../assets/icons/HomeIcon.svg';
import AddIcon from '../assets/icons/AddIcon.svg';
import ListingsIcon from '../assets/icons/ListingsIcon.svg';
import { Calendar, MessageCircle } from 'lucide-react-native';

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
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: Dimensions.get('window').width * 0.1,
          width: Dimensions.get('window').width * 0.8,
          height: 70,
          borderRadius: 35,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.4,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          height: 70,
        },
        tabBarBackground: () => (
          <View style={styles.blurWrapper}>
            {Platform.OS === 'android' ? (
              <View style={styles.androidBackground} />
            ) : (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={30}
                reducedTransparencyFallbackColor="rgba(20, 20, 25, 0.9)"
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
              stroke={focused ? 'none' : '#888'}
            />
          )
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyRentalsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) => (
            <Calendar
              size={22}
              color={focused ? '#FFF' : '#888'}
            />
          )
        }}
      />
      <Tab.Screen
        name="Ads"
        component={MyListingsScreen}
        options={{
          tabBarLabel: 'Ads',
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
        name="Chats"
        component={ChatListScreen} // Updated to ChatListScreen
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused }) => (
            <MessageCircle
              size={22}
              color={focused ? '#FFF' : '#888'}
            />
          )
        }}
      />
      <Tab.Screen
        name="Post"
        component={AddItemScreen}
        options={{
          tabBarLabel: 'Post',
          tabBarStyle: { display: 'none' }, // Hierarchically hide tab bar for this screen
          tabBarIcon: ({ focused }) => (
            <AddIcon
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
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    borderRadius: 35,
  },
});

export default AppTabs;