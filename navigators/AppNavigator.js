import React, { useContext, useEffect, useRef, useState } from 'react';
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

const AppStack = () => {
  const { user } = useContext(AuthContext);
  const { addMessagesBadgeCount, messagesBadgeCount, setMessagesBadgeCount } = useMessagesBadgeCount();

  /*const linking = {
    prefixes: ['exp://', 'localmart://', 'https://www.localmart.com'], // Include all the URL prefixes your app can handle.
    config: {
      screens: {
        HomeApp: { // This corresponds to the <Stack.Screen name="HomeApp" component={HomeAppStack} />
          screens: {
            Account: {
              screens: {
                AccountScreen: 'account',
              },
            },
            Home: { // This matches the name of the Tab.Screen for the HomeStackNavigator within HomeAppStack
              screens: {
                HomeScreen: 'home', // This is for deep linking to the HomeScreen within the HomeStackNavigator
                ViewListingStack: { // Assuming ViewListingStack is a stack navigator you want to deep link into
                  path: 'listing',
                  screens: {
                    ViewListing: 'view/:listingId', // Specify the path for deep linking to a specific listing. Adjust the screen name as necessary.
                  }
                },
                // Include other screens within HomeStackNavigator if you want them to be deep linkable.
              },
            },
            // Include other Tab.Screens from HomeAppStack if you want them to be deep linkable.
          },
        },
        // Include Auth if you want it to be deep linkable, but it's often not needed for auth flows.
      },
    },
  };*/

  const linking = {
    prefixes: ['exp://', 'localmart://', 'https://www.localmart.com'], // Include all the URL prefixes your app can handle.
    config: {
      screens: {
        HomeApp: {
          screens: {
            Home: {
              screens: {
                HomeScreen: 'home',
                ViewListingStack: {
                  screens: {
                    ViewListing: 'listing/view/:id',
                    SellerDetails: 'listing/view/:id/seller',
                    AllReviewsScreen: 'listing/view/:id/reviews',
                    ChatScreen: 'listing/view/:id/chat',
                  },
                },
                SearchLocationPreferenceScreen: 'search-location',
              },
            },
            // Add other tabs here
          },
        },
        Auth: 'auth',
      },
    },
  };
  

  const handleDeepLink = (event) => {
    let { path, queryParams } = Linking.parse(event.url);
    // Example: if your URL is 'exp://192.168.0.1:19000/listing/view/123'
    // path might be '/listing/view/123'
  
    // You can split the path and decide where to navigate
    const route = path.split('/')[0]; // 'listing'
    const action = path.split('/')[1]; // 'view'
    const id = path.split('/')[2]; // '123'

    console.log(route, action, id);
  
    if (route === 'listing' && action === 'view' && id) {
      // TODO to enable navigattion like this, add ref={navigationRef} to navigationCOntainer. 
      // Downside of this is that the app needs to b open to navigate to teh correct page. If app is not open, clicking link lands on home page.
      // But atleast it is wokring. Linking startegy is not wokring ata ll.
      navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { listingId: id }
      });
    }
  };

  // Add a listener for deep link events
  /*useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);

    return () => Linking.removeEventListener('url', handleDeepLink);
  }, []);*/


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

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
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

function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}