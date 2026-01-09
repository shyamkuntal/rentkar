import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/AuthContext';
import { updateProfile } from '../../services/userService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
      });

      // Refresh user data in context
      if (refreshUser) {
        await refreshUser();
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Gallery', onPress: () => console.log('Choose from gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FF5A5F" />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
              style={styles.avatar}
            />
            <View style={styles.cameraButton}>
              <Camera size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color="#888" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your name"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={20} color="#888" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={formData.email}
                editable={false}
                placeholderTextColor="#666"
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={20} color="#888" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={20} color="#888" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter your location"
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Your personal information is used to personalize your experience and will not be shared with third parties.
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF5A5F',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1A1A1A',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: '#FF5A5F',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    padding: 0,
    paddingVertical: 4,
  },
  disabledInput: {
    color: '#666',
  },
  helperText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 56,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default EditProfileScreen;
