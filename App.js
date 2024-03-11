import React from 'react';
import AppNavigator from './navigators/AppNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './AuthContext';
import { UnreadMessagesProvider } from './UnreadMessagesContext';

const App = () => {
  return (
    <UnreadMessagesProvider>
    <AuthProvider>
      <>
        <AppNavigator />
        <Toast />
      </>
    </AuthProvider>
    </UnreadMessagesProvider>
  );
}

export default App;