import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { MapPin } from 'lucide-react-native';

/**
 * ItemCard - Clean Minimal Product Card
 * 
 * Simplified design with:
 * - Large image
 * - Title + Brand/Model
 * - Price + Location + Rating in one row
 */
const ItemCard = ({ item, onPress }) => {
  // Build brand/model text
  const brandModelText = [item.brand, item.model].filter(Boolean).join(' • ');

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

        {/* Layer 3: Border */}
        <View style={styles.borderLayer} />

        {/* Content */}
        <View style={styles.card}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/400') }}
              style={styles.image}
            />
            {/* Rating Badge on Image */}
            {item.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Text style={styles.starText}>★</Text>
                <Text style={styles.ratingText}>{item.rating?.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

            {brandModelText ? (
              <Text style={styles.subText} numberOfLines={1}>{brandModelText}</Text>
            ) : null}

            <View style={styles.bottomRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.priceUnit}>/day</Text>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={11} color="#888" />
                <Text style={styles.location} numberOfLines={1}>{item.location || 'Mumbai'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Android blur fallback
  androidBlur: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 30, 35, 0.95)',
  },

  // Glass tint
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  // Border layer
  borderLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  card: {
    flex: 1,
    zIndex: 10,
  },

  imageContainer: {
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#333',
  },

  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  starText: {
    color: '#FFD700',
    fontSize: 11,
    marginRight: 3,
  },

  ratingText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 18,
    marginBottom: 2,
  },

  subText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5A5F',
  },

  priceUnit: {
    fontSize: 11,
    color: '#888',
    marginLeft: 2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },

  location: {
    fontSize: 11,
    color: '#888',
    marginLeft: 3,
    maxWidth: 80,
  },
});

export default ItemCard;
