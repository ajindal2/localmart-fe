import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import SavedItems from '../screens/SavedItems';

const SavedMyListingStack = createStackNavigator();

function SavedListingStackNavigator() {
  return (
    <SavedMyListingStack.Navigator>
      <SavedMyListingStack.Screen
        name="SavedItem"
        component={SavedItems}
        options={{ 
          headerShown: true,
          title: 'Saved items',
          headerBackTitle: '', 
        }} 
      />
       <SavedMyListingStack.Screen
        name="ViewListingStack"
        component={ViewListingStackNavigator}
        options={{ 
          headerShown: false,
        }} 
      />
    </SavedMyListingStack.Navigator>
  );
}

export default SavedListingStackNavigator;

