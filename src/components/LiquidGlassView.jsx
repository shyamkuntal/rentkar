import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

/**
 * LiquidGlassView - Premium glass morphism effect
 * 
 * Implements the liquid glass design with multiple layers:
 * 1. Blur Layer (backdrop-filter: blur)
 * 2. Tint Layer (rgba overlay)
 * 3. Specular/Shine Layer (simulated inset shadows using gradients/borders)
 * 4. Border (glass edge highlight)
 * 5. Content
 * 
 * Based on CSS patterns:
 * - background: rgba(255,255,255,0.1-0.25)
 * - backdrop-filter: blur(4-8px)
 * - border: 2px solid rgba(255,255,255,0.2)
 * - box-shadow: inset highlights for shine effect
 */
const LiquidGlassView = ({ 
  style, 
  children, 
  intensity = 20, 
  borderRadius = 25,
  variant = 'light', // 'light' or 'dark'
  showShine = true,
  tintOpacity = 0.1,
}) => {
  const isLight = variant === 'light';
  
  // Colors based on variant
  const colors = {
    tint: isLight ? `rgba(255,255,255,${tintOpacity})` : `rgba(0,0,0,${tintOpacity})`,
    border: isLight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
    shineTop: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
    shineBottom: isLight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)',
    innerGlow: isLight ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
  };

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      {/* Layer 1: Blur Layer */}
      <View style={[styles.blurContainer, { borderRadius }]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={isLight ? 'light' : 'dark'}
            blurAmount={intensity}
            reducedTransparencyFallbackColor={colors.tint}
          />
        ) : (
          <View style={[styles.androidBlurFallback, { backgroundColor: colors.tint, borderRadius }]} />
        )}
      </View>

      {/* Layer 2: Tint/Overlay Layer */}
      <View style={[styles.tintLayer, { backgroundColor: colors.tint, borderRadius }]} />

      {/* Layer 3: Inner Glow (simulates inset shadow glow) */}
      <View style={[styles.innerGlowLayer, { backgroundColor: colors.innerGlow, borderRadius: borderRadius - 1 }]} />

      {/* Layer 4: Specular Shine (top-left highlight) */}
      {showShine && (
        <>
          <View style={[
            styles.shineTopLeft, 
            { 
              borderRadius,
              borderTopColor: colors.shineTop,
              borderLeftColor: colors.shineTop,
            }
          ]} />
          <View style={[
            styles.shineBottomRight, 
            { 
              borderRadius,
              borderBottomColor: colors.shineBottom,
              borderRightColor: colors.shineBottom,
            }
          ]} />
        </>
      )}

      {/* Layer 5: Border (glass edge) */}
      <View style={[styles.borderLayer, { borderRadius, borderColor: colors.border }]} />

      {/* Layer 6: Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // Drop shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  blurContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  androidBlurFallback: {
    ...StyleSheet.absoluteFill,
  },
  tintLayer: {
    ...StyleSheet.absoluteFill,
  },
  innerGlowLayer: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
  },
  shineTopLeft: {
    ...StyleSheet.absoluteFill,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
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

export default LiquidGlassView;
