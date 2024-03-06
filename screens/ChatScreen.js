import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import ChatService from '../api/ChatService';
import { AuthContext } from '../AuthContext';

const ChatScreen = ({ route, navigation }) => {
  const { chat } = route.params; // Extract chat from route.params
  const { user } = useContext(AuthContext);

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

  const [messages, setMessages] = useState(transformMessages(chat && chat.messages ? chat.messages : []));

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
    const handleNewMessages = (newMessages) => {
      setMessages(previousMessages => {
        // Transform and deduplicate new messages
        const transformedNewMessages = transformMessages(newMessages);
    
        // Combine new and old messages
        const combinedMessages = [...previousMessages, ...transformedNewMessages];
    
        // Deduplicate combined messages
        const uniqueIds = Array.from(new Set(combinedMessages.map(message => message._id)));
        const uniqueCombinedMessages = uniqueIds.map(id => combinedMessages.find(message => message._id === id));
    
        // Sort messages by createdAt in ascending order (optional, if needed)
        uniqueCombinedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        return uniqueCombinedMessages;
      });
    };

    ChatService.socket.on('chat', handleNewMessages);

    // Cleanup function to remove the event listener
    return () => {
      ChatService.socket.off('chat', handleNewMessages);
    };
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  
    newMessages.forEach((message) => {
      const createMessageDTO = {
        senderId: user._id,
        content: message.text,
        sentAt: message.createdAt
      };
      ChatService.sendMessage(createMessageDTO, chat._id);
    });
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