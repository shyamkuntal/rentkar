import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const GlassView = ({ style, children, intensity = 20, borderRadius = 20 }) => {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <View style={[styles.overflowContainer, { borderRadius }]}>
        {Platform.OS === 'android' ? (
          <View style={styles.androidFallback} />
        ) : (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={intensity}
            reducedTransparencyFallbackColor="rgba(30, 30, 35, 0.8)"
          />
        )}
      </View>
      <View style={[styles.contentContainer, { borderRadius }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    // Border for the glass effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  overflowContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  androidFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(40, 40, 45, 0.85)', // Slightly lighter/translucent dark for Android
  },
  contentContainer: {
    // Ensure content sits on top
    zIndex: 1,
  },
});

export default GlassView;
