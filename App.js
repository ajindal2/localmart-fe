import React from 'react';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigators/AppNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './AuthContext';
import { MessagesBadgeCountProvider } from './MessagesBadgeCountContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import overrideConsoleMethods from './consoleOverrides';


Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

overrideConsoleMethods(); // Logging override for Sentry
enableScreens(); // Enable screens before rendering the app

const App = () => {
  return (
    //<StatusBar hidden={false} style="dark" translucent={true} >
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
   // </StatusBar>
  );
}

export default Sentry.wrap(App);