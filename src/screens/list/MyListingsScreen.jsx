import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Edit2, Trash2, Eye, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const MyListingsScreen = () => {
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  // Mock Listings Data
  const listings = [
    {
      id: '1',
      title: 'Sony Alpha a7 III Kit',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
      views: 245,
      status: 'active',
      date: 'Posted Oct 10'
    },
    {
      id: '2',
      title: 'GoPro Hero 11 Black',
      price: 350,
      image: 'https://images.unsplash.com/photo-1588785392665-f6d4a541417d?auto=format&fit=crop&q=80&w=1000',
      views: 128,
      status: 'rented',
      date: 'Posted Sep 15'
    },
    {
      id: '3',
      title: 'DJI Mavic 3 Drone',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1000',
      views: 89,
      status: 'active',
      date: 'Posted Nov 01'
    }
  ];

  const handleDeletePress = (id) => {
    setSelectedAdId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    console.log('Deleting ad:', selectedAdId);
    setDeleteModalVisible(false);
    setSelectedAdId(null);
  };

  const renderListingItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MyAdDetail', { listing: item })} activeOpacity={0.9} style={{ marginBottom: 20 }}>
      <GlassView style={styles.listingCard}>
        <Image source={{ uri: item.image }} style={styles.listingImage} />

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity>
              <MoreHorizontal size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>₹{item.price}<Text style={styles.perDay}>/day</Text></Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Eye size={14} color="#888" />
              <Text style={styles.statText}>{item.views} Views</Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusRented]}>
              <Text style={[styles.statusText, item.status === 'active' ? styles.textActive : styles.textRented]}>
                {item.status === 'active' ? 'Active' : 'Rented'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('EditListing', { listing: item })}
            >
              <Edit2 size={16} color="#FFF" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDeletePress(item.id)}
            >
              <Trash2 size={16} color="#FF4545" />
              <Text style={[styles.actionText, { color: '#FF4545' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ads</Text>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassView style={styles.modalContent} intensity={40} borderRadius={24}>
            <View style={styles.centeredModalWrapper}>
              <View style={styles.modalIconContainer}>
                <Trash2 size={32} color="#FF4545" />
              </View>
              <Text style={styles.modalTitle}>Delete Ad?</Text>
              <Text style={styles.modalDescription}>Are you sure you want to delete this advertisement? This action cannot be undone.</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listingCard: {
    // Background and border handled by GlassView
    margin: 0,
  },
  listingImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary || '#FF5A5F',
    marginBottom: 12,
  },
  perDay: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  statusRented: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textActive: {
    color: '#4CAF50',
  },
  textRented: {
    color: '#FFC107',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingVertical: 4,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
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

export default MyListingsScreen;
