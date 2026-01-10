import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  MapPin,
  MessageCircle,
  Heart,
  Share2,
  Star
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createChat } from '../../services/chatService';
import { checkFavorite, addFavorite, removeFavorite } from '../../services/favoriteService';
import { getItemReviews } from '../../services/reviewService';
import { AuthContext } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageSlider from '../../components/ImageSlider';

const colors = {
  primary: '#FF5A5F',
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
  },
  background: '#1A1A1A',
  card: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
};

const { height } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const hideProfileLink = route.params?.hideProfileLink;
  const hideRentOption = route.params?.hideRentOption;
  const hideChatOption = route.params?.hideChatOption;

  const product = route.params?.product;
  const [isFavorite, setIsFavorite] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  // We need a local state for product because we might need to refresh it
  // or it might be partial from the navigation params
  const [item, setItem] = useState(product);

  const isOwner = user?.id === item?.owner?.id;
  
  useEffect(() => {
    if (product?.id) {
      checkFavoriteStatus();
      fetchReviews();
      fetchFullItemDetails();
    }
  }, [product?.id]);

  const fetchFullItemDetails = async () => {
    try {
      const { getItemById } = require('../../services/itemService'); 
      const response = await getItemById(product.id);
      if (response && response.item) {
        setItem(response.item);
      }
    } catch (error) {
      console.log('Error fetching full item details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getItemReviews(product.id);
      setReviews(response.reviews || []);
    } catch (error) {
      console.log('Error fetching reviews:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await checkFavorite(product.id);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.log('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(product.id);
        setIsFavorite(false);
      } else {
        await addFavorite(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleRentNow = () => {
    navigation.navigate('RentBooking', { product: item });
  };

  const handleChat = async () => {
    try {
      setChatLoading(true);
      const response = await createChat(item.id, item.owner.id);
      const chat = response.chat;

      navigation.navigate('ChatScreen', {
        chatId: chat.id,
        recipientId: item.owner?.id,
        recipientName: item.owner?.name,
        recipientAvatar: item.owner?.avatar,
        product: item
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleViewProfile = () => {
    if (item?.owner) {
      navigation.navigate('LenderProfile', { owner: item.owner });
    }
  };

  if (!item) return null;

  // Logic to determine if buttons should be shown
  const showStats = !isOwner && item.status === 'active';
  const showChat = !hideChatOption && !isOwner && item.status === 'active';
  const showRent = !hideRentOption && !isOwner && item.status === 'active';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Product Image Slider */}
        <View style={styles.imageContainer}>
          <ImageSlider 
            images={item.images?.length > 0 ? item.images : [item.image || 'https://via.placeholder.com/400']}
            height={height * 0.45}
            showButtons={true}
            showDots={true}
          />
          <View style={styles.imageOverlay} pointerEvents="none" />
        </View>

        {/* Main Content Body */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.rateUnit}>{item.rateUnit || '/day'}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.locationBadge}>
              <MapPin size={14} color={colors.text.secondary} />
              <Text style={styles.locationText}>{item.location || 'Location N/A'}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}> {item.rating ? `${Number(item.rating).toFixed(1)}/5` : 'New'} ({item.reviews || 0} reviews)</Text>
            </View>
          </View>

          {/* Owner Profile Card */}
          <View style={styles.ownerCard}>
            <Image source={{ uri: item.owner?.avatar || 'https://via.placeholder.com/100' }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Lender</Text>
              <Text style={styles.ownerName}>{item.owner?.name || 'Unknown User'}</Text>
              <View style={styles.ownerRatingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    color="#FFD700"
                    fill={star <= Math.round(item.owner?.rating || 0) ? '#FFD700' : 'transparent'}
                  />
                ))}
                <Text style={styles.ownerRatingText}>
                  {item.owner?.rating ? `${Number(item.owner.rating).toFixed(1)}/5` : 'No rating'}
                </Text>
              </View>
            </View>

            {!hideProfileLink && !isOwner && item.owner && (
              <TouchableOpacity style={styles.viewProfileBtn} onPress={handleViewProfile}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
              {reviews.slice(0, 3).map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.reviewer?.avatar || 'https://via.placeholder.com/40' }}
                      style={styles.reviewerAvatar}
                    />
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.reviewer?.name || 'Anonymous'}</Text>
                      <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color="#FFD700"
                            fill={star <= review.rating ? "#FFD700" : "transparent"}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  {review.comment && (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* Fixed Header with Gradient */}
      <View style={[styles.headerSafeArea, { height: insets.top + 60 }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.headerButtons, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            <TouchableOpacity style={[styles.roundButton, styles.marginRight]}>
              <Share2 size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundButton} onPress={toggleFavorite}>
               <Heart size={22} color={isFavorite ? "#FF5A5F" : "#FFF"} fill={isFavorite ? "#FF5A5F" : "transparent"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Floating Glass Action Bar */}
      {(showRent || showChat) && (
        <View style={styles.bottomBarContainer}>
          <View style={styles.glassBackground}>
            {Platform.OS === 'android' ? (
              <View style={styles.androidGlassFallback} />
            ) : (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={25}
                reducedTransparencyFallbackColor="rgba(30,30,35,0.95)"
              />
            )}
          </View>

          <View style={styles.bottomBarContent}>
            {showChat && (
              <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                <MessageCircle size={24} color={colors.primary} />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            )}

            {showRent && (
              <TouchableOpacity style={styles.rentButton} onPress={handleRentNow}>
                <Text style={styles.rentButtonText}>Rent Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  imageContainer: {
    height: height * 0.45,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10, // Will be overridden by inline style
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 12,
  },
  contentContainer: {
    padding: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -35,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    marginRight: 16,
    lineHeight: 32,
  },
  priceWrapper: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  rateUnit: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  locationText: {
    color: colors.text.secondary,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ownerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  ownerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownerRatingText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  viewProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  viewProfileText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 26,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden', // Ensure blur doesn't leak
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glassBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  androidGlassFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.92)',
  },
  bottomBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Changed to space-around for better centering when single item
    paddingHorizontal: 24,
  },
  chatButton: {
    // justifyContent: '',
    // alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1, // Allow it to flex
  },
  chatButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  rentButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 38,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  rentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Review styles
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: '#CCC',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
});

export default ProductDetailsScreen;