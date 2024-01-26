import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateListingStackNavigator from './CreateListingStackNavigator';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import ViewMyListingScreen from '../screens/account/ViewMyListingScreen';

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
        component={CreateListingStackNavigator}
        options={{ 
          headerShown: false,
        }} 
      />
       <ViewMyListingStack.Screen
        name="ViewListingStack"
        component={ViewListingStackNavigator}
        options={{ 
          headerShown: false,
        }} 
      />
    </ViewMyListingStack.Navigator>
  );
}

export default ViewMyListingStackNavigator;

