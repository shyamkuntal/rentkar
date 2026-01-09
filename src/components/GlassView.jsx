import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

/**
 * GlassView - Liquid Glass Effect Component
 * 
 * Implements the CSS glass patterns:
 * - background: rgba(255,255,255,0.1) or rgba(0,0,0,0.1)
 * - backdrop-filter: blur(4-8px)
 * - border: 2px solid rgba(255,255,255,0.2)
 * - box-shadow: inset highlights for shine effect
 * 
 * @param {object} style - Additional styles
 * @param {number} intensity - Blur amount (default: 8)
 * @param {number} borderRadius - Border radius (default: 25)
 * @param {string} variant - 'light' or 'dark' (default: 'dark')
 * @param {boolean} showShine - Show top-left shine highlight (default: true)
 * @param {number} tintOpacity - Opacity of the glass tint (default: 0.1)
 */
const GlassView = ({ 
  style, 
  children, 
  intensity = 8, 
  borderRadius = 25,
  variant = 'dark',
  showShine = true,
  tintOpacity = 0.1,
  contentContainerStyle,
}) => {
  const isDark = variant === 'dark';
  
  // Colors based on the CSS examples
  // Dark: background: rgba(255,255,255,0.1), border: rgba(255,255,255,0.2)
  // Light: background: rgba(0,0,0,0.1), border: rgba(0,0,0,0.2)
  const colors = {
    // Tint layer - rgba(187,187,188, 0.12) from CSS
    tint: isDark 
      ? `rgba(255, 255, 255, ${tintOpacity})` 
      : `rgba(0, 0, 0, ${tintOpacity})`,
    
    // Border - rgba(255,255,255,0.2)
    border: isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.15)',
    
    // Shine top-left - inset 2px 2px 1px 0 rgba(255,255,255,0.5)
    shineTop: isDark 
      ? 'rgba(255, 255, 255, 0.25)' 
      : 'rgba(255, 255, 255, 0.5)',
    
    shineLeft: isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(255, 255, 255, 0.3)',
    
    // Shine bottom-right - inset -1px -1px 1px 1px rgba(255,255,255,0.5)
    shineBottom: isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(255, 255, 255, 0.2)',
    
    shineRight: isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(255, 255, 255, 0.2)',
  };

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      {/* Layer 1: Blur Background */}
      <View style={[styles.blurContainer, { borderRadius }]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={isDark ? 'dark' : 'light'}
            blurAmount={intensity}
            reducedTransparencyFallbackColor={colors.tint}
          />
        ) : (
          <View 
            style={[
              styles.androidFallback, 
              { 
                backgroundColor: isDark ? 'rgba(30, 30, 35, 0.85)' : 'rgba(255, 255, 255, 0.7)',
                borderRadius 
              }
            ]} 
          />
        )}
      </View>

      {/* Layer 2: Glass Tint Overlay */}
      <View style={[styles.tintLayer, { backgroundColor: colors.tint, borderRadius }]} />

      {/* Layer 3: Specular Shine (top-left highlight) */}
      {showShine && (
        <View 
          style={[
            styles.shineTopLeft, 
            { 
              borderRadius,
              borderTopColor: colors.shineTop,
              borderLeftColor: colors.shineLeft,
            }
          ]} 
        />
      )}

      {/* Layer 4: Specular Shine (bottom-right subtle) */}
      {showShine && (
        <View 
          style={[
            styles.shineBottomRight, 
            { 
              borderRadius,
              borderBottomColor: colors.shineBottom,
              borderRightColor: colors.shineRight,
            }
          ]} 
        />
      )}

      {/* Layer 5: Border */}
      <View style={[styles.borderLayer, { borderRadius, borderColor: colors.border }]} />

      {/* Layer 6: Content */}
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // Drop shadow: 0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  blurContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  androidFallback: {
    ...StyleSheet.absoluteFill,
  },
  tintLayer: {
    ...StyleSheet.absoluteFill,
  },
  shineTopLeft: {
    ...StyleSheet.absoluteFill,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  shineBottomRight: {
    ...StyleSheet.absoluteFill,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  borderLayer: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});

export default GlassView;
