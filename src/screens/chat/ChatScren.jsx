import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Send, Paperclip, MoreVertical } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { owner, product } = route.params || {}; 
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
        {/* Glass effect for message bubbles */}
        {!isMe && (
           <View style={StyleSheet.absoluteFill}>
             <View style={styles.bubbleGlassTint} />
             <View style={styles.bubbleBorder} />
           </View>
        )}
        
        <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
        <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.glassBackground}>
            {Platform.OS === 'ios' ? (
                <BlurView blurType="dark" blurAmount={20} style={StyleSheet.absoluteFill} />
            ) : (
                <View style={styles.androidHeaderBlur} />
            )}
            <View style={styles.headerBorder} />
        </View>

        <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
                <Image source={{ uri: owner?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.headerAvatar} />
                <View>
                    <Text style={styles.headerName}>{owner?.name || 'User'}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.status}>Online</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
      </View>
      
      {/* Product Context Header */}
      {product && (
        <TouchableOpacity 
            style={styles.productBanner} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ItemDetail', { 
                product: { ...product, owner: owner },
                hideRentOption: true,
                hideChatOption: true
            })}
        >
            <View style={styles.productGlass} />
            <Image source={{ uri: product.image }} style={styles.productThumb} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.productPrice}>₹{product.price}<Text style={styles.perTime}>/day</Text></Text>
            </View>
            <ChevronLeft size={20} color="rgba(255,255,255,0.5)" style={{transform: [{rotate: '180deg'}]}} />
        </TouchableOpacity>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatContent}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
        />
      </TouchableWithoutFeedback>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardAvoid}
      >
        <View style={styles.inputContainer}>
            <View style={styles.inputGlassBackground}>
                {Platform.OS === 'ios' && <BlurView blurType="dark" blurAmount={20} style={StyleSheet.absoluteFill} />}
                <View style={styles.inputBorder} />
            </View>

            <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={22} color="#888" />
            </TouchableOpacity>
            
            <View style={styles.textInputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
            </View>
            
            <TouchableOpacity 
                style={[styles.sendButton, message.trim().length > 0 && styles.sendButtonActive]} 
                onPress={sendMessage}
                disabled={message.trim().length === 0}
            >
                <Send size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  
  // Header
  header: { 
      paddingTop: Platform.OS === 'ios' ? 60 : 40, 
      paddingBottom: 15,
      zIndex: 100,
  },
  headerContent: {
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
  },
  glassBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(30,30,35,0.85)',
  },
  androidHeaderBlur: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(30,30,35,0.95)',
  },
  headerBorder: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backButton: { marginRight: 15 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  status: { color: '#4CAF50', fontSize: 12 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50', marginRight: 4 },
  moreButton: { padding: 4 },

  // Product Context
  productBanner: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 12, 
      marginHorizontal: 16, 
      marginTop: 10,
      borderRadius: 16,
      overflow: 'hidden',
  },
  productGlass: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      borderRadius: 16,
  },
  productThumb: { width: 40, height: 40, borderRadius: 8, marginRight: 12, backgroundColor: '#333' },
  productInfo: { flex: 1 },
  productTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  productPrice: { color: '#FF5A5F', fontSize: 13, fontWeight: '700' },
  perTime: { color: '#888', fontSize: 11, fontWeight: '400' },

  // Chat Area
  chatContent: { padding: 20, paddingBottom: 20 },
  messageBubble: { 
      maxWidth: '80%', 
      padding: 12, 
      borderRadius: 20, 
      marginBottom: 12,
      overflow: 'hidden',
  },
  myMessage: { 
      alignSelf: 'flex-end', 
      backgroundColor: '#FF5A5F', 
      borderBottomRightRadius: 4,
  },
  theirMessage: { 
      alignSelf: 'flex-start', 
      backgroundColor: 'transparent', 
      borderBottomLeftRadius: 4,
  },
  bubbleGlassTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bubbleBorder: {
      ...StyleSheet.absoluteFillObject,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
  },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#FFF' },
  theirText: { color: '#EEE' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myTime: { color: 'rgba(255,255,255,0.7)' },
  theirTime: { color: '#888' },

  // Input Area
  keyboardAvoid: { 
    // flex: 1, // Do not set flex 1 here, let it just wrap content
  },
  inputContainer: { 
      flexDirection: 'row', 
      alignItems: 'flex-end', 
      padding: 12, 
      paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  inputGlassBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(20, 20, 25, 0.95)',
  },
  inputBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.08)',
  },
  attachButton: { padding: 10, paddingBottom: 12 },
  textInputWrapper: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 24,
      minHeight: 44,
      maxHeight: 100,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      justifyContent: 'center',
  },
  input: { 
      flex: 1, 
      color: '#FFF', 
      paddingHorizontal: 16, 
      paddingVertical: 10, 
      fontSize: 15,
  },
  sendButton: { 
      width: 44, 
      height: 44, 
      borderRadius: 22, 
      backgroundColor: '#333', 
      justifyContent: 'center', 
      alignItems: 'center',
  },
  sendButtonActive: {
      backgroundColor: '#FF5A5F',
  },
});

export default ChatScreen;