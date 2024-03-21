import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import {markMessagesAsRead} from '../api/ChatRestService';
import ChatService from '../api/ChatService';
import { AuthContext } from '../AuthContext';
import useHideBottomTab from '../utils/HideBottomTab'; 

const ChatScreen = ({ route, navigation }) => {
  const { chat } = route.params; // Extract chat from route.params
  const { user, logout } = useContext(AuthContext);

  useHideBottomTab(navigation, true);

  const transformMessages = (messages) => {
    // Deduplicate messages based on _id
    const uniqueIds = Array.from(new Set(messages.map(message => message._id)));
    const uniqueMessages = uniqueIds.map(id => {
      return messages.find(message => message._id === id);
    });
  
    // Transform messages to fit GiftedChat and handle dates
    const transformedMessages = uniqueMessages.map(message => {
      return {
        _id: message._id,
        text: message.content,
        createdAt: message.sentAt ? new Date(message.sentAt) : new Date(),
        user: {
          _id: message.senderId ? (message.senderId._id || message.senderId) : 'unknown',
          name: message.senderId ? (message.senderId.userName || (message.senderId === user._id || message.senderId._id === user._id ? 'You' : 'Unknown')) : 'Unknown',
        },
      };
    });
  
    // Sort messages by createdAt in ascending order (oldest first)
    transformedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return transformedMessages;
  };

  // Use the messages from the chat object to set the initial state
  // Transform them to fit GiftedChat's format
  const initialMessages = transformMessages(chat.messages || []);
  const [messages, setMessages] = useState(initialMessages);

  const ChatHeader = ({ listing }) => {  
    if (!listing) return null; // Return null if listing details aren't provided
  
    const navigateToListing = () => {
      navigation.navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { item: listing }
      });
    };
  
    return (
      <TouchableOpacity onPress={navigateToListing}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: listing.imageUrls[0] }} style={styles.listingImage} />
          <View style={styles.listingDetails}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <Text style={styles.listingPrice}>${listing.price.toString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBubble = (props) => {
    const isCurrentUser = props.currentMessage.user._id === user._id;
    const senderName = isCurrentUser ? 'You' : props.currentMessage.user.name; // Show 'You' for current user, else show sender's name

    return (
      <View style={styles.bubbleOuterView}>
        {!isCurrentUser && ( // Only show sender's name for messages from other users
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            left: styles.bubbleLeft,
            right: styles.bubbleRight,
          }}
          textStyle={{
            left: styles.textLeft,
            right: styles.textRight,
          }}
          renderTime={(timeProps) => (
            <Time {...timeProps} textStyle={styles.timeText} />
          )}
        />
      </View>
    );
  };

  useEffect(() => {
    //console.log('Setting up socket listener for chat: ', chat);
    ChatService.initializeSocket();
  
    // Join the chat room
    ChatService.socket.emit('joinRoom', chat._id);
  
    const handleNewMessages = (newMessages) => {
    setMessages(previousMessages => {
        // Immediately deduplicate new messages based on _id
        const deduplicatedNewMessages = newMessages.filter(newMsg => 
          !previousMessages.some(prevMsg => prevMsg._id === newMsg._id)
        );
    
        // Transform deduplicated new messages
        const transformedNewMessages = transformMessages(deduplicatedNewMessages);
    
        // Combine with previous messages and sort (if sorting is needed)
        const combinedMessages = [...previousMessages, ...transformedNewMessages];
        combinedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        return combinedMessages;
      });
    };
  
    // Listen for new messages
    ChatService.socket.on('messageRcvd', handleNewMessages);
  
    // Cleanup function to leave the room and remove the event listener
    return () => {
      console.log('Leaving chat room and removing socket listener');
      
      // Emit an event to leave the room when the component unmounts or chat changes
      ChatService.socket.emit('leaveRoom', chat._id);
  
      // Remove the message listener
      ChatService.socket.off('messageRcvd', handleNewMessages);
      ChatService.turnOffSockets();
    };
  }, [chat]); // Depend on `chat` to re-run this effect if the chat changes
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        // Call the function to mark messages as read
        markMessagesAsRead(chat._id, user._id);
      } catch (error) {
        if (error.message === 'RefreshTokenExpired') {
          logout();
        } else {
          console.error('Error deleting listing:', error);
        }
      }
    });
  
    return unsubscribe;
  }, [navigation]);

  const onSend = (newMessages = []) => {
    newMessages.forEach((message) => {
      const createMessageDTO = {
        senderId: user._id,
        content: message.text,
        sentAt: message.createdAt
      };
      ChatService.sendMessage(createMessageDTO, chat._id);
    });
    // Update the local state with the new message so it renders immediately
    /*setMessages(previousMessages => {
      const newUniqueMessages = newMessages.filter(newMsg => 
        !previousMessages.some(prevMsg => prevMsg._id === newMsg._id)
      );
      return GiftedChat.append(previousMessages, newUniqueMessages);
    });*/
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader listing={chat.listingId} /> 
      <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{ _id: user._id }}
      renderBubble={renderBubble}
    />
   </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Choose a background color that fits your app's theme
  },
  listingImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontWeight: 'bold',
  },
  listingPrice: {
    fontSize: 16,
    color: '#666',
  },
  senderName: {
    paddingHorizontal: 10,
    paddingBottom: 2,
    fontSize: 12,
    color: 'grey',
    textAlign: 'left', // Align the sender's name to the left
  },
  bubbleOuterView: {
    //marginBottom: 6, // Adjust as needed
  },
  bubbleLeft: {
    backgroundColor: '#00fe2a',
  },
  bubbleRight: {
    backgroundColor: '#0078fe',
  },
  textLeft: {
    color: 'black',
  },
  textRight: {
    color: 'white',
  },
  timeText: {
    left: {
      color: 'grey',
    },
    right: {
      color: 'white',
    },
  },
});


export default ChatScreen;