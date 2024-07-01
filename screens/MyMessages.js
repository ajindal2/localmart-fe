import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { useMessagesBadgeCount } from '../MessagesBadgeCountContext';
import { getChats } from '../api/ChatRestService';
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { DEFAULT_LISTING_IMAGE_URI } from '../constants/AppConstants'


const MyMessages = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
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

      // Sort chats by the most recent message's sentAt field in descending order
      fetchedChats.sort((a, b) => {
        // Get the last message's sentAt for each chat
        const lastMessageA = a.messages[a.messages.length - 1].sentAt;
        const lastMessageB = b.messages[b.messages.length - 1].sentAt;

        // Convert sentAt to Date objects if they're not already
        const dateA = new Date(lastMessageA);
        const dateB = new Date(lastMessageB);

        // Return the comparison result
        return dateB - dateA; // For descending order; use dateA - dateB for ascending order
      });

      // Reset the error state in case of successful fetch
      setError(null);
      setChats(fetchedChats);
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } 
      setError(errorMessageDetails);
      console.error(`Error fetching chats for ${userId}`, error);
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const diff = now - messageDate;
  
    const withinOneDay = diff < oneDay;
    const withinOneYear = now.getFullYear() === messageDate.getFullYear();
  
    if (withinOneDay) {
      // Use 'hour', 'minute' to show the time for messages within the last 24 hours
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (!withinOneYear) {
      // Use 'year', 'month', 'day' to format as MM/DD/YYYY for dates older than one year
      return messageDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    } else {
      // Show only month and day for dates that are within the past year but older than a week
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }); // 'short' for abbreviated month
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


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

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
        let lastMessageSenderName = 'Unknown'; // Default value;
        // Ensure user is not null
        if (!user) {
          lastMessageSenderName = lastMessage?.senderId?.displayName ?? 'Unknown';
        } else {
          // Determine the other party in the chat
          const otherParty = item.sellerId._id === user._id ? item.buyerId : item.sellerId;
          lastMessageSenderName = otherParty.displayName ?? 'Unknown'; 
        }
        const lastMessageTimestamp = lastMessage ? lastMessage.sentAt : new Date();
        const isLastMessageUnread = item.unreadCount > 0 && !item.lastMessageRead;
      
        return (
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { chat: item })}>
            <View style={styles.chatItem}>
              <Image source={
                item.listingId && item.listingId.imageUrls && item.listingId.imageUrls.length > 0
                  ? { uri: item.listingId.imageUrls[0] }
                  : DEFAULT_LISTING_IMAGE_URI // Fallback image if no URL is available
                }  
                style={styles.image} 
              />
              <View style={styles.contentContainer}>
              <Text style={[styles.title, isLastMessageUnread && styles.boldMessage]}>
                {lastMessageSenderName} · 
                {item.listingId && item.listingId.title
                  ? (item.listingId.title.length > 30
                      ? item.listingId.title.substring(0, 30) + '...'
                      : item.listingId.title)
                  : 'Listing does not exist'}
              </Text>
                <View style={styles.messageContainer}>
                <Text style={[styles.message, isLastMessageUnread && styles.boldMessage]}>
                    {lastMessageContent.length > 50
                      ? lastMessageContent.substring(0, 50) + '...'
                      : lastMessageContent}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatDate(lastMessageTimestamp)}
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
    //fontWeight: 'bold',
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