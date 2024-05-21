import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateNewListingScreen from '../screens/CreateNewListingScreen';
import ListingLocationPreferenceScreen from '../screens/ListingLocationPreferenceScreen';

const ListingStack = createStackNavigator();

function CreateListingStackNavigator() {
  return (
    <ListingStack.Navigator>
      <ListingStack.Screen
        name="CreateNewListingScreen"
        component={CreateNewListingScreen}
        options={{ 
          headerShown: true,
          title: 'Create listing',
          headerBackTitleVisible: false, // This hides the back title on iOS  
        }} 
      />
      <ListingStack.Screen
        name="ListingLocationPreferenceScreen"
        component={ListingLocationPreferenceScreen}
        options={{ 
          headerShown: true,
          title: 'Set a location',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }} 
      />
    </ListingStack.Navigator>
  );
}

export default CreateListingStackNavigator;
