import React from 'react';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigators/AppNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './AuthContext';
import { MessagesBadgeCountProvider } from './MessagesBadgeCountContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';


enableScreens(); // Enable screens before rendering the app

const App = () => {
  return (
    <SafeAreaProvider>
      <MessagesBadgeCountProvider>
        <AuthProvider>
          <>
            <AppNavigator />
            <Toast />
          </>
        </AuthProvider>
      </MessagesBadgeCountProvider>
    </SafeAreaProvider>
  );
}

export default App;