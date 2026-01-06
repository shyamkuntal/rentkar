import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // Navigate to Login after 2 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Placeholder for Logo - You can add an image here later */}
        <View style={styles.iconPlaceholder} />
        <Text style={styles.title}>RentKar</Text>
        <Text style={styles.subtitle}>Rent anything, anytime.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Or use a gradient if available
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.glass.card,
    borderRadius: spacing.borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 40,
    marginBottom: spacing.m,
    opacity: 0.8,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.white,
    marginBottom: spacing.s,
  },
  subtitle: {
    fontSize: typography.size.m,
    color: colors.white,
    opacity: 0.9,
  },
});

export default SplashScreen;
