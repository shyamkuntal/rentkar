import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, Image, TouchableOpacity, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { getItems } from '../../services/itemService';
import { CATEGORIES } from '../../config/categories';
import { getCategoryIcon } from '../../utils/categoryIcons';
import ItemCard from '../../components/ItemCard';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { Search, Filter, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// CategoryBadge component using shared icon utility
const CategoryBadge = ({ category, isSelected, onPress }) => {
  const IconComponent = React.useMemo(() => getCategoryIcon(category.name), [category.name]);

  return (
    <TouchableOpacity
      style={styles.categoryBadge}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Simplified glass effect */}
      <View style={styles.categoryBackground} />
      <View style={styles.categoryGlassTint} />
      <View style={styles.categoryShine} />
      <View style={[styles.categoryBorder, isSelected && styles.categoryBorderSelected]} />

      <View style={styles.categoryContent}>
        <IconComponent size={20} color="#FFF" strokeWidth={1.5} />
        <Text style={styles.categoryText} numberOfLines={2}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

CategoryBadge.displayName = 'CategoryBadge';

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Pagination State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ref to prevent multiple onEndReached calls
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    loadItems(true);
  }, [selectedCategory, searchQuery]);

  const loadItems = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    } else {
      if (!hasMore || isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setLoadingMore(true);
    }

    try {
      const pageToFetch = reset ? 1 : page + 1;
      const filters = { 
        limit: 10, 
        page: pageToFetch 
      };

      if (selectedCategory) filters.category = selectedCategory;
      if (searchQuery) filters.search = searchQuery;

      const response = await getItems(filters);
      const newItems = response.items || [];
      
      if (reset) {
        setItems(newItems);
        setPage(1);
      } else {
        // Filter out items that are already in the list
        setItems(prev => {
          const existingIds = new Set(prev.map(i => i.id));
          const uniqueNewItems = newItems.filter(i => !existingIds.has(i.id));
          return [...prev, ...uniqueNewItems];
        });
        setPage(pageToFetch);
      }
      
      // If we got fewer items than limit, no more pages
      setHasMore(newItems.length >= 10);

    } catch (error) {
      console.error('Error loading items:', error);
      if (reset) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
      isLoadingMoreRef.current = false;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadItems(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !isLoadingMoreRef.current) {
      loadItems(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.name === selectedCategory ? null : category.name);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const renderCategory = ({ item }) => (
    <CategoryBadge
      category={item}
      isSelected={selectedCategory === item.name}
      onPress={() => handleCategoryPress(item)}
    />
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCardWrapper}>
      <ItemCard
        item={item}
        onPress={() => navigation.navigate('ItemDetail', { product: item })}
      />
    </View>
  );

  const renderListHeader = () => (
    <View>
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            extraData={selectedCategory}
          />
        </View>

        {/* Recommended Header */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory || 'Recommended'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilter}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Initial Loader (rendered here to avoid Full Screen overlay if preferred, or use logic below) */}
        {loading && items.length === 0 && (
             <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF5A5F" />
              <Text style={styles.loadingText}>Loading items...</Text>
            </View>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header (Top Bar + Search) */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandName}>
              <Text style={styles.brandIcon}>✦ </Text>
              RentKar
            </Text>
            <TouchableOpacity style={styles.locationSelector}>
              <MapPin size={12} color="#FF5A5F" />
              <Text style={styles.locationText}>Mumbai, India</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar with Glass Effect */}
        <View style={styles.searchContainer}>
          {Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={15}
            />
          ) : (
            <View style={styles.searchAndroidBlur} />
          )}

          <View style={styles.searchTint} />
          <View style={styles.searchShine} />
          <View style={styles.searchBorder} />

          <View style={styles.searchContent}>
            <Search size={18} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for rentals..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content FlatList */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderListHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
            loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#FF5A5F" />
            </View>
            ) : <View style={{ height: 20 }} />
        }
        ListEmptyComponent={!loading && items.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || selectedCategory
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to list an item!'}
              </Text>
            </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF5A5F"
            colors={['#FF5A5F']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
  },
  brandIcon: {
    color: '#FF5A5F',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#CCC',
    fontSize: 12,
    marginLeft: 4,
  },
  avatarButton: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // Search Bar Glass
  searchContainer: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  searchAndroidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.9)',
  },
  searchTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 25,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  searchBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#FFF',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll Content
  scrollContent: {
    paddingBottom: 120,
  },

  // Sections
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#FF5A5F',
    fontWeight: '500',
    marginBottom: 16,
  },

  // Categories
  categoryList: {
    paddingRight: 20,
  },
  categoryBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginRight: 10,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.95)',
    borderRadius: 16,
  },
  categoryGlassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  categoryBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryBorderSelected: {
    borderColor: '#FF5A5F',
    borderWidth: 2,
  },
  categoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 4,
  },
  categoryText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 9,
    textAlign: 'center',
  },

  // Loading & Empty States
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  clearFilter: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '600',
  },

  // Items Grid
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  itemCardWrapper: {
    width: '48%',
    marginBottom: 8,
  },
});

export default HomeScreen;