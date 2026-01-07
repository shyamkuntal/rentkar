import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { items } from '../../data/items';
import { categories } from '../../data/categories';
import ItemCard from '../../components/ItemCard';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { Laptop, Car, Building2, Shirt, Dumbbell, Search, Filter, User, MapPin } from 'lucide-react-native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const getCategoryIcon = (name) => {
    const iconProps = { size: 22, color: '#FFF', strokeWidth: 1.5 };
    switch (name) {
      case 'Electronics':
        return <Laptop {...iconProps} />;
      case 'Vehicles':
        return <Car {...iconProps} />;
      case 'Properties':
        return <Building2 {...iconProps} />;
      case 'Fashion':
        return <Shirt {...iconProps} />;
      case 'Sports Gear':
        return <Dumbbell {...iconProps} />;
      default:
        return <Laptop {...iconProps} />;
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryBadge}
      onPress={() => navigation.navigate('Category', { category: item })}
      activeOpacity={0.8}
    >
      {/* Glass layers for category badge */}
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
        />
      ) : (
        <View style={styles.androidBlur} />
      )}
      <View style={styles.categoryGlassTint} />
      <View style={styles.categoryShine} />
      <View style={styles.categoryBorder} />
      
      <View style={styles.categoryContent}>
        {getCategoryIcon(item.name)}
        <Text style={styles.categoryText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCardWrapper}>
      <ItemCard
        item={item}
        onPress={() => navigation.navigate('ItemDetail', { product: item })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
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
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Recommended Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </ScrollView>
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
    paddingTop: 60,
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
    width: 90,
    height: 90,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  androidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.9)',
  },
  categoryGlassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryShine: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  categoryBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 8,
  },
  categoryText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'center',
  },
  
  // Items Grid
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemCardWrapper: {
    width: '48%',
  },
});

export default HomeScreen;