import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Moon, Bell, Lock, Globe, HelpCircle, Info, ChevronRight } from 'lucide-react-native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsItems = [
    { icon: <Moon size={22} color="#FFF" />, label: 'Dark Mode', hasSwitch: true, value: darkMode, onToggle: setDarkMode },
    { icon: <Bell size={22} color="#FFF" />, label: 'Notifications', hasSwitch: true, value: notifications, onToggle: setNotifications },
    { icon: <Lock size={22} color="#FFF" />, label: 'Privacy', hasArrow: true },
    { icon: <Globe size={22} color="#FFF" />, label: 'Language', hasArrow: true, subLabel: 'English' },
    { icon: <HelpCircle size={22} color="#FFF" />, label: 'Help & Support', hasArrow: true },
    { icon: <Info size={22} color="#FFF" />, label: 'About', hasArrow: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <View key={index} style={[styles.settingItem, index < settingsItems.length - 1 && styles.borderBottom]}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#333', true: '#FF5A5F' }}
                  thumbColor="#FFF"
                />
              ) : item.hasArrow ? (
                <View style={styles.settingRight}>
                  {item.subLabel && <Text style={styles.subLabel}>{item.subLabel}</Text>}
                  <ChevronRight size={20} color="#888" />
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingTop: 60,
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
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subLabel: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 30,
  },
});

export default SettingsScreen;
