import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, ChevronRight, MapPin, Clock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';

const MyRentalsScreen = () => {
  const navigation = useNavigation();

  // Mock Bookings Data
  const bookings = [
    {
      id: '1',
      status: 'active', // active, completed, cancelled
      product: {
        id: '1',
        title: 'DJI Mavic Air 2 Drone Combo',
        image: 'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop',
        price: 800,
        rateUnit: '/day',
        location: 'Bandra, Mumbai',
        rating: 4.9,
        reviews: 128,
        description: 'Rent this amazing DJI Mavic Air 2 drone for your next shoot!',
        owner: {
          name: 'Vikram Singh',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          rating: 4.8,
          responseRate: '98%',
          joined: 'Dec 2023'
        }
      },
      dates: 'Oct 12 - Oct 15',
      totalPrice: 2400,
      timeLeft: '2 Days left'
    },
    {
      id: '2',
      status: 'completed',
      product: {
        id: '4',
        title: 'Royal Enfield Classic 350',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1000',
        price: 900,
        rateUnit: '/day',
        location: 'Whitefield, Bangalore',
        rating: 4.6,
        reviews: 210,
        description: 'Cruise the city in style with this well-maintained Royal Enfield Classic 350.',
        owner: {
          name: 'Vikas Singh',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
          responseRate: '92%',
          rating: 4.5,
          joined: 'Nov 2022'
        }
      },
      dates: 'Sep 20 - Sep 22',
      totalPrice: 1800,
    }
  ];

  const handleBookingPress = (booking) => {
    // Navigate to a Booking Detail Screen which we will create next
    // OR navigate directly to ItemDetail if that's what the user wants immediately.
    // User asked: "shows booking details and when we click on the item then it shows the item details"
    // So we need a BookingDetailScreen.
    navigation.navigate('BookingDetail', { booking });
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookingPress(item)} activeOpacity={0.8} style={{ marginBottom: 16 }}>
      <GlassView style={styles.card} borderRadius={16}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusCompleted]}>
            <Text style={styles.statusText}>{item.status === 'active' ? 'Active' : 'Completed'}</Text>
          </View>
          <Text style={styles.price}>₹{item.totalPrice}</Text>
        </View>

        <View style={styles.cardContent}>
          <Image source={{ uri: item.product.image }} style={styles.prodImage} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>{item.product.title}</Text>
            <View style={styles.dateRow}>
              <Calendar size={14} color="#888" />
              <Text style={styles.dateText}>{item.dates}</Text>
            </View>
            {item.status === 'active' && (
              <View style={styles.timeLeftBadge}>
                <Clock size={12} color="#FFA500" />
                <Text style={styles.timeLeftText}>{item.timeLeft}</Text>
              </View>
            )}
          </View>
          <ChevronRight size={20} color="#666" />
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
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  timeLeftText: { color: '#FFA500', fontSize: 12, marginLeft: 4, fontWeight: '500' }
});

export default MyRentalsScreen;
