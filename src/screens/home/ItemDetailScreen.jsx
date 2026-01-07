import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
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
  const hideProfileLink = route.params?.hideProfileLink;

  const product = route.params?.product || {
    id: '1',
    title: 'DJI Mavic Air 2 Drone Combo',
    image: 'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop', 
    price: 800,
    rateUnit: '/day',
    location: 'Bandra, Mumbai',
    rating: 4.9,
    reviews: 128,
    description:
      'Rent this amazing DJI Mavic Air 2 drone for your next shoot! It captures stunning 4K/60fps video and 48MP photos. Features include 34-minute flight time, 10km video transmission, and advanced obstacle avoidance.',
    owner: {
      name: 'Vikram Singh',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      responseRate: '98%',
      location: 'Mumbai, India',
      joined: 'Dec 2023',
      rating: 4.8,
    },
  };

  // --- Navigation Handlers ---

  const handleRentNow = () => {
    // Pass the product details to the booking screen
    navigation.navigate('RentBooking', { product: product });
  };

  const handleChat = () => {
    // Pass owner details to chat
    navigation.navigate('Chat', { owner: product.owner });
  };

  const handleViewProfile = () => {
    // Pass owner details to profile
    navigation.navigate('LenderProfile', { owner: product.owner });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Product Image Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />
          
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerButtons}>
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
                <TouchableOpacity style={styles.roundButton}>
                  <Heart size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Main Content Body */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.rateUnit}>{product.rateUnit}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.locationBadge}>
              <MapPin size={14} color={colors.text.secondary} />
              <Text style={styles.locationText}>{product.location}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}> {product.rating} ({product.reviews} reviews)</Text>
            </View>
          </View>

          {/* Owner Profile Card */}
          <View style={styles.ownerCard}>
            <Image source={{ uri: product.owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Lender</Text>
              <Text style={styles.ownerName}>{product.owner.name}</Text>
              <Text style={styles.ownerResponse}>Response Rate: {product.owner.responseRate}</Text>
            </View>
            
            {/* Added onPress here, hidden if navigated from profile */}
            {!hideProfileLink && (
              <TouchableOpacity style={styles.viewProfileBtn} onPress={handleViewProfile}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
          
          <View style={{ height: 110 }} /> 
        </View>
      </ScrollView>

      {/* Floating Glass Action Bar */}
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
          {/* Added onPress here */}
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <MessageCircle size={24} color={colors.primary} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          
          {/* Added onPress here */}
          <TouchableOpacity style={styles.rentButton} onPress={handleRentNow}>
            <Text style={styles.rentButtonText}>Rent Now</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    ...StyleSheet.absoluteFillObject,
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
    paddingTop: Platform.OS === 'android' ? 40 : 10,
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
  ownerResponse: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  androidGlassFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 30, 35, 0.92)',
  },
  bottomBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  chatButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
});

export default ProductDetailsScreen;