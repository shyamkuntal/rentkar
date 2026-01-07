import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Send, Paperclip } from 'lucide-react-native';

const ChatScreen = () => {
  const navigation = useNavigation();
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
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.headerAvatar} />
            <View>
                <Text style={styles.headerName}>Vikram Singh</Text>
                <Text style={styles.status}>Online</Text>
            </View>
        </View>
      </View>

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
});

export default ChatScreen;