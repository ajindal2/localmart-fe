export const getChats = async (userId) => {
    try {
      const response = await fetch(`http://192.168.86.24:3000/chat/${userId}`);
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
    try {
      const response = await fetch('http://192.168.86.24:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  export const markMessagesAsRead = async (chatId, userId) => {
    try {
      const response = await fetch('http://192.168.86.24:3000/chat/markAsRead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId, userId: userId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  export const fetchNotificationCount = async (userId) => {
    try {
      const response = await fetch(`http://192.168.86.24:3000/chat/${userId}/notificationCount`);
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
  try {
    const response = await fetch(`http://192.168.86.24:3000/chat/${userId}/updateNotificationCount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, count }),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification count');
    }
    console.log('Notification count updated successfully');
  } catch (error) {
    console.error('Error updating notification count:', error);
  }
}

  