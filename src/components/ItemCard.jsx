import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const ItemCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardWrapper}>

        {/* Glass Blur Layer */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.3)"
        />

        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>₹{item.price}/day</Text>
            <Text style={styles.owner}>By {item.owner.name}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: 260, // Fixed height to prevent size variance
    borderRadius: spacing.borderRadius.l,
    overflow: 'hidden',
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)', // transparent glass
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
  },
  content: {
    padding: spacing.m,
  },
  title: {
    fontSize: typography.size.m,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  price: {
    fontSize: typography.size.s,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  owner: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});

export default ItemCard;
