import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { useMessagesBadgeCount } from '../MessagesBadgeCountContext';
import { getChats } from '../api/ChatRestService';
import { AuthContext } from '../AuthContext';

const MyMessages = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { resetMessagesBadgeCount } = useMessagesBadgeCount();
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const errorMessageTitle = "No Messages Found";
  const errorMessageDetails = "We're experiencing some problems on our end. Please try again later.";
  const emptyMessages = "Start contacting sellers and mange your messages here.";

  const fetchChats = async () => {
    try {
      const userId = user._id;
      let fetchedChats = await getChats(userId);

      if (!fetchedChats || fetchedChats.length === 0) {
        // Handle the case where there are no chats
        setError(emptyMessages);
        setChats([]); // Set chats to an empty array to indicate no chats
        return; 
      }
  
      // Filter out any chats that don't have messages
      fetchedChats = fetchedChats.filter(chat => chat.messages && chat.messages.length > 0);
  
      /*fetchedChats.forEach(chat => {
          console.log(`Chat ID: ${chat._id}`);
          chat.messages.forEach((message, index) => {
            console.log(`Message ${index + 1}: ${message.content}`);
          });
        });*/

      // Reset the error state in case of successful fetch
      setError(null);
      setChats(fetchedChats);
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } 
      setError(errorMessageDetails);
      console.error("Error fetching chats ", error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchChats(); // Fetch chats when the screen comes into focus
    }, [user._id])
  );

  useEffect(() => {
    // Reset message badge count when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      resetMessagesBadgeCount();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {error ? (
      // Display error message if error state is set
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    ) : (
      // Display the chat list if there's no error
    <FlatList
      data={chats}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => {
        // Check if there's at least one message in the array
        const lastMessage = item.messages[item.messages.length - 1];
        const lastMessageContent = lastMessage ? lastMessage.content : 'No messages';
        const lastMessageSenderName = lastMessage?.senderId?.userName ?? 'Unknown';
        const lastMessageTimestamp = lastMessage ? lastMessage.sentAt : new Date();
        const isLastMessageUnread = item.unreadCount > 0 && !item.lastMessageRead;
      
        return (
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { chat: item })}>
            <View style={styles.chatItem}>
              <Image source={{ uri: item.listingId.imageUrls[0] }} style={styles.image} />
              <View style={styles.contentContainer}>
                <Text style={styles.title}>
                {lastMessageSenderName} · {item.listingId.title.length > 30
                    ? item.listingId.title.substring(0, 30) + '...'
                    : item.listingId.title}
                </Text>
                <View style={styles.messageContainer}>
                <Text style={[styles.message, isLastMessageUnread && styles.boldMessage]}>
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
    )}
    </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8, // Rounded corners for the card
    padding: spacing.size10,
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size10, // Space between cards
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
  boldMessage: {
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20, // Add some horizontal padding for better readability
  },
});

export default MyMessages; 