import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeAppStack from './HomeAppStack';
import AuthStack from './AuthStack';

import { AuthProvider, AuthContext } from './AuthContext';

const Stack = createStackNavigator();

const AppStack = () => {
  const { user } = useContext(AuthContext);

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
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}


