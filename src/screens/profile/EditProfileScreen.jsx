import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin } from 'lucide-react-native';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Shyam Kuntal');
  const [email, setEmail] = useState('shyam.design@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Mumbai, India');

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
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
                value={name}
                onChangeText={setName}
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
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#666"
              />
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
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>
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
    alignItems: 'center',
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
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 56,
  },
});

export default EditProfileScreen;
