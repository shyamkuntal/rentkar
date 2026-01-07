import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleRegister = () => {
    // After registration, log in the user
    login();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join RentKar to start renting</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <User size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              autoCapitalize="words"
            />
          </View>

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
            <Phone size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
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

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>
        </View>

        <Text style={styles.termsText}>
          By signing up, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Create Account</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
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
  termsText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FF5A5F',
    fontWeight: '500',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A5F',
    paddingVertical: 18,
    borderRadius: 30,
    gap: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
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

export default RegisterScreen;
