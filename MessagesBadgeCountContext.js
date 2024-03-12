import React, { createContext, useState, useContext } from 'react';

const MessagesBadgeCountContext = createContext();

export const MessagesBadgeCountProvider = ({ children }) => {
  const [messagesBadgeCount, setMessagesBadgeCount] = useState(0);

  const addMessagesBadgeCount = () => setMessagesBadgeCount((prevCount) => prevCount + 1);
  const resetMessagesBadgeCount = () => setMessagesBadgeCount(0);

  return (
    <MessagesBadgeCountContext.Provider value={{ messagesBadgeCount, setMessagesBadgeCount, addMessagesBadgeCount, resetMessagesBadgeCount }}>
      {children}
    </MessagesBadgeCountContext.Provider>
  );
};

export const useMessagesBadgeCount = () => useContext(MessagesBadgeCountContext);
