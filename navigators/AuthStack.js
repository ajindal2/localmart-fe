import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TermsScreen from '../screens/account/TermsScreen';
import PrivacyPolicyScreen from '../screens/account/PrivacyPolicyScreen';


const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ 
        headerShown: true,
        title: 'Reset Password',
        headerBackTitle: '', 
      }} />
      <Stack.Screen name="TermsScreen" component={TermsScreen} options={{ 
        headerShown: true,
        title: 'Terms of Service',
        headerBackTitle: '', 
      }} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ 
        headerShown: true,
        title: 'Privacy Policy',
        headerBackTitle: '', 
      }} />
    </Stack.Navigator>
  );
}

export default AuthStack;


