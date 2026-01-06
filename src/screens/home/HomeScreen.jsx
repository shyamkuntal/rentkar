import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../data/items';
import { categories } from '../../data/categories';
import ItemCard from '../../components/ItemCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const HomeScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    />
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RentKar</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
    backgroundColor: colors.glass.background,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  section: {
    marginBottom: spacing.l,
    paddingHorizontal: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.size.l,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.m,
    color: colors.text.primary,
  },
  categoryList: {
    paddingRight: spacing.m,
  },
  categoryBadge: {
    backgroundColor: colors.glass.card,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: spacing.borderRadius.l,
    marginRight: spacing.s,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  categoryText: {
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
});

export default HomeScreen;
