import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateNewListingScreen from './screens/CreateNewListingScreen';
import ListingLocationPreferenceScreen from './screens/ListingLocationPreferenceScreen';

const ListingStack = createStackNavigator();

function ListingStackNavigator() {
  return (
    <ListingStack.Navigator>
      <ListingStack.Screen
        name="CreateNewListingScreen"
        component={CreateNewListingScreen}
        options={{ headerShown: true }} // Adjust as needed
      />
      <ListingStack.Screen
        name="ListingLocationPreferenceScreen"
        component={ListingLocationPreferenceScreen}
        options={{ headerShown: true }} // Adjust as needed
      />
    </ListingStack.Navigator>
  );
}

export default ListingStackNavigator;
