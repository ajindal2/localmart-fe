import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
  }

  initializeSocket() {
    this.socket = io(process.env.API_URL, {
      //transports: ['websocket'], // Uncomment if you want to force WebSocket transport
    });

    this.socket.on('connect', () => {});
    this.socket.on('disconnect', () => {});
    this.socket.on('connect_error', (error) => console.error('Connection error:', error));
  }

  turnOffSockets() {
    if (this.socket) {
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('connect_error');
      this.socket.off('error');

      this.socket.disconnect();
    }
  }

  // Not in use
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect(() => {});
    }
  }

  // Not in use. Using RestService instead
  createChat(createChatDTO) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not initialized');
        return;
      }

      this.socket.emit('createChat', createChatDTO);

      // Listen for 'chatCreated' event from the server
      this.socket.once('chatCreated', (chat) => {
        resolve(chat);
      });

      // Listen for 'error' event from the server
      this.socket.once('error', (error) => {
        console.error('Error creating chat:', error);
        reject(error);
      });
    });
  }

  sendMessage(createMessageDTO, chatId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        console.error(`Socket not initialized for chatId ${chatId}`);
        reject('Socket not initialized');
        return;
      }
      this.socket.emit('chat', { createMessageDTO, chatId });

      // Listen for 'error' event from the server
      this.socket.once('error', (error) => {
        console.error(`Error sending message for chat ${chatId}`, error);
        reject(error);
      });
    });
  }

  // Not in use. Using RestService instead
  getChats(userId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not initialized');
        return;
      }

      // Emit 'getChats' event with userId
      this.socket.emit('getChats', userId);

      // Listen for 'chatsToClient' event for response
      this.socket.once('chatsToClient', (chats) => {
        resolve(chats);
      });

      // Listen for 'error' event from the server
      this.socket.once('error', (error) => {
        console.error('Error fetching chats:', error);
        reject(error);
      });
    });
  }

  // Not in use at all
  getChat(chatId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not initialized');
        return;
      }
  
      // Emit 'getChat' event with chatId
      this.socket.emit('getChat', chatId);
  
      // Listen for 'chatToClient' event for response
      this.socket.once('chatToClient', (chat) => {
        resolve(chat);
      });
  
      // Listen for 'error' event from the server
      this.socket.once('error', (error) => {
        console.error('Error fetching chat:', error);
        reject(error);
      });
    });
  }
}

export default new ChatService();
