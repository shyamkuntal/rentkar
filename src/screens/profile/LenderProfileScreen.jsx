import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Star, MapPin, ShieldCheck, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LenderProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { owner } = route.params || {
    owner: {
      name: 'Vikram Singh',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      location: 'Mumbai, India',
      joined: 'Dec 2023',
      rating: 4.8,
      reviews: 120,
    }
  };

  // Mock listings for this user
  const otherListings = [
    { id: '1', title: 'GoPro Hero 11', price: 400, image: 'https://images.unsplash.com/photo-1592155931584-901ac1576d98?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'PS5 Console', price: 900, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400' },
    { id: '3', title: 'Canon 50mm Lens', price: 250, image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=400' },
  ];

  const renderListingItem = ({ item }) => (
    <TouchableOpacity style={styles.listingCard}>
      <Image source={{ uri: item.image }} style={styles.listingImage} />
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
               <Image source={{ uri: owner.avatar }} style={styles.avatar} />
               <View style={styles.verifiedBadge}>
                  <ShieldCheck size={16} color="#FFF" fill="#1DA1F2" />
               </View>
            </View>
            <Text style={styles.name}>{owner.name}</Text>
            <View style={styles.locationRow}>
                <MapPin size={14} color="#888" />
                <Text style={styles.location}>{owner.location}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{owner.rating}</Text>
                    <View style={styles.ratingRow}>
                         <Star size={12} fill="#FFD700" color="#FFD700"/>
                         <Text style={styles.statLabel}> Rating</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>100%</Text>
                    <Text style={styles.statLabel}>Response</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{owner.joined}</Text>
                    <Text style={styles.statLabel}>Joined</Text>
                </View>
            </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Listings</Text>
            <Text style={styles.seeAll}>See All</Text>
        </View>

        {/* Listings Grid */}
        <FlatList
            data={otherListings}
            renderItem={renderListingItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false} // Since it's inside ScrollView
            columnWrapperStyle={styles.columnWrapper}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  
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
  seeAll: { color: '#FF5A5F', fontSize: 14 },

  columnWrapper: { justifyContent: 'space-between' },
  listingCard: { width: (width - 50) / 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  listingImage: { width: '100%', height: 120, backgroundColor: '#333' },
  listingInfo: { padding: 12 },
  listingTitle: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  listingPrice: { color: '#FF5A5F', fontWeight: '700' },
  perDay: { color: '#888', fontWeight: '400', fontSize: 12 }
});

export default LenderProfileScreen;