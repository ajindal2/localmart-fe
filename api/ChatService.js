import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
  }

  initializeSocket() {
    this.socket = io("http://192.168.86.24:3000", {
      //transports: ['websocket'], // Uncomment if you want to force WebSocket transport
    });

    this.socket.on('connect', () => console.log('Connected to server'));
    this.socket.on('disconnect', () => console.log('Disconnected from server'));
    this.socket.on('connect_error', (error) => console.log('Connection error:', error));
    // Add more event listeners as needed
  }

  createChat(createChatDTO) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        console.log('Socket not initialized');
        reject('Socket not initialized');
        return;
      }


      /*this.socket.emit("createChat", createChatDTO, (response) => {
        // Handle the response here
        if (response.error) {
          console.error('Error creating chat:', response.error);
          reject(response.error);
        } else {
          resolve(response); // Assuming the server sends back some sort of success response
        }
      });*/

      this.socket.emit('createChat', createChatDTO);
      // Listen for 'chatCreated' event from the server
      // TODO do I need to close 'chatCreated' also at disconnect?
      this.socket.once('chatCreated', (chat) => {
        console.log('Chat created:', chat);
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
        console.log('Received chats:', chats);
        resolve(chats);
      });

      // Listen for 'error' event from the server
      this.socket.once('error', (error) => {
        console.error('Error fetching chats:', error);
        reject(error);
      });
    });
  }

  disconnectSocket() {
    if (this.socket) {
        this.socket.off('connect');
        this.socket.off('disconnect');
        this.socket.off('connect_error');
        //this.socket.off('chatCreated');
        this.socket.off('error');
        // Add any other event listeners you need to remove here
    
        // Disconnect the socket
        this.socket.disconnect();
    }
  }
}

export default new ChatService();
