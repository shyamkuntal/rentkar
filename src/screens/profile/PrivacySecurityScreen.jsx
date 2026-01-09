import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Lock, Shield, Eye, Trash2, Key, ChevronRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const PrivacySecurityScreen = () => {
  const navigation = useNavigation();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    // TODO: Call API to change password
    Alert.alert('Success', 'Password changed successfully');
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to delete account
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted. We will process it within 24 hours.');
          }
        },
      ]
    );
  };

  const handleToggle2FA = (value) => {
    if (value) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'This will require you to enter a verification code when logging in from a new device.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => setTwoFactorEnabled(true)
          },
        ]
      );
    } else {
      setTwoFactorEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={[styles.settingItem, styles.borderBottom]}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Key size={22} color="#FFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your account password</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Shield size={22} color="#FFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Add an extra layer of security</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleToggle2FA}
              trackColor={{ false: '#333', true: '#FF5A5F' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Privacy Section */}
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.settingsCard}>
          <View style={[styles.settingItem, styles.borderBottom]}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Eye size={22} color="#FFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Profile Visibility</Text>
                <Text style={styles.settingDescription}>Allow others to see your profile</Text>
              </View>
            </View>
            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{ false: '#333', true: '#FF5A5F' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Lock size={22} color="#FFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>Data & Privacy</Text>
                <Text style={styles.settingDescription}>Manage your data settings</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.dangerCard}>
          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.dangerIcon]}>
                <Trash2 size={22} color="#FF4545" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.dangerLabel}>Delete Account</Text>
                <Text style={styles.settingDescription}>Permanently delete your account and data</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#FF4545" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwords.current}
                onChangeText={(text) => setPasswords({ ...passwords, current: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwords.new}
                onChangeText={(text) => setPasswords({ ...passwords, new: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwords.confirm}
                onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswords({ current: '', new: '', confirm: '' });
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
                <Text style={styles.saveText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 12,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  dangerCard: {
    backgroundColor: 'rgba(255, 69, 69, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 69, 0.2)',
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
  dangerIcon: {
    backgroundColor: 'rgba(255, 69, 69, 0.15)',
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
  dangerLabel: {
    fontSize: 16,
    color: '#FF4545',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    backgroundColor: '#2A2A30',
    borderRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FF5A5F',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  saveText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PrivacySecurityScreen;
