import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from '../component/NavigationBar';
import axiosInstance from '../component/axiosInstance';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/chat/get_all_messages/');
      const data = response.data;

      const fetchedMessages = data.chat_contents.map((msg, index) => ({
        id: `${data.id}-${index}`,
        text: msg.text,
        sender: msg.sent_by === 'user' ? 'user' : 'ai',
      }));
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use useFocusEffect instead of useEffect
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [])
  );

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const userMessage = {
      id: `${Date.now()}-user`,
      text: newMessage,
      sender: 'user',
    };
    setMessages([...messages, userMessage]);
    setNewMessage('');

    try {
      const response = await axiosInstance.post('/chat/send_message/', {
        query: userMessage.text,
      });
      console.log("response", response.data);

      if (response.status === 200) {
        const fetchedMessages = response.data.chat_contents.map((msg, index) => ({
          id: `${msg.id}-${index}`,
          text: msg.text,
          sender: msg.sent_by === 'user' ? 'user' : 'ai',
        }));
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust for Android if needed
      >
        {/* Header with Back Arrow and Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View></View>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your query here"
            placeholderTextColor="#888"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Uncomment if you want the NavigationBar back */}
      {/* <NavigationBar navigation={navigation} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E2F',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#FF5555',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#3A3A4C',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2A2A3C',
    // Removed marginBottom to let KeyboardAvoidingView handle it
  },
  input: {
    flex: 1,
    backgroundColor: '#3A3A4C',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFF',
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FF5555',
    borderRadius: 20,
    padding: 10,
  },
});