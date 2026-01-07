import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import HomeStack from './HomeStack';
import MyRentalsScreen from '../screens/rent/MyRentalsScreen';
import AddItemScreen from '../screens/list/AddItemScreen';
import MyListingsScreen from '../screens/list/MyListingsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';

// Icons
import HomeIcon from '../assets/icons/HomeIcon.svg';
import AddIcon from '../assets/icons/AddIcon.svg';
import ListingsIcon from '../assets/icons/ListingsIcon.svg';
import { Calendar, MessageCircle, Home, FolderOpen, Settings, Plus } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { width } = useWindowDimensions();
  
  // Filter out the Post tab (we'll render it separately as a floating button)
  const mainTabs = state.routes.filter(route => route.name !== 'Post');
  const postTab = state.routes.find(route => route.name === 'Post');
  const postIndex = state.routes.findIndex(route => route.name === 'Post');

  const getIcon = (routeName, focused) => {
    const color = focused ? '#FFF' : '#888';
    const size = 22;
    
    switch (routeName) {
      case 'Home':
        return <Home size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
      case 'Bookings':
        return <Calendar size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
      case 'Ads':
        return <FolderOpen size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
      case 'Chats':
        return <MessageCircle size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Main Tab Bar */}
      <View style={styles.mainTabBar}>
        {/* Blur Background */}
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={25}
            reducedTransparencyFallbackColor="rgba(20, 20, 25, 0.9)"
          />
        ) : (
          <View style={styles.androidBackground} />
        )}
        
        {/* Glass Overlay */}
        <View style={styles.glassOverlay} />
        
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {mainTabs.map((route, index) => {
            const actualIndex = state.routes.findIndex(r => r.key === route.key);
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || route.name;
            const isFocused = state.index === actualIndex;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                {isFocused && <View style={styles.activeIndicator} />}
                <View style={styles.iconContainer}>
                  {getIcon(route.name, isFocused)}
                </View>
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Post')}
        activeOpacity={0.8}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={25}
            reducedTransparencyFallbackColor="rgba(20, 20, 25, 0.9)"
          />
        ) : (
          <View style={styles.androidBackground} />
        )}
        <View style={styles.addButtonContent}>
          <Plus size={28} color="#FFF" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyRentalsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="Ads"
        component={MyListingsScreen}
        options={{ tabBarLabel: 'Ads' }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{ tabBarLabel: 'Chats' }}
      />
      <Tab.Screen
        name="Post"
        component={AddItemScreen}
        options={{ 
          tabBarLabel: 'Post',
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainTabBar: {
    flex: 1,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  androidBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    borderRadius: 35,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#888',
  },
  tabLabelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  addButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
});

export default AppTabs;