import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * ScreenWrapper - A global wrapper component for all screens
 * Handles status bar padding and safe area insets consistently
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content
 * @param {boolean} props.edges - SafeArea edges to apply ('top', 'bottom', 'left', 'right')
 * @param {string} props.backgroundColor - Background color for the screen
 * @param {string} props.barStyle - StatusBar style ('light-content' or 'dark-content')
 */
const ScreenWrapper = ({ 
  children, 
  edges = ['top'], 
  backgroundColor = '#1A1A1A',
  barStyle = 'light-content',
  statusBarTranslucent = true,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate padding based on edges
  const edgePadding = {};
  if (edges.includes('top')) {
    edgePadding.paddingTop = insets.top;
  }
  if (edges.includes('bottom')) {
    edgePadding.paddingBottom = insets.bottom;
  }
  if (edges.includes('left')) {
    edgePadding.paddingLeft = insets.left;
  }
  if (edges.includes('right')) {
    edgePadding.paddingRight = insets.right;
  }

  return (
    <View style={[styles.container, { backgroundColor }, edgePadding]}>
      <StatusBar 
        barStyle={barStyle} 
        backgroundColor="transparent" 
        translucent={statusBarTranslucent}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
