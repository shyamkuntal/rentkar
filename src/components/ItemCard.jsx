import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { MapPin, Clock } from 'lucide-react-native';

/**
 * ItemCard - Liquid Glass Product Card
 * 
 * Features multiple glass layers:
 * - Blur background
 * - Glass tint overlay  
 * - Shine highlights (top-left, bottom-right)
 * - Subtle border
 */
const ItemCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardWrapper}>
        {/* Layer 1: Blur Background */}
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={12}
            reducedTransparencyFallbackColor="rgba(30, 30, 35, 0.9)"
          />
        ) : (
          <View style={styles.androidBlur} />
        )}

        {/* Layer 2: Glass Tint */}
        <View style={styles.glassTint} />

        {/* Layer 3: Shine Top-Left */}
        <View style={styles.shineTopLeft} />

        {/* Layer 4: Shine Bottom-Right */}
        <View style={styles.shineBottomRight} />

        {/* Layer 5: Border */}
        <View style={styles.borderLayer} />

        {/* Content */}
        <View style={styles.card}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/400') }} 
              style={styles.image} 
            />
          </View>
          
          {/* Details */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.priceUnit}>/day</Text>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#888" />
                <Text style={styles.location}>{item.location || 'Mumbai'}</Text>
              </View>
              
              {item.owner && (
                <View style={styles.ownerRow}>
                  <Image 
                    source={{ uri: item.owner.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                    style={styles.ownerAvatar} 
                  />
                  <Text style={styles.ownerName}>by {item.owner.name}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 310,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Android blur fallback
  androidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.92)',
  },
  
  // Glass tint - rgba(255,255,255,0.1)
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Shine top-left
  shineTopLeft: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  
  // Shine bottom-right
  shineBottomRight: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  
  // Border layer
  borderLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  card: {
    flex: 1,
    zIndex: 10,
  },
  
  imageContainer: {
    overflow: 'hidden',
  },
  
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
  },
  
  content: {
    padding: 14,
    flex: 1,
  },
  
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 6,
    height: 40, // Fixed height for 2 lines
  },
  
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  
  priceUnit: {
    fontSize: 12,
    color: '#888',
    marginLeft: 2,
  },
  
  
  metaContainer: {
    marginTop: 4,
  },
  
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  location: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
  
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ownerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  
  ownerName: {
    fontSize: 11,
    color: '#888',
  },
});

export default ItemCard;
