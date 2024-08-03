import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, Modal, Switch, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GiftedChat, Bubble, Time, Message } from 'react-native-gifted-chat';
import { markMessagesAsRead, fetchLatestMessages } from '../api/ChatRestService';
import ChatService from '../api/ChatService';
import { AuthContext } from '../AuthContext';
import { reportUser } from '../api/AuthService';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import CustomActionSheet from '../components/CustomActionSheet'; 
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { Ionicons } from '@expo/vector-icons';


const ChatScreen = ({ route, navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { chat } = route.params; 
  const { user, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useHideBottomTab(navigation, true);

  const transformMessages = (messages) => {
    if (!user) {
      console.error('User is null, cannot transformMessages');
      return [];
    }
  
    // Deduplicate messages based on _id
    const uniqueMessages = messages.reduce((acc, current) => {
      if (!acc.find(item => item._id === current._id)) {
        acc.push(current);
      }
      return acc;
    }, []);
  
    // Transform messages to fit GiftedChat and handle dates
    const transformedMessages = uniqueMessages.map(message => ({
      _id: message._id,
      text: message.content,
      createdAt: message.sentAt ? new Date(message.sentAt) : new Date(),
      user: {
        _id: message.senderId ? (message.senderId._id || message.senderId) : 'Unknown',
        name: message.senderId ? (message.senderId.displayName || (message.senderId === user._id || message.senderId._id === user._id ? 'You' : 'Unknown')) : 'Unknown',
      },
    }));
  
    // Sort messages by createdAt in ascending order (oldest first)
    transformedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return transformedMessages;
  };  
  

  // Use the messages from the chat object to set the initial state
  // Transform them to fit GiftedChat's format
  const initialMessages = transformMessages(chat.messages || []);
  const [messages, setMessages] = useState(initialMessages);

  const ChatHeader = ({ listing }) => {  
    const [actionSheetVisible, setActionSheetVisible] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [blockUser, setBlockUser] = useState(false); // State to track the toggle switch
    const [isSubmitting, setIsSubmitting] = useState(false); // to disable submit report button

    if (!listing || !user) return null; // Return null if listing details aren't provided
  
    const navigateToListing = () => {
      navigation.navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { item: listing }
      });
    };

    const handleReportUser = () => {
      setActionSheetVisible(false);
      setReportModalVisible(true); // Open the report modal
    };

    const submitReport = async () => {
      setIsSubmitting(true);
      if (!reportReason || reportReason.trim() === '') {
        Alert.alert('Error', 'Please provide a reason for reporting.');
        setIsSubmitting(false);
        return;
      }

      try {
         // Determine the reported user based on the current user's role
        const currentUserId = user._id;
        const reportedUser = currentUserId === chat.sellerId._id ? chat.buyerId._id : chat.sellerId._id;

        const data = {
          reporterId: user._id, 
          reportedUserId: reportedUser, 
          reason: reportReason,
          blockUser: blockUser,
        };
    
        // Call the service to report the user
        await reportUser(data);
    
        Alert.alert('Report Submitted', 'Thank you for reporting this user, we will contact you on your registered email');
        setReportModalVisible(false);
        setReportReason(''); // Clear the input after submission
      } catch (error) {
        console.error('Error reporting user:', error);
        Alert.alert('Error', 'An error occurred while submitting the report. Please try again later.');
      } finally {
        setIsSubmitting(false); 
      }
    };
  
    // Define the options for the action sheet
    const actionSheetOptions = [
      {
        text: 'Report User',
        icon: 'flag-outline',
        onPress: () => {
          handleReportUser();
        },
      },
      {
        text: 'Cancel',
        icon: 'close-outline',
        onPress: () => {
          setActionSheetVisible(false);
        },
      },
    ];

    // Dynamically set the button title
   let reportButtonTitle = isSubmitting ? "Processing..." : "Submit Report";
  
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToListing}>
          <View style={styles.listingInfo}>
            <Image source={{ uri: listing.imageUrls[0] }} style={styles.listingImage} />
            <View style={styles.listingDetails}>
                <Text style={[styles.listingTitle, { maxWidth: '80%' }]} numberOfLines={1} ellipsizeMode="tail">
                {listing.title}
                {listing.state && listing.state.toLowerCase() === 'sold' ? ' (Sold)' : ''}
              </Text>
              <Text style={styles.listingPrice}> 
                {listing.price === 0 ? 'FREE' : `$${listing.price.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => setActionSheetVisible(true)} style={styles.ellipsisButton}>
          <Ionicons name="ellipsis-horizontal" size={typography.iconSize} color={colors.darkGrey} />
        </TouchableOpacity>

        <CustomActionSheet
          isVisible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          options={actionSheetOptions}
        />

        {/* Report User Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={reportModalVisible}
          onRequestClose={() => setReportModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.closeIcon}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Report User</Text>
              <Text style={styles.modalDescription}>
                Please let us know why you are reporting this user.
              </Text>
              <InputComponent
                style={styles.textInput}
                placeholder="Enter your reason"
                value={reportReason}
                onChangeText={setReportReason}
                multiline
                textAlignVertical="top"
              />
              <View style={styles.toggleContainer}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>Block this user?</Text>
                  <Switch
                    value={blockUser}
                    onValueChange={setBlockUser}
                    thumbColor={blockUser ? '#f77979' : '#ccc'}
                    trackColor={{ false: '#767577', true: '#f77979' }}
                  />
                </View>
                <Text style={styles.toggleDescription}>You won't be able to receive message from this user</Text>
              </View>
              <ButtonComponent 
                title={reportButtonTitle}
                type="secondary"
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={() => {
                  submitReport();
                }}
                style={{ width: '100%', flexDirection: 'row' }}
              />
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  };

  const renderBubble = (props) => {
    if (!user) {
      console.error('User is null, cannot renderBubble');
      return; // Exit the function if there's no user
    }

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
    ChatService.initializeSocket();
  
    // Join the chat room
    ChatService.socket.emit('joinRoom', chat._id);
  
    const handleNewMessages = (data) => {
      const { messages, senderId } = data;
    
      if (senderId !== user._id) {
        // Transform the entire set of messages received from the server
        const transformedMessages = transformMessages(messages);
    
        // Sort messages by createdAt in ascending order (oldest first)
        transformedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        // Update state directly with the transformed and sorted messages
        setMessages(transformedMessages);
      }
    };
  
    // Listen for new messages
    ChatService.socket.on('messageRcvd', handleNewMessages);
  
    // Cleanup function to leave the room and remove the event listener
    return () => {
      // Emit an event to leave the room when the component unmounts or chat changes
      ChatService.socket.emit('leaveRoom', chat._id);
  
      // Remove the message listener
      ChatService.socket.off('messageRcvd', handleNewMessages);
      ChatService.turnOffSockets();
    };
  }, [chat]); // Depend on `chat` to re-run this effect if the chat changes


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        if (user) {
          // Call the function to mark messages as read
          await markMessagesAsRead(chat._id, user._id);
          // Fetch the latest messages from the server
          const latestMessages = await fetchLatestMessages(chat._id);
          const transformedMessages = transformMessages(latestMessages);
          setMessages(transformedMessages);
        }
      } catch (error) {
        if (error.message.includes('RefreshTokenExpired')) {
          await logout();
        } else {
          console.error(`Error marking messages as read for chat ${chat._id}`, error);
        }
      }
    });
  
    return unsubscribe;
  }, [navigation, user, chat]);


  const onSend = (newMessages = []) => {
    if(chat.isSystemMessage) {
      Alert.alert('Error', 'Cannot reply to system generated message');
      return;
    }
    if(user) {
      newMessages.forEach((message) => {
        const createMessageDTO = {
          senderId: user._id,
          content: message.text,
          sentAt: message.createdAt
        };
        ChatService.sendMessage(createMessageDTO, chat._id);
      });
    }
    // Update the local state with the new message so it renders immediately
    setMessages(previousMessages => {
      const newUniqueMessages = newMessages.filter(newMsg => 
        !previousMessages.some(prevMsg => prevMsg._id === newMsg._id)
      );
      return GiftedChat.append(previousMessages, newUniqueMessages);
    });
  };

  const onMessagePress = (message) => {
    if (chat.isSystemMessage && chat.listingId) {
      // If the chat is a special system message, navigate to RatingForSellerScreen
      navigation.navigate('RatingForSellerScreen', { listing: chat.listingId,  buyerId: chat.buyerId});
    }
  };

  const renderMessage = (messageProps) => {
    return (
      <Message
        {...messageProps}
        onPress={() => onMessagePress(messageProps.currentMessage)}
      />
    );
  };


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {user && (
        <>
          <ChatHeader listing={chat.listingId} />
          <GiftedChat
            messages={messages}
            onSend={(newMessages) => onSend(newMessages)}
            user={{ _id: user._id }}
            renderBubble={renderBubble}
            renderMessage={renderMessage} 
          />
        </>
      )}
      {!user && (
        // Optionally, render a placeholder or a message indicating that the user needs to be logged in
        <Text>Please log in to view the chat.</Text>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.12; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space out the ellipsis icon
    paddingHorizontal: spacing.size10Horizontal, // Only apply padding horizontally
    paddingVertical: spacing.size10Vertical,    // Adjust vertical padding to reduce space
    borderBottomWidth: 2, // This sets the thickness of the bottom border
    borderBottomColor: colors.separatorColor, 
  },
  listingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize/2,
    marginRight: spacing.size10Horizontal,
  },
  listingDetails: {
    marginLeft: 10,
    flexShrink: 1, 
  },
  listingTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
    whiteSpace: 'nowrap', // Ensure text does not wrap to a new line
    textOverflow: 'ellipsis',
  },
  listingPrice: {
    fontSize: typography.body,
    color: colors.secondaryText,
  },
  ellipsisButton: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.size10Horizontal,
    fontSize: typography.body,
    marginBottom: spacing.size20Vertical, 
    textAlignVertical: 'top',
    height: 100
  },
  closeIcon: {
    position: 'absolute',
    top: spacing.size10Vertical,
    right: 10,
    zIndex: 1,
  },
  toggleContainer: {
    flexDirection: 'column',  // Change to column to stack label and description
    alignItems: 'flex-start', // Align items to the start
    width: '100%',
    marginBottom: spacing.sizeLarge, 
  },
  toggleTextContainer: {
    flexDirection: 'row', // Arrange label and switch in a row
    alignItems: 'center', // Align vertically centered
    justifyContent: 'space-between', // Space between label and switch
    width: '100%', // Ensure full width
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Allow label to take remaining space
  },
  toggleDescription: {
    fontSize: 12,
    color: '#888',
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