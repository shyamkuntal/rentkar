import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { ChevronRight, Settings, CreditCard, Bell, Shield, Heart, LogOut, User } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/AuthContext';
import GlassView from '../../components/GlassView';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  const menuItems = [
    { icon: <User size={22} color="#FFF" />, label: 'Personal Information', route: 'EditProfile' },
    { icon: <CreditCard size={22} color="#FFF" />, label: 'Payments & Payouts', route: 'Payments' },
    { icon: <Bell size={22} color="#FFF" />, label: 'Notifications', route: 'Notifications' },
    { icon: <Shield size={22} color="#FFF" />, label: 'Privacy & Security', route: 'PrivacySecurity' },
    { icon: <Heart size={22} color="#FFF" />, label: 'My Favorites', route: 'Favorites' },
    { icon: <Settings size={22} color="#FFF" />, label: 'Settings', route: 'Settings' },
  ];

  // Liquid Glass Card Component
  const GlassCard = ({ children, style, contentStyle }) => (
    <View style={[styles.glassCard, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={15}
        />
      ) : (
        <View style={styles.androidBlur} />
      )}
      <View style={styles.glassTint} />
      <View style={styles.glassShineTop} />
      <View style={styles.glassShineBottom} />
      <View style={styles.glassBorder} />
      <View style={[styles.glassContent, contentStyle]}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <GlassCard contentStyle={styles.userCardContent}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified Member</Text>
            </View>
          </View>
        </GlassCard>

        {/* Stats Row */}
        <GlassCard contentStyle={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.rentalsCount || 0}</Text>
            <Text style={styles.statLabel}>Rentals</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.listingsCount || 0}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.rating || 'N/A'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </GlassCard>

        {/* Menu Options */}
        <GlassCard contentStyle={styles.menuContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => {
                if (item.route === 'Payments') {
                  Alert.alert('Coming Soon', 'Payments & Payouts feature is under development');
                } else {
                  navigation.navigate(item.route);
                }
              }}
            >
              <View style={styles.menuIconContainer}>{item.icon}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color="#FF4545" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconContainer}>
              <LogOut size={32} color="#FF4545" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalDescription}>Are you sure you want to log out of your account?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={confirmLogout}>
                <Text style={styles.deleteText}>Log Out</Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Glass Card Base Styles
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  androidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.92)',
  },
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  glassShineTop: {
    ...StyleSheet.absoluteFill,
    borderRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  glassShineBottom: {
    ...StyleSheet.absoluteFill,
    borderRadius: 24,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  glassBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassContent: {
    zIndex: 10,
  },

  // User Card Content
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF5A5F',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(29, 161, 242, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(29, 161, 242, 0.3)',
  },
  verifiedText: {
    color: '#1DA1F2',
    fontSize: 12,
    fontWeight: '600',
  },

  // Stats Content
  statsContent: {
    flexDirection: 'row',
    paddingVertical: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5A5F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: '60%',
    alignSelf: 'center',
  },

  // Menu Content
  menuContent: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  logoutText: {
    color: '#FF4545',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    backgroundColor: '#2A2A30',
    borderRadius: 24,
    alignItems: 'center',
  },
  centeredModalWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 69, 69, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 69, 0.3)',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FF4545',
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#FF4545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
