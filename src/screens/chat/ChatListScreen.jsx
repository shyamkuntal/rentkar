import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';

const ChatListScreen = () => {
  const navigation = useNavigation();

  // Mock Chat Data
  const chats = [
    {
      id: '1',
      user: 'Vikram Singh',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      item: 'DJI Mavic Air 2',
      image: 'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop',
      price: 800,
      lastMessage: 'Is the drone available for this weekend?',
      time: '2m ago',
      unread: 2
    },
    {
      id: '2',
      user: 'Priya Patel',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      item: 'GoPro Hero 11',
      image: 'https://images.unsplash.com/photo-1588785392665-f6d4a541417d?auto=format&fit=crop&q=80&w=1000',
      price: 350,
      lastMessage: 'Thanks for the quick response!',
      time: '1h ago',
      unread: 0
    },
    {
      id: '3',
      user: 'Rahul Kumar',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      item: 'Sony Alpha a7 III',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
      price: 1200,
      lastMessage: 'Can I pick it up tomorrow morning?',
      time: '3h ago',
      unread: 1
    },
    {
      id: '4',
      user: 'Anjali Gupta',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      item: 'Canon 50mm Lens',
      image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=400',
      price: 250,
      lastMessage: 'The lens condition is pristine.',
      time: '1d ago',
      unread: 0
    }
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { 
        owner: { name: item.user, avatar: item.avatar }, 
        product: { title: item.item, image: item.image, price: item.price } 
      })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.itemName}>Re: {item.item}</Text>
        <View style={styles.messageRow}>
          <Text style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom tab bar
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  itemName: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 2,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    flex: 1,
    marginRight: 10,
  },
  unreadMessage: {
    color: '#FFF',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
