import React, { useContext, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeAppStack from './HomeAppStack';
import AuthStack from './AuthStack';
import { LocationProvider } from '../components/LocationProvider';
import { ThemeProvider } from '../components/ThemeContext';
import { AuthContext } from '../AuthContext';
import { useMessagesBadgeCount } from '../MessagesBadgeCountContext';
import { AppState } from 'react-native';
import {fetchNotificationCount, updateNotificationCount} from '../api/ChatRestService';

const Stack = createStackNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);
  const { addMessagesBadgeCount, messagesBadgeCount, setMessagesBadgeCount } = useMessagesBadgeCount();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      try {
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
      Notifications.removeNotificationSubscription(subscription);
    };
  }, []);

  // useEffect for setting badge count when app loads/comes to active state
  useEffect(() => {
    if (user) {
      const updateBadgeCount = async () => {
        const count = await fetchNotificationCount(user._id);
        setMessagesBadgeCount(count);
      };
  
      updateBadgeCount();
  
      const appStateSubscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active') {
          updateBadgeCount();
        }
      });
  
      return () => {
        appStateSubscription.remove();
      };
    }
  }, [user, setMessagesBadgeCount]);

  const messagesBadgeCountRef = useRef(messagesBadgeCount);

  useEffect(() => {
    messagesBadgeCountRef.current = messagesBadgeCount;
  }, [messagesBadgeCount]);

  useEffect(() => {
    let lastAppState = AppState.currentState;

    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (user && lastAppState === 'active' && (nextAppState === 'background' || nextAppState === 'inactive')) {
        const currentBadgeCount = messagesBadgeCountRef.current; // Use the ref's current value
        updateNotificationCount(user._id, currentBadgeCount);
      }
      lastAppState = nextAppState;
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [user]);

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