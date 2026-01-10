import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Reusable Image Slider Component
 * Features: swipe gestures, prev/next buttons, pagination dots
 * 
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs
 * @param {number} props.height - Slider height (default: 300)
 * @param {boolean} props.showButtons - Show prev/next buttons (default: true)
 * @param {boolean} props.showDots - Show pagination dots (default: true)
 * @param {number} props.borderRadius - Image border radius (default: 0)
 * @param {function} props.onImagePress - Callback when image is pressed
 */
const ImageSlider = ({
  images = [],
  height = 300,
  showButtons = true,
  showDots = true,
  borderRadius = 0,
  onImagePress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Default placeholder if no images
  const imageList = images.length > 0
    ? images
    : ['https://via.placeholder.com/400x300?text=No+Image'];

  const goToNext = useCallback(() => {
    if (currentIndex < imageList.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, imageList.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={onImagePress ? 0.9 : 1}
      onPress={() => onImagePress && onImagePress(index)}
      style={[styles.imageContainer, { width: SCREEN_WIDTH, height }]}
    >
      <Image
        source={{ uri: item }}
        style={[styles.image, { borderRadius }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {imageList.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={imageList}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Navigation Buttons */}
      {showButtons && imageList.length > 1 && (
        <>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrev}
              activeOpacity={0.8}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {currentIndex < imageList.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
              activeOpacity={0.8}
            >
              <ChevronRight size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Pagination Dots */}
      {showDots && imageList.length > 1 && renderDots()}

      {/* Image Counter */}
      {imageList.length > 1 && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {imageList.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#1A1A1A',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  prevButton: {
    left: 12,
  },
  nextButton: {
    right: 12,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#FF5A5F',
    width: 24,
  },
  counterContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ImageSlider;
