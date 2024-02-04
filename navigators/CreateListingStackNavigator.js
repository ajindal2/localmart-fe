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
          title: 'Create listing' 
        }} 
      />
      <ListingStack.Screen
        name="ListingLocationPreferenceScreen"
        component={ListingLocationPreferenceScreen}
        options={{ 
          headerShown: true,
          title: 'Set a location' 
        }} 
      />
    </ListingStack.Navigator>
  );
}

export default CreateListingStackNavigator;
