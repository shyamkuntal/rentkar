import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const Button = ({ title, onPress, variant = 'primary', style }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        style
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 50, // Pill shaped
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  secondary: {
    backgroundColor: colors.glass.card,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  text: {
    fontSize: typography.size.m,
    fontWeight: typography.weight.bold,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.text.primary,
  },
});

export default Button;
