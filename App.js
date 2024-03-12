import React from 'react';
import AppNavigator from './navigators/AppNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './AuthContext';
import { MessagesBadgeCountProvider } from './MessagesBadgeCountContext';

const App = () => {
  return (
    <MessagesBadgeCountProvider>
    <AuthProvider>
      <>
        <AppNavigator />
        <Toast />
      </>
    </AuthProvider>
    </MessagesBadgeCountProvider>
  );
}

export default App;