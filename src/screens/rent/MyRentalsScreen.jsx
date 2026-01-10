import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, ChevronRight, MapPin, Clock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/AuthContext';
import { getMyBookings, getOwnerBookings, getPendingRequestsCount } from '../../services/bookingService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyRentalsScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // Get current user
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' or 'requests'
  const [pendingCount, setPendingCount] = useState(0);

  const loadBookings = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'rentals') {
        response = await getMyBookings();
      } else {
        response = await getOwnerBookings();
      }
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch pending count on mount and focus
  const loadPendingCount = async () => {
    try {
      const response = await getPendingRequestsCount();
      setPendingCount(response.count || 0);
    } catch (error) {
      console.error('Error loading pending count:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
      loadPendingCount();
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
    loadPendingCount();
  };

  const handleBookingPress = (booking) => {
    navigation.navigate('BookingDetail', {
      booking,
      viewMode: activeTab // Pass viewMode to detail screen
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Determine display status based on booking status and dates
  const getDisplayStatus = (booking) => {
    const now = new Date();
    const endDate = new Date(booking.endDate);
    const startDate = new Date(booking.startDate);

    if (booking.status === 'rejected' || booking.status === 'cancelled') {
      return booking.status;
    }

    if (booking.status === 'completed') {
      return 'completed';
    }

    if (booking.status === 'confirmed') {
      if (endDate < now) {
        return 'expired'; // Past end date
      } else if (startDate <= now && endDate >= now) {
        return 'ongoing'; // Currently active
      } else {
        return 'confirmed'; // Future booking
      }
    }

    if (booking.status === 'pending') {
      if (startDate < now) {
        return 'expired'; // Pending but start date passed
      }
      return 'pending';
    }

    return booking.status;
  };

  const getStatusColor = (displayStatus) => {
    switch (displayStatus) {
      case 'confirmed': return styles.statusConfirmed;
      case 'ongoing': return styles.statusOngoing;
      case 'completed': return styles.statusCompleted;
      case 'cancelled':
      case 'rejected': return styles.statusCancelled;
      case 'expired': return styles.statusExpired;
      default: return styles.statusPending;
    }
  };

  const getStatusLabel = (displayStatus) => {
    switch (displayStatus) {
      case 'confirmed': return 'Confirmed';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'rejected': return 'Rejected';
      case 'expired': return 'Expired';
      case 'pending': return 'Pending';
      default: return displayStatus;
    }
  };

  const renderBookingItem = ({ item }) => {
    // Determine product - booking.item from backend
    const product = item.item || {};
    const startDate = formatDate(item.startDate);
    const endDate = formatDate(item.endDate);
    const imageUri = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/100');

    const displayStatus = getDisplayStatus(item);

    return (
      <TouchableOpacity onPress={() => handleBookingPress(item)} activeOpacity={0.8} style={{ marginBottom: 16 }}>
        <GlassView style={styles.card} borderRadius={16}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, getStatusColor(displayStatus)]}>
              <Text style={styles.statusText}>{getStatusLabel(displayStatus)}</Text>
            </View>
            <Text style={styles.price}>₹{item.totalPrice}</Text>
          </View>

          <View style={styles.cardContent}>
            <Image source={{ uri: imageUri }} style={styles.prodImage} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{product.title || 'Item Unavailable'}</Text>

              {(product.brand || product.model) && (
                <Text style={{ color: '#AAA', fontSize: 12, marginBottom: 4 }} numberOfLines={1}>
                  {product.brand}{product.model ? ` • ${product.model}` : ''}
                </Text>
              )}

              <View style={styles.dateRow}>
                <Calendar size={14} color="#888" />
                <Text style={styles.dateText}>{startDate} - {endDate}</Text>
              </View>
              {displayStatus === 'ongoing' && (
                <View style={styles.timeLeftBadge}>
                  <Clock size={12} color="#4CAF50" />
                  <Text style={styles.ongoingText}>In Progress</Text>
                </View>
              )}
              {displayStatus === 'expired' && (
                <View style={styles.timeLeftBadge}>
                  <Clock size={12} color="#888" />
                  <Text style={styles.expiredText}>Rental Period Ended</Text>
                </View>
              )}
            </View>
            <ChevronRight size={20} color="#666" />
          </View>
        </GlassView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rentals' && styles.activeTab]}
          onPress={() => setActiveTab('rentals')}
        >
          <Text style={[styles.tabText, activeTab === 'rentals' && styles.activeTabText]}>My Rentals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>Requests</Text>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount > 9 ? '9+' : pendingCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>Rent items to see them here</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    padding: 16,
    // Background and border handled by GlassView
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusConfirmed: { backgroundColor: 'rgba(29, 161, 242, 0.2)' },
  statusOngoing: { backgroundColor: 'rgba(76, 175, 80, 0.2)' },
  statusCompleted: { backgroundColor: 'rgba(92, 209, 137, 0.2)' },
  statusExpired: { backgroundColor: 'rgba(128, 128, 128, 0.2)' },
  statusPending: { backgroundColor: 'rgba(255, 193, 7, 0.2)' },
  statusCancelled: { backgroundColor: 'rgba(255, 69, 69, 0.2)' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFF', textTransform: 'capitalize' },
  price: { fontSize: 16, fontWeight: '700', color: '#FF5A5F' },

  cardContent: { flexDirection: 'row', alignItems: 'center' },
  prodImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dateText: { color: '#888', fontSize: 13, marginLeft: 6 },
  timeLeftBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ongoingText: { color: '#4CAF50', fontSize: 12, marginLeft: 4, fontWeight: '500' },
  expiredText: { color: '#888', fontSize: 12, marginLeft: 4, fontWeight: '500' },
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

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF5A5F',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF5A5F',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default MyRentalsScreen;
