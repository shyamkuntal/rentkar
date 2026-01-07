import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Send, Paperclip } from 'lucide-react-native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Added useRoute
  const { owner, product } = route.params || {}; // Destructure product too
  const [message, setMessage] = useState('');
  
  // Mock Messages
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi, is the drone available for this weekend?', sender: 'me', time: '10:30 AM' },
    { id: '2', text: 'Yes, it is available! How many days do you need it for?', sender: 'them', time: '10:32 AM' },
    { id: '3', text: 'Just for Saturday and Sunday. Does it come with an extra battery?', sender: 'me', time: '10:33 AM' },
  ]);

  const sendMessage = () => {
    if (message.trim().length > 0) {
      setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'me', time: 'Now' }]);
      setMessage('');
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
        <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
            <Image source={{ uri: owner?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.headerAvatar} />
            <View>
                <Text style={styles.headerName}>{owner?.name || 'User'}</Text>
                <Text style={styles.status}>Online</Text>
            </View>
        </View>
      </View>
      
      {/* Product Header (Optional) */}
      {product && (
        <TouchableOpacity 
            style={styles.productHeader} 
            onPress={() => navigation.navigate('ItemDetail', { 
                product: { ...product, owner: owner },  // Ensure complete product object if needed. 
                // However, navigation from ChatList might pass partial product. 
                // If it's partial, we might need more data. 
                // Assuming for now product passed contains title, price, image etc. 
                // If from ItemDetailScreen, we should pass FULL product.
                hideRentOption: true,
                hideChatOption: true
            })}
        >
            <Image source={{ uri: product.image }} style={styles.productThumb} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.productPrice}>₹{product.price}<Text style={styles.perTime}>/day</Text></Text>
            </View>
            <ChevronLeft size={20} color="#888" style={{transform: [{rotate: '180deg'}]}} />
        </TouchableOpacity>
      )}

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
      />

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={20}>
        <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color="#888" />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                value={message}
                onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Send size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', backgroundColor: '#1E1E23' },
  backButton: { marginRight: 15 },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  status: { color: '#4CAF50', fontSize: 12 },
  
  chatContent: { padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 20, marginBottom: 12 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#FF5A5F', borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#333', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#FFF' },
  theirText: { color: '#EEE' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myTime: { color: 'rgba(255,255,255,0.7)' },
  theirTime: { color: '#888' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#1E1E23', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  attachButton: { padding: 10 },
  input: { flex: 1, backgroundColor: '#2C2C30', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, color: '#FFF', marginHorizontal: 10, maxHeight: 100 },
  sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FF5A5F', justifyContent: 'center', alignItems: 'center' },
  
  productHeader: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  productThumb: { width: 40, height: 40, borderRadius: 8, marginRight: 10, backgroundColor: '#333' },
  productInfo: { flex: 1 },
  productTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  productPrice: { color: '#FF5A5F', fontSize: 13, fontWeight: '700' },
  perTime: { color: '#888', fontSize: 11, fontWeight: '400' },
});

export default ChatScreen;