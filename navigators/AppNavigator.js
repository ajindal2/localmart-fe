import React, { useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeAppStack from './HomeAppStack';
import AuthStack from './AuthStack';
import { LocationProvider } from '../components/LocationProvider';
import { ThemeProvider } from '../components/ThemeContext';
import { AuthContext } from '../AuthContext';
import { useMessagesBadgeCount } from '../MessagesBadgeCountContext';

const Stack = createStackNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);
  const { addMessagesBadgeCount } = useMessagesBadgeCount();

  useEffect(() => {
    // Existing setup for notification listeners...
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      try {

        /*console.log('Received in-app notification:', notification);

        const replacer = (key, value) => {
          // Prevent circular references
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      
        const seen = new WeakSet(); // To track seen objects and avoid circular references
        console.log('Received in-app notification:', JSON.stringify(notification, replacer, 2));*/
      
        const notificationData = notification.data || notification.request.content.data || notification.request.trigger?.remoteMessage?.data;
        console.log('notificationData is: ', notificationData);
    
        if (notificationData && notificationData.type === 'NEW_MESSAGE') {
          addMessagesBadgeCount(); // Increment the unread message count
        }
      } catch (error) {
        console.error('Error handling in-app notification:', error);
      }
    });

    return () => {
      // Cleanup
      Notifications.removeNotificationSubscription(subscription);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="HomeApp" component={HomeAppStack} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default function AppNavigator() {
  return (
    <LocationProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </LocationProvider>
  );
}