import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getChats = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
          const chats = await response.json();
          return chats;
        } else if (response.status === 404) {
          // no chats not found, return null or a specific message
          return null;
        } else {
          const errorData = await response.json();
          console.error('Error fetching chats:', errorData);
          throw new Error(errorData.message || 'Error fetching chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        return null;
      }
  };

  export const createOrGetChat = async (createChatDTO) => {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createChatDTO),
      });
  
      if (response.ok) {
        const chat = await response.json();
        return chat; // The newly created or fetched chat object
      } else {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        console.error('Error creating or fetching chat:', errorData);
        throw new Error(errorData.message || 'Error creating or fetching chat');
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error('Error creating or fetching chat:', error);
      throw error; // Re-throw to allow further handling in the calling code
    }
  };

  // To send create a message and send notification to buyer to rate the seller.
  export const createSystemChat = async (buyerId, listingId) => {
    const token = await SecureStore.getItemAsync('token');
  
    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/create-system-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buyerId, listingId }),
      });
  
      if (response.ok) {
        const chat = await response.json();
        return chat;
      } else {
        // TODO do retry in case of failure and dont surface it to the seller. Do not throw errro here.
        const errorData = await response.json();
        console.error('Error creating system chat:', errorData);
        throw new Error(errorData.message || 'Error creating system chat');
      }
    } catch (error) {
      console.error('Error creating system chat:', error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  export const markMessagesAsRead = async (chatId, userId) => {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/markAsRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },        
        body: JSON.stringify({ chatId: chatId, userId: userId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to mark messages as read:', errorData);
        throw new Error('Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  };

  export const fetchNotificationCount = async (userId) => {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/${userId}/notificationCount`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notification count');
      }
      const data = await response.json();
      return data;
      //return data.count; // Assuming the backend returns an object with a 'count' property
    } catch (error) {
      console.error('Error fetching notification count:', error);
      return 0; // Return 0 as a fallback
    }
}

export const updateNotificationCount = async (userId, count) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/${userId}/updateNotificationCount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, count }),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification count');
    }
  } catch (error) {
    console.error('Error updating notification count:', error);
  }
}

// Get the buyer details based on the chats for the given listing
export const getBuyerInfoByListingId = async (listingId, sellerId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/chat/buyer-info/${listingId}/${sellerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      const buyerInfo = await response.json();
      return buyerInfo;
    } else if (response.status === 404) {
      // No buyer information found, return null or a specific message
      return null;
    } else {
      const errorData = await response.json();
      console.error('Error fetching buyer information:', errorData);
      throw new Error(errorData.message || 'Error fetching buyer information');
    }
  } catch (error) {
    console.error('Error fetching buyer information:', error);
    return null;
  }
};


  