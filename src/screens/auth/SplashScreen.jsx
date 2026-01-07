import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={['#1A1A2E', '#16161E', '#0F0F17']} style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>R</Text>
        </View>
        <Text style={styles.title}>RentKar</Text>
        <Text style={styles.subtitle}>Rent anything, anytime.</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <View style={styles.loader}>
          <View style={styles.loaderBar} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  iconText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loader: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF5A5F',
    borderRadius: 2,
  },
});

export default SplashScreen;
