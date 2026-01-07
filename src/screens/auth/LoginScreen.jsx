import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.brandName}>RentKar</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue renting</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#888" />
            <TextInput 
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#888" />
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Sign In</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF5A5F',
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A5F',
    paddingVertical: 18,
    borderRadius: 30,
    gap: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#888',
    paddingHorizontal: 20,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
