import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getItemReviews, getUserReviews } from '../../services/reviewService';
import GlassView from '../../components/GlassView';

const ReviewsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { entityId, entityType, title } = route.params || {};

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [entityId]);

  const fetchReviews = async () => {
    if (!entityId) return;

    try {
      setLoading(true);
      let response;
      if (entityType === 'user') {
        response = await getUserReviews(entityId);
      } else {
        response = await getItemReviews(entityId);
      }
      
      const fetchedReviews = response.reviews || [];
      setReviews(fetchedReviews);
      
      // Calculate average if not provided
      if (fetchedReviews.length > 0) {
        const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(total / fetchedReviews.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderReviewItem = ({ item }) => (
    <GlassView style={styles.reviewCard}>
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
                size={14}
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
    </GlassView>
  );

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
        <Text style={styles.headerTitle}>{title || 'Reviews'}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.summaryContainer}>
               <Text style={styles.ratingLarge}>{averageRating.toFixed(1)}</Text>
               <View style={styles.starRowLarge}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={20}
                        color="#FFD700"
                        fill={star <= Math.round(averageRating) ? "#FFD700" : "transparent"}
                    />
                  ))}
               </View>
               <Text style={styles.ratingCount}>based on {reviews.length} reviews</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet</Text>
            </View>
          }
        />
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  summaryContainer: {
      alignItems: 'center',
      marginBottom: 30,
  },
  ratingLarge: {
      fontSize: 48,
      fontWeight: '700',
      color: '#FFF',
  },
  starRowLarge: {
      flexDirection: 'row',
      marginVertical: 8,
      gap: 4,
  },
  ratingCount: {
      color: '#888',
      fontSize: 14,
  },
  reviewCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
  },
  reviewComment: {
    color: '#EEE',
    fontSize: 15,
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ReviewsScreen;
