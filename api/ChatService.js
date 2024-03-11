import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
  }

  initializeSocket() {
    console.log('Inside initializeSocket');
    this.socket = io("http://192.168.86.24:3000", {
      //transports: ['websocket'], // Uncomment if you want to force WebSocket transport
    });

    this.socket.on('connect', () => console.log('Connected to server'));
    this.socket.on('disconnect', () => console.log('Disconnected from server'));
    this.socket.on('connect_error', (error) => console.log('Connection error:', error));
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

  disconnectSocket() {
    console.log('Inside disconnectSocket');
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect(() => {
        console.log('Disconnect callback: Socket has been disconnected');
      });
    }
  }

  /*
  disconnectSocket() {
  if (this.socket) {
    console.log('Disconnecting socket');

    // Listen for the 'disconnect' event to confirm disconnection
    this.socket.once('disconnect', () => {
      console.log('Socket has been disconnected');
      this.turnOffSockets(); // Call turnOffSockets() after disconnection is confirmed
    });

    this.socket.disconnect();
  }
  }
  */

  disconnectCreateChatSockets() {
    if (this.socket) {
      this.socket.off('chatCreated');
      this.socket.off('error');
    }
  }

  disconnectSendMessageSockets() {
    if (this.socket) {
      this.socket.off('error');
    }
  }

  disconnectGetChatSockets() {
    if (this.socket) {
      this.socket.off('chatsToClient');
      this.socket.off('error');
    }
  }

  createChat(createChatDTO) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        console.log('Socket not initialized');
        reject('Socket not initialized');
        return;
      }

      this.socket.emit('createChat', createChatDTO);

      // Listen for 'chatCreated' event from the server
      // TODO do I need to close 'chatCreated' also at disconnect?
      this.socket.once('chatCreated', (chat) => {
        //console.log('Chat created:', chat);
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
          console.log('Socket not initialized');
          reject('Socket not initialized');
          return;
        }
        this.socket.emit('chat', { createMessageDTO, chatId });
  
        // Listen for 'error' event from the server
        this.socket.once('error', (error) => {
          console.error('Error sending message:', error);
          reject(error);
        });
      });
  }

  getChats(userId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        console.log('Socket not initialized');
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

  getChat(chatId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        console.log('Socket not initialized');
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
