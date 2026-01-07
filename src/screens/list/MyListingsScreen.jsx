import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Edit2, Trash2, Eye, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const MyListingsScreen = () => {
  const navigation = useNavigation();

  // Mock Listings Data
  const listings = [
    {
      id: '1',
      title: 'Sony Alpha a7 III Kit',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
      views: 245,
      status: 'active',
      date: 'Posted Oct 10'
    },
    {
      id: '2',
      title: 'GoPro Hero 11 Black',
      price: 350,
      image: 'https://images.unsplash.com/photo-1588785392665-f6d4a541417d?auto=format&fit=crop&q=80&w=1000',
      views: 128,
      status: 'rented',
      date: 'Posted Sep 15'
    },
    {
      id: '3',
      title: 'DJI Mavic 3 Drone',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1000',
      views: 89,
      status: 'active',
      date: 'Posted Nov 01'
    }
  ];

  const renderListingItem = ({ item }) => (
    <View style={styles.listingCard}>
      <Image source={{ uri: item.image }} style={styles.listingImage} />

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity>
            <MoreHorizontal size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>₹{item.price}<Text style={styles.perDay}>/day</Text></Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Eye size={14} color="#888" />
            <Text style={styles.statText}>{item.views} Views</Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusRented]}>
            <Text style={[styles.statusText, item.status === 'active' ? styles.textActive : styles.textRented]}>
              {item.status === 'active' ? 'Active' : 'Rented'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Edit2 size={16} color="#FFF" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Trash2 size={16} color="#FF4545" />
            <Text style={[styles.actionText, { color: '#FF4545' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ads</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary || '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary || '#FF5A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listingCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  listingImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#333',
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary || '#FF5A5F',
    marginBottom: 12,
  },
  perDay: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  statusRented: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textActive: {
    color: '#4CAF50',
  },
  textRented: {
    color: '#FFC107',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingVertical: 4,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default MyListingsScreen;
