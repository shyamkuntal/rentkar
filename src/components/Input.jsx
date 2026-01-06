import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Input = ({ placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor={colors.text.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.card,
    borderRadius: spacing.borderRadius.m, // Rounded edges
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  input: {
    fontSize: typography.size.m,
    color: colors.text.primary,
    height: 48,
  },
});

export default Input;
