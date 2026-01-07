import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../data/items';
import { categories } from '../../data/categories';
import ItemCard from '../../components/ItemCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import { Laptop, Car, Building2, Shirt, Camera, ChevronDown, User } from 'lucide-react-native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const getCategoryIcon = (name) => {
    const iconProps = { size: 24, color: colors.text.secondary };
    switch (name) {
      case 'Electronics':
        return <Laptop {...iconProps} />;
      case 'Vehicles':
        return <Car {...iconProps} />;
      case 'Properties':
        return <Building2 {...iconProps} />;
      case 'Fashion':
        return <Shirt {...iconProps} />;
      case 'Sports Gear':
        return <Camera {...iconProps} />;
      default:
        return null;
    }
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryBadge}>
      {getCategoryIcon(item.name)}
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCardWrapper}>
      <ItemCard
        item={item}
        onPress={() => navigation.navigate('ItemDetail', { item })}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#9584b3ff', '#666290ff', '#677bb2ff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RentKar</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for rentals..."
          placeholderTextColor={colors.text.secondary}
        />
        <ChevronDown size={24} color={colors.text.secondary} />
        <View style={styles.avatar}>
          <User size={20} color={colors.text.primary} />
        </View>
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
          <Text style={styles.sectionTitle}>Recommended</Text>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginRight: spacing.m,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.glass.card,
    borderRadius: spacing.borderRadius.l,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    color: colors.text.primary,
    fontSize: typography.size.s,
    marginRight: spacing.s,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
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
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderRadius: spacing.borderRadius.l,
    marginRight: spacing.m,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  categoryText: {
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    fontSize: typography.size.xs,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  itemCardWrapper: {
    flex: 0.48, // To ensure two columns with space
  },
});

export default HomeScreen;