import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Input placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />

      <Button title="Login" onPress={login} style={{ marginTop: spacing.l }} />

      <Button
        title="Create Account"
        variant="secondary"
        style={{ marginTop: spacing.s }}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.l,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xxl,
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default LoginScreen;
