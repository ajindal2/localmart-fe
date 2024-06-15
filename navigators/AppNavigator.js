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
import * as Linking from 'expo-linking';
import { createNavigationContainerRef } from '@react-navigation/native';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();
const prefix = Linking.createURL('/');

const AppStack = () => {
  //const navigationRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { addMessagesBadgeCount, messagesBadgeCount, setMessagesBadgeCount } = useMessagesBadgeCount();

  const linking = {
    prefixes: [Linking.createURL('/'), 'farmvox://', 'https://farmvox.com/'],
    config: {
      screens: {
        HomeApp: {
          screens: {
            Home: {
              screens: {
                HomeScreen: 'home',
                ViewListingStack: {
                  screens: {
                    ViewListing: 'listing/view/:listingId',
                  },
                },
              },
            },
          },
        },
        Auth: 'auth',
      },
    },
  };

  // To handle in-app notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      try {
        const notificationData = notification.data || notification.request.content.data || notification.request.trigger?.remoteMessage?.data;    
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

  // For setting badge count when app loads/comes to active state
  useEffect(() => {
    try {
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
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } 
      setMessagesBadgeCount(0);
    }
  }, [user, setMessagesBadgeCount]);

  const messagesBadgeCountRef = useRef(messagesBadgeCount);

  useEffect(() => {
    messagesBadgeCountRef.current = messagesBadgeCount;
  }, [messagesBadgeCount]);

  // For updating badge count on server when app is in background
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

  // Logic to handle a push notification click such that user lands on MyMessages page
  /*useEffect(() => {
    const handleNotificationResponse = (response) => {
      if (response) {
        console.log("Inside handleNotificationResponse");
        navigate('MyMessages', {});
      }
    };

    // Check for the notification that opened the app
    Notifications.getLastNotificationResponseAsync().then(response => {
      handleNotificationResponse(response);
    });

    // Listen for new notification interactions
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response);
    });

    return () => subscription.remove(); // Clean up the listener
  }, []);*/

  return (
    <NavigationContainer ref={navigationRef} linking={linking} fallback={<Text>Loading...</Text>}>
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

const navigate = (name, params) => {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.navigate(name, params);
  } else {
    console.log('Navigation reference is not ready');
  }
};