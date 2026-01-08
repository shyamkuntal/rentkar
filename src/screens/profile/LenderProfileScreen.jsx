import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Star, MapPin, ShieldCheck, Clock } from 'lucide-react-native';
import { getItemsByOwner } from '../../services/itemService';

const { width } = Dimensions.get('window');

const LenderProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { owner } = route.params || {
    owner: {
      id: '',
      name: 'Unknown User',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      location: 'Unknown',
      joined: 'N/A',
      rating: 0,
      reviews: 0,
    }
  };

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (owner?.id) {
      loadOwnerListings();
    }
  }, [owner?.id]);

  const loadOwnerListings = async () => {
    try {
      setLoading(true);
      const response = await getItemsByOwner(owner.id);
      setListings(response.items || []);
    } catch (error) {
      console.error('Error loading owner listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderListingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listingCard}
      onPress={() => navigation.navigate('ItemDetail', { 
        product: { ...item, owner: owner },
        hideProfileLink: true 
      })}
    >
      <Image 
        source={{ uri: item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/400') }} 
        style={styles.listingImage} 
      />
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>₹{item.price}<Text style={styles.perDay}>/day</Text></Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lender Profile</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
               <Image source={{ uri: owner.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={styles.avatar} />
               <View style={styles.verifiedBadge}>
                  <ShieldCheck size={16} color="#FFF" fill="#1DA1F2" />
               </View>
            </View>
            <Text style={styles.name}>{owner.name}</Text>
            <View style={styles.locationRow}>
                <MapPin size={14} color="#888" />
                <Text style={styles.location}>{owner.location || 'Location not set'}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{owner.rating || 0}</Text>
                    <View style={styles.ratingRow}>
                         <Star size={12} fill="#FFD700" color="#FFD700"/>
                         <Text style={styles.statLabel}> Rating</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{owner.responseRate || '100%'}</Text>
                    <Text style={styles.statLabel}>Response</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{listings.length}</Text>
                    <Text style={styles.statLabel}>Listings</Text>
                </View>
            </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Listings</Text>
        </View>

        {/* Listings Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#FF5A5F" style={{ marginTop: 30 }} />
        ) : listings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No listings yet</Text>
          </View>
        ) : (
          <FlatList
              data={listings}
              renderItem={renderListingItem}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  profileSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  verifiedBadge: { position: 'absolute', bottom: 15, right: 0, backgroundColor: '#1DA1F2', borderRadius: 10, padding: 2 },
  name: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  location: { color: '#888', marginLeft: 6 },

  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingVertical: 15, width: '100%' },
  statItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },

  columnWrapper: { justifyContent: 'space-between' },
  listingCard: { width: (width - 50) / 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  listingImage: { width: '100%', height: 120, backgroundColor: '#333' },
  listingInfo: { padding: 12 },
  listingTitle: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  listingPrice: { color: '#FF5A5F', fontWeight: '700' },
  perDay: { color: '#888', fontWeight: '400', fontSize: 12 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#888', fontSize: 16 },
});

export default LenderProfileScreen;