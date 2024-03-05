import React, { useState, useEffect, useContext } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import ChatService from '../api/ChatService';
import { AuthContext } from '../AuthContext';

const ChatScreen = ({ route }) => {
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
          _id: message.senderId,
          name: message.senderId === user._id ? 'You' : 'Seller',
        },
      };
    });
  
    // Sort messages by createdAt in ascending order (oldest first)
    transformedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    return transformedMessages;
  };

  const [messages, setMessages] = useState(transformMessages(chat && chat.messages ? chat.messages : []));

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
    <GiftedChat
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: user._id,
      }}
    />
  );
};

export default ChatScreen;