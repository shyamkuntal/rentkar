import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const ItemCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>₹{item.pricePerDay}/day</Text>
          <Text style={styles.owner}>By {item.owner}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.card,
    borderRadius: spacing.borderRadius.l,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.m,
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
