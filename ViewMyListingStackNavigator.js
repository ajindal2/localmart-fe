import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListingStackNavigator from './ListingStackNavigator';
import ViewMyListingScreen from './screens/account/ViewMyListingScreen';

const ViewMyListingStack = createStackNavigator();

function ViewMyListingStackNavigator() {
  return (
    <ViewMyListingStack.Navigator>
      <ViewMyListingStack.Screen
        name="ViewMyListingScreen"
        component={ViewMyListingScreen}
        options={{ 
          headerShown: true,
          title: 'My Listings' 
        }} 
      />
      <ViewMyListingStack.Screen
        name="ListingStack"
        component={ListingStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Edit' 
        }} 
      />
    </ViewMyListingStack.Navigator>
  );
}

export default ViewMyListingStackNavigator;

