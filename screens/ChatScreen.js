import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import {markMessagesAsRead} from '../api/ChatRestService';
import ChatService from '../api/ChatService';
import { AuthContext } from '../AuthContext';
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';


const ChatScreen = ({ route, navigation }) => {
  const { chat } = route.params; // Extract chat from route.params
  const { user, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

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
        if (error.message.includes('RefreshTokenExpired')) {
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

const { width } = Dimensions.get('window');
const imageSize = width * 0.12; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    //backgroundColor: colors.mediumGrey , 
    borderBottomWidth: 2, // This sets the thickness of the bottom border
    borderBottomColor: colors.separatorColor, 
  },
  listingImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize/2,
    marginRight: spacing.size10Horizontal,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontWeight: 'bold',
  },
  listingPrice: {
    fontSize: typography.body,
    color: colors.secondaryText,
  },
  senderName: {
    paddingHorizontal: spacing.size10Horizontal,
    paddingBottom: spacing.xxs,
    fontSize: typography.caption,
    color: colors.darkGrey,
    textAlign: 'left', // Align the sender's name to the left
  },
  bubbleOuterView: {
  },
  bubbleLeft: {
    backgroundColor: colors.mediumGrey,
  },
  bubbleRight: {
    backgroundColor: colors.primary,
  },
  textLeft: {
    color: 'black',
  },
  textRight: {
    color: colors.white,
  },
  timeText: {
    left: {
      color: colors.darkGrey,
    },
    right: {
      color: colors.white,
    },
  },
});


export default ChatScreen;