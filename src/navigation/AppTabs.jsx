import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  TouchableOpacity, 
  Text, 
  useWindowDimensions,
  Animated,
  Easing
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import HomeStack from './HomeStack';
import MyRentalsScreen from '../screens/rent/MyRentalsScreen';
import AddItemScreen from '../screens/list/AddItemScreen';
import MyListingsScreen from '../screens/list/MyListingsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';

// Icons
import { Home, Calendar, FolderOpen, MessageCircle, Plus } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

/**
 * Liquid Glass Switcher Tab Bar
 * 
 * Exact CSS replica:
 * - background-color: color-mix(in srgb, #bbbbbc 12%, transparent)
 * - backdrop-filter: blur(8px) saturate(150%)
 * - Multiple inset box-shadows for glass reflex
 * - Active indicator with animated translate
 * - Pill shape with border-radius: 99em
 */

// Glass color constants (from CSS variables)
const GLASS_COLORS = {
  glass: '#bbbbbc',
  light: '#ffffff',
  dark: '#000000',
  // Dark mode multipliers
  reflexDark: 2,
  reflexLight: 0.3,
};

const LiquidGlassSwitcher = ({ state, descriptors, navigation }) => {
  const { width } = useWindowDimensions();
  const mainTabs = state.routes.filter(route => route.name !== 'Post');
  const tabCount = mainTabs.length;
  
  // Animation for active indicator
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorScale = useRef(new Animated.Value(1)).current;
  
  // Calculate tab width
  const tabBarWidth = width - 40 - 72; // container width minus add button and gap
  const tabWidth = (tabBarWidth - 24) / tabCount; // minus padding
  const indicatorWidth = tabWidth - 8;
  
  useEffect(() => {
    // Find the active tab index among main tabs
    const activeRoute = state.routes[state.index];
    const activeMainTabIndex = mainTabs.findIndex(r => r.key === activeRoute.key);
    
    if (activeMainTabIndex >= 0) {
      // Animate indicator with scale bounce (like CSS animation)
      Animated.sequence([
        Animated.parallel([
          Animated.timing(indicatorPosition, {
            toValue: activeMainTabIndex * tabWidth + 4,
            duration: 400,
            easing: Easing.bezier(1, 0.0, 0.4, 1),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(indicatorScale, {
              toValue: 1.15,
              duration: 200,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(indicatorScale, {
              toValue: 1,
              duration: 200,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [state.index]);

  // Check if Post screen is active - hide tab bar
  // MOVED AFTER HOOKS TO PREVENT RENDER ERROR
  const activeRoute = state.routes[state.index];
  if (activeRoute?.name === 'Post') {
    return null;
  }

  const getIcon = (routeName, focused) => {
    const color = focused ? '#e1e1e1' : '#888';
    const size = 22;
    const strokeWidth = focused ? 2 : 1.5;
    
    switch (routeName) {
      case 'Home':
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
      case 'Bookings':
        return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
      case 'Ads':
        return <FolderOpen size={size} color={color} strokeWidth={strokeWidth} />;
      case 'Chats':
        return <MessageCircle size={size} color={color} strokeWidth={strokeWidth} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Switcher */}
      <View style={styles.switcher}>
        {/* Layer 1: Blur Background - backdrop-filter: blur(8px) saturate(150%) */}
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={8}
            reducedTransparencyFallbackColor="rgba(27, 27, 29, 0.9)"
          />
        ) : (
          <View style={styles.androidBlur} />
        )}
        
        {/* Layer 2: Glass Background - color-mix(in srgb, #bbbbbc 12%, transparent) */}
        <View style={styles.glassBackground} />
        
        {/* Layer 3: Inner border glow - inset 0 0 0 1px (light 3%) */}
        <View style={styles.innerBorderGlow} />
        
        {/* Layer 4: Top-left shine - inset 1.8px 3px 0px -2px (light 27%) */}
        <View style={styles.shineTopLeft} />
        
        {/* Layer 5: Bottom-right shine - inset -2px -2px 0px -2px (light 24%) */}
        <View style={styles.shineBottomRight} />
        
        {/* Layer 6: Bottom inner shadow - inset -3px -8px 1px -6px (light 18%) */}
        <View style={styles.bottomInnerLight} />
        
        {/* Layer 7: Dark inset shadow - inset -0.3px -1px 4px 0px (dark 24%) */}
        <View style={styles.darkInsetShadow} />
        
        {/* Layer 8: Top dark shadow - inset -1.5px 2.5px 0px -2px (dark 40%) */}
        <View style={styles.topDarkShadow} />
        
        {/* Layer 9: Outer border */}
        <View style={styles.outerBorder} />
        
        {/* Animated Active Indicator - ::after pseudo element */}
        <Animated.View 
          style={[
            styles.activeIndicator,
            { 
              width: indicatorWidth,
              transform: [
                { translateX: indicatorPosition },
                { scaleX: indicatorScale },
              ],
            }
          ]}
        >
          {/* Indicator Glass Background - color-mix(in srgb, #bbbbbc 36%, transparent) */}
          <View style={styles.indicatorGlass} />
          
          {/* Indicator inner border */}
          <View style={styles.indicatorInnerBorder} />
          
          {/* Indicator top shine */}
          <View style={styles.indicatorShineTop} />
          
          {/* Indicator bottom shine */}
          <View style={styles.indicatorShineBottom} />
          
          {/* Indicator outer border */}
          <View style={styles.indicatorOuterBorder} />
        </Animated.View>
        
        {/* Tabs Row */}
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
                style={[styles.tabOption, { width: tabWidth }]}
                activeOpacity={0.7}
              >
                <Animated.View style={styles.iconWrapper}>
                  {getIcon(route.name, isFocused)}
                </Animated.View>
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
            blurAmount={8}
          />
        ) : (
          <View style={styles.androidBlur} />
        )}
        <View style={styles.addButtonGlass} />
        <View style={styles.addButtonShine} />
        <View style={styles.addButtonBorder} />
        <View style={styles.addButtonIcon}>
          <Plus size={26} color="#e1e1e1" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <LiquidGlassSwitcher {...props} />}
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
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // Main Switcher - .switcher
  switcher: {
    flex: 1,
    height: 70,
    borderRadius: 999, // border-radius: 99em
    overflow: 'hidden',
    // External shadows: 0px 1px 5px (dark 20%), 0px 6px 16px (dark 16%)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  
  androidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 27, 29, 0.95)',
  },
  
  // color-mix(in srgb, #bbbbbc 12%, transparent)
  glassBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(187, 187, 188, 0.12)',
  },
  
  // inset 0 0 0 1px color-mix(light 3%)
  innerBorderGlow: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 998,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  
  // inset 1.8px 3px 0px -2px color-mix(light 27%)
  shineTopLeft: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.27)',
    borderLeftColor: 'rgba(255, 255, 255, 0.20)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  
  // inset -2px -2px 0px -2px color-mix(light 24%)
  shineBottomRight: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  
  // inset -3px -8px 1px -6px color-mix(light 18%)
  bottomInnerLight: {
    position: 'absolute',
    left: 3,
    right: 3,
    bottom: 2,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  
  // inset -0.3px -1px 4px 0px color-mix(dark 24%)
  darkInsetShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  
  // inset -1.5px 2.5px 0px -2px color-mix(dark 40%)
  topDarkShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: 3,
    borderRadius: 999,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
  },
  
  outerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  
  // Active Indicator - .switcher::after
  activeIndicator: {
    position: 'absolute',
    left: 8,
    top: 5,
    bottom: 5,
    borderRadius: 999,
    overflow: 'hidden',
    zIndex: 0,
  },
  
  // color-mix(in srgb, #bbbbbc 36%, transparent)
  indicatorGlass: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(187, 187, 188, 0.36)',
  },
  
  // Inner border glow
  indicatorInnerBorder: {
    position: 'absolute',
    top: 0.5,
    left: 0.5,
    right: 0.5,
    bottom: 0.5,
    borderRadius: 998,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // inset 2px 1px (light 27%)
  indicatorShineTop: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.27)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  
  // inset -1.5px -1px (light 24%)
  indicatorShineBottom: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  
  indicatorOuterBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Tabs Row
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 10,
  },
  
  // Tab Option - .switcher__option
  tabOption: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  iconWrapper: {
    marginBottom: 4,
  },
  
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#888',
  },
  
  tabLabelActive: {
    color: '#e1e1e1',
    fontWeight: '600',
  },
  
  // Add Button
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  
  addButtonGlass: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(187, 187, 188, 0.12)',
  },
  
  addButtonShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.27)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  
  addButtonBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  
  addButtonIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default AppTabs;