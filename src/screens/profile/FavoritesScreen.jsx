import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Star, Heart } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { getFavorites, removeFavorite } from '../../services/favoriteService';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.favorites || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { product: item });
  };

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFavorite(itemId);
      setFavorites(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  };

  const renderFavoriteItem = ({ item }) => {
    const imageUri = item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/150');

    return (
      <TouchableOpacity onPress={() => handleItemPress(item)} activeOpacity={0.9} style={{ marginBottom: 16 }}>
        <GlassView style={styles.card} borderRadius={20}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <Heart size={18} color="#FF5A5F" fill="#FF5A5F" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={styles.row}>
              <Text style={styles.price}>₹{item.price}<Text style={styles.perDay}>/day</Text></Text>
              <View style={styles.rating}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{item.rating || 0}</Text>
              </View>
            </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorites yet</Text>
              <Text style={styles.emptySubtext}>Save items you like to watch them here</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#333'
  },
  content: {
    flex: 1,
    marginLeft: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5A5F'
  },
  perDay: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400'
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4
  },
  favButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 6,
    borderRadius: 20
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
});

export default FavoritesScreen;
