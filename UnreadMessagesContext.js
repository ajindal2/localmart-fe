import React, { createContext, useState, useContext } from 'react';

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const addUnreadMessage = () => setUnreadCount((prevCount) => prevCount + 1);
  const resetUnreadMessages = () => setUnreadCount(0);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, addUnreadMessage, resetUnreadMessages }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);
