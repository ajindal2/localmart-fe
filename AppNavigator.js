import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeAppStack from './HomeAppStack';
import AuthStack from './AuthStack';

import { AuthProvider, AuthContext } from './AuthContext';
//import { Linking } from 'react-native';
import * as Linking from 'expo-linking';


const prefix = Linking.makeUrl('/');

const Stack = createStackNavigator();

// TODO Setup deep linking
const linking = {
  //prefixes: ['https://www.localmart.com', 'localmart://'],
  prefixes:[prefix],
  config: {
    screens: {
      HomeApp: {
        screens: {
          MyMessages: 'messages',
        }
      }
     
     // HomeScreen: 'home',
     // ViewListing: 'listing/:listingId',
    },
  },
};

const AppStack = () => {
  const { user } = useContext(AuthContext);

return (
  <NavigationContainer linking={linking}>
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
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}


