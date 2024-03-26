import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
  const emptyMessages = "Chat history with sellers can be found here.";

  const fetchChats = async () => {
    if (!user) {
      console.error('User is null, cannot fetchChats');
      return; // Exit the function if there's no user
    }

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
    }, [user])
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
        const lastMessageSenderName = lastMessage?.senderId?.displayName ?? 'Unknown';
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

const { width } = Dimensions.get('window');
const imageSize = width * 0.1; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size10Horizontal,
  },
  chatItem: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: spacing.sm, // Rounded corners for the card
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    shadowColor: colors.shadowColor, // Shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size10Vertical,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize/2,
    marginRight: spacing.size10Horizontal,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
    fontSize: typography.body,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: typography.subHeading,
    color: colors.secondaryText,
  },
  timestamp: {
    fontSize: typography.caption,
    color: colors.darkGrey,
    marginLeft: spacing.size10Horizontal,
  },
  boldMessage: {
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: spacing.size20Vertical,
  },
  errorTitle: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  errorMessage: {
    fontSize: typography.subHeading,
    color: colors.secondaryText,
    marginTop: spacing.size10Vertical,
    textAlign: 'center',
    paddingHorizontal: spacing.size20Horizontal,
  },
});

export default MyMessages; 