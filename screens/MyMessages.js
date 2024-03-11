import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ChatService from '../api/ChatService';
import {getChats} from '../api/ChatRestService';
import { AuthContext } from '../AuthContext';

const MyMessages = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchChats = async () => {
    try {
      const userId = user._id;
      //let fetchedChats = await ChatService.getChats(userId);
      let fetchedChats = await getChats(userId);
      fetchedChats = fetchedChats.filter(chat => chat.messages && chat.messages.length > 0);
      /*fetchedChats.forEach(chat => {
          console.log(`Chat ID: ${chat._id}`);
          chat.messages.forEach((message, index) => {
            console.log(`Message ${index + 1}: ${message.content}`);
          });
        });*/
      setChats(fetchedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  /*useEffect(() => {  
    ChatService.initializeSocket(); // Initialize the socket connection  

    return () => {
      ChatService.turnOffSockets();
      
      ChatService.disconnectSendMessageSockets();
      ChatService.disconnectGetChatSockets();

      ChatService.disconnectSocket(); // Disconnect the socket when the component unmounts
    };
  }, []);*/
  
  useFocusEffect(
    React.useCallback(() => {
      fetchChats(); // Fetch chats when the screen comes into focus
    }, [user._id])
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item._id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => {
        // Check if there's at least one message in the array
        const lastMessage = item.messages[item.messages.length - 1];
        const lastMessageContent = lastMessage ? lastMessage.content : 'No messages';
        const lastMessageSenderName = lastMessage?.senderId?.userName ?? 'Unknown';
        const lastMessageTimestamp = lastMessage ? lastMessage.sentAt : new Date();
      
        return (
          // TODO remove the timeout
          <TouchableOpacity onPress={() => setTimeout(() => navigation.navigate('ChatScreen', { chat: item }), 100)}> 
            <View style={styles.chatItem}>
              <Image source={{ uri: item.listingId.imageUrls[0] }} style={styles.image} />
              <View style={styles.contentContainer}>
                <Text style={styles.title}>
                {lastMessageSenderName} · {item.listingId.title.length > 30
                    ? item.listingId.title.substring(0, 30) + '...'
                    : item.listingId.title}
                </Text>
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>
                    {lastMessageContent.length > 50
                      ? lastMessageContent.substring(0, 50) + '...'
                      : lastMessageContent}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginLeft: 60, // To align with the text next to the image
  },
});

export default MyMessages; 