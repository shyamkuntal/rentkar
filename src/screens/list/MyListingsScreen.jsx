import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Modal, ActivityIndicator, Alert, RefreshControl, Switch } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Edit2, Trash2, Eye, MoreHorizontal, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { getMyListings, deleteItem, updateItem } from '../../services/itemService';
import { getItemReviews } from '../../services/reviewService';
import { Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MyListingsScreen = () => {
  const navigation = useNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [selectedItemReviews, setSelectedItemReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const loadListings = async () => {
    try {
      const response = await getMyListings();
      setListings(response.items || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      Alert.alert('Error', 'Failed to load your listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadListings();
  };

  const handleDeletePress = (id) => {
    setSelectedAdId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdId) return;

    try {
      await deleteItem(selectedAdId);
      setListings(prev => prev.filter(item => item.id !== selectedAdId));
      setDeleteModalVisible(false);
      setSelectedAdId(null);
      setTimeout(() => setSuccessModalVisible(true), 300);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete listing');
    }
  };

  const handleToggleStatus = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateItem(itemId, { status: newStatus });
      setListings(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
      Alert.alert('Error', 'Failed to update listing status');
    }

  };

  const handleViewReviews = async (itemId) => {
    setReviewsLoading(true);
    setReviewsModalVisible(true);
    setSelectedItemReviews([]);
    try {
      const response = await getItemReviews(itemId);
      setSelectedItemReviews(response.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const renderListingItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MyAdDetail', { listing: item })} activeOpacity={0.9} style={{ marginBottom: 20 }}>
      <GlassView style={styles.listingCard}>
        <Image
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400' }}
          style={styles.listingImage}
        />

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
              <Text style={styles.statText}>{item.views || 0} Views</Text>
            </View>
            {item.rating > 0 && (
              <View style={[styles.stat, { marginLeft: 12 }]}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.statText, { color: '#FFD700' }]}>{item.rating.toFixed(1)} ({item.reviews || 0})</Text>
              </View>
            )}
            <View style={styles.toggleContainer}>

              <Text style={styles.toggleLabel}>
                {item.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={item.status === 'active'}
                onValueChange={() => handleToggleStatus(item.id, item.status)}
                trackColor={{ false: '#444', true: 'rgba(76,175,80,0.4)' }}
                thumbColor={item.status === 'active' ? '#4CAF50' : '#888'}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleViewReviews(item.id)}
            >
              <Eye size={16} color="#4CAF50" />
              <Text style={[styles.actionText, { color: '#4CAF50' }]}>Reviews</Text>
            </TouchableOpacity>

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings yet</Text>
              <Text style={styles.emptySubtext}>Create your first rental listing now!</Text>
            </View>
          )
        }
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassView style={styles.modalContent} intensity={40} borderRadius={24}>
            <View style={styles.centeredModalWrapper}>
              <View style={[styles.modalIconContainer, { borderColor: 'rgba(76, 175, 80, 0.3)', backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                <Check size={32} color="#4CAF50" />
              </View>
              <Text style={styles.modalTitle}>Deleted!</Text>
              <Text style={styles.modalDescription}>Your listing has been deleted successfully.</Text>

              <TouchableOpacity style={styles.successBtn} onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.successBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewsModalVisible}
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassView style={[styles.modalContent, { height: '80%', maxWidth: '100%' }]} intensity={40} borderRadius={24}>
            <View style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Item Reviews</Text>
                <TouchableOpacity onPress={() => setReviewsModalVisible(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>

              {reviewsLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
              ) : (
                <FlatList
                  data={selectedItemReviews}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ padding: 16 }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No reviews yet.</Text>
                  }
                  renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Image
                          source={{ uri: item.reviewer?.avatar || 'https://via.placeholder.com/40' }}
                          style={styles.reviewerAvatar}
                        />
                        <View style={styles.reviewerInfo}>
                          <Text style={styles.reviewerName}>{item.reviewer?.name || 'Anonymous'}</Text>
                          <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                color="#FFD700"
                                fill={star <= item.rating ? "#FFD700" : "transparent"}
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                      </View>
                      {item.comment && (
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                      )}
                    </View>
                  )}
                />
              )}
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
  },
  successBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#888',
    fontSize: 12,
    marginRight: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    color: '#FF4545',
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewDate: {
    color: '#888',
    fontSize: 10,
  },
  reviewComment: {
    color: '#CCC',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
});

export default MyListingsScreen;
