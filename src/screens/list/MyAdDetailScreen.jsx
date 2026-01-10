import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Edit2, Trash2, Eye, MapPin, Tag, Calendar, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageSlider from '../../components/ImageSlider';

const { width } = Dimensions.get('window');

const MyAdDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { listing } = route.params;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeletePress = () => {
      setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
      console.log('Deleting listing:', listing.id);
      setDeleteModalVisible(false);
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image Slider */}
        <View style={styles.imageContainer}>
          <ImageSlider 
            images={listing.images && listing.images.length > 0 ? listing.images : [listing.image || 'https://via.placeholder.com/400']}
            height={340}
            showButtons={true}
            showDots={true}
          />
          <View style={[
            styles.statusBadgeImg, 
            { backgroundColor: listing.status === 'active' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 69, 69, 0.9)' }
          ]}>
            <Text style={styles.statusTextImg}>{listing.status === 'active' ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
             <View style={{flex: 1}}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.date}>Listed on {new Date(listing.createdAt).toLocaleDateString()}</Text>
             </View>
             <Text style={styles.price}>₹{listing.price}<Text style={styles.perTime}>/day</Text></Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Eye size={20} color={colors.primary} />
                <Text style={styles.statValue}>{listing.views || 0}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
            </View>
            <View style={styles.statCard}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.statValue}>
                  {Math.floor((new Date() - new Date(listing.createdAt)) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text style={styles.statLabel}>Days Listed</Text>
            </View>
            <View style={styles.statCard}>
                <Tag size={20} color={colors.primary} />
                <Text style={styles.statValue} numberOfLines={1}>{listing.category || 'Item'}</Text>
                <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          {/* Details Chips - Category, Brand, Model */}
          {(listing.category || listing.brand || listing.model || listing.location) && (
            <View style={styles.detailsRow}>
              {listing.category && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipLabel}>Category</Text>
                  <Text style={styles.detailChipValue} numberOfLines={1}>{listing.category}</Text>
                </View>
              )}
              {listing.brand && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipLabel}>Brand</Text>
                  <Text style={styles.detailChipValue} numberOfLines={1}>{listing.brand}</Text>
                </View>
              )}
              {listing.model && (
                <View style={styles.detailChip}>
                  <Text style={styles.detailChipLabel}>Model</Text>
                  <Text style={styles.detailChipValue} numberOfLines={1}>{listing.model}</Text>
                </View>
              )}
            </View>
          )}

          {/* Location */}
          {listing.location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#FF5A5F" />
              <Text style={styles.locationText}>{listing.location}</Text>
            </View>
          )}

          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Description</Text>
             <Text style={styles.description}>
                {listing.description || 'No description provided.'}
             </Text>
          </View>
          
          <View style={{height: 100}} />
        </View>
      </ScrollView>

      {/* Fixed Header with Gradient */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 60, zIndex: 100 }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]} 
            onPress={() => navigation.goBack()}
        >
            <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditListing', { listing })}>
              <Edit2 size={20} color="#FFF" />
              <Text style={styles.btnText}>Edit Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Trash2 size={20} color="#FF4545" />
          </TouchableOpacity>
      </View>

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
                    <Text style={styles.modalTitle}>Delete Listing?</Text>
                    <Text style={styles.modalDescription}>Are you sure you want to delete this listing? This action cannot be undone.</Text>
                    
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
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 340, // Taller image area to accommodate badging and content overlap
    width: '100%',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure zIndex is high enough
  },
  statusBadgeImg: {
    position: 'absolute',
    bottom: 40, // Moved up to clear the content overlap
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  statusTextImg: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: 24,
    marginTop: -24, // Slightly deeper overlap
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 32, // More rounded
    borderTopRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8, // Give some breathing room from the top edge
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
    marginRight: 10,
    lineHeight: 32,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  perTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCC',
    lineHeight: 26,
  },
  // Detail chips for Category/Brand/Model
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  detailChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailChipLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  detailChipValue: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,90,95,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,90,95,0.2)',
  },
  locationText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 69, 69, 0.15)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 69, 0.3)',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
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
    // Removed alignItems: 'center' to let inner wrapper handle it
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
    alignSelf: 'center', // Force center
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center', // Center text
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

export default MyAdDetailScreen;
