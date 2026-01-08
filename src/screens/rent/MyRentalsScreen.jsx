import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, ChevronRight, MapPin, Clock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { getMyBookings } from '../../services/bookingService';

const MyRentalsScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleBookingPress = (booking) => {
    navigation.navigate('BookingDetail', { booking });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return styles.statusActive;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const renderBookingItem = ({ item }) => {
    // Determine product - booking.item from backend
    const product = item.item || {};
    const startDate = formatDate(item.startDate);
    const endDate = formatDate(item.endDate);
    const imageUri = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/100');

    return (
      <TouchableOpacity onPress={() => handleBookingPress(item)} activeOpacity={0.8} style={{ marginBottom: 16 }}>
        <GlassView style={styles.card} borderRadius={16}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, getStatusColor(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.price}>₹{item.totalPrice}</Text>
          </View>

          <View style={styles.cardContent}>
            <Image source={{ uri: imageUri }} style={styles.prodImage} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{product.title || 'Item Unavailable'}</Text>
              <View style={styles.dateRow}>
                <Calendar size={14} color="#888" />
                <Text style={styles.dateText}>{startDate} - {endDate}</Text>
              </View>
              {item.status === 'confirmed' && (
                <View style={styles.timeLeftBadge}>
                  <Clock size={12} color="#FFA500" />
                  <Text style={styles.timeLeftText}>Ongoing</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    padding: 16,
    // Background and border handled by GlassView
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusActive: { backgroundColor: 'rgba(29, 161, 242, 0.2)' },
  statusCompleted: { backgroundColor: 'rgba(92, 209, 137, 0.2)' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFF', textTransform: 'capitalize' },
  price: { fontSize: 16, fontWeight: '700', color: '#FF5A5F' },

  cardContent: { flexDirection: 'row', alignItems: 'center' },
  prodImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dateText: { color: '#888', fontSize: 13, marginLeft: 6 },
  timeLeftBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  timeLeftText: { color: '#FFA500', fontSize: 12, marginLeft: 4, fontWeight: '500' },
  statusPending: { backgroundColor: 'rgba(255, 193, 7, 0.2)' },
  statusCancelled: { backgroundColor: 'rgba(255, 69, 69, 0.2)' },
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
});

export default MyRentalsScreen;
