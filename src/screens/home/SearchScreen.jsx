import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Search, MapPin, Star, X } from 'lucide-react-native';
import { items } from '../../data/items';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

const SearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['Drone', 'Camera', 'Bike', 'Laptop']);

  // Filter items based on search query
  const filteredItems = searchQuery.length > 0 
    ? items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetail', { product: item })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        
        {(item.brand || item.model) && (
            <Text style={{color: '#AAA', fontSize: 11, marginBottom: 6}} numberOfLines={1}>
            {item.brand}{item.model ? ` • ${item.model}` : ''}
            </Text>
        )}

        <Text style={styles.cardPrice}>₹{item.price}<Text style={styles.perDay}>/day</Text></Text>
        <View style={styles.cardMeta}>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#888" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rentals..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        // Recent Searches
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentItem}
              onPress={() => setSearchQuery(search)}
            >
              <Search size={16} color="#888" />
              <Text style={styles.recentText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : filteredItems.length > 0 ? (
        // Search Results
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // No Results
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>Try searching for something else</Text>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  recentContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  recentText: {
    fontSize: 15,
    color: '#CCC',
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#333',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5A5F',
    marginBottom: 8,
  },
  perDay: {
    fontSize: 12,
    fontWeight: '400',
    color: '#888',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});

export default SearchScreen;
