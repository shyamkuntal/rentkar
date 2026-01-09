import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell, Mail, MessageSquare, Package, Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTIFICATIONS_STORAGE_KEY = '@notification_settings';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    bookingUpdates: true,
    chatMessages: true,
    promotional: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const notificationItems = [
    { 
      icon: <Bell size={22} color="#FFF" />, 
      label: 'Push Notifications', 
      key: 'pushNotifications',
      description: 'Receive push notifications on your device'
    },
    { 
      icon: <Mail size={22} color="#FFF" />, 
      label: 'Email Notifications', 
      key: 'emailNotifications',
      description: 'Get important updates via email'
    },
    { 
      icon: <Package size={22} color="#FFF" />, 
      label: 'Booking Updates', 
      key: 'bookingUpdates',
      description: 'Notifications about your bookings'
    },
    { 
      icon: <MessageSquare size={22} color="#FFF" />, 
      label: 'Chat Messages', 
      key: 'chatMessages',
      description: 'New message notifications'
    },
    { 
      icon: <Gift size={22} color="#FFF" />, 
      label: 'Promotional Offers', 
      key: 'promotional',
      description: 'Special deals and promotions'
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionDescription}>
          Control how you receive notifications from RentKar
        </Text>

        <View style={styles.settingsCard}>
          {notificationItems.map((item, index) => (
            <View 
              key={item.key} 
              style={[styles.settingItem, index < notificationItems.length - 1 && styles.borderBottom]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => handleToggle(item.key)}
                trackColor={{ false: '#333', true: '#FF5A5F' }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>

        <Text style={styles.footerText}>
          You can change these settings at any time. Some notifications may still be sent for important account updates.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    lineHeight: 20,
  },
  settingsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
