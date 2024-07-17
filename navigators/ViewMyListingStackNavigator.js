import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateListingStackNavigator from './CreateListingStackNavigator';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import ViewMyListingScreen from '../screens/account/ViewMyListingScreen';
import BuyerConfirmationScreen from '../screens/account/BuyerConfirmationScreen';
import RatingForBuyerScreen from '../screens/RatingForBuyerScreen';


const ViewMyListingStack = createStackNavigator();

function ViewMyListingStackNavigator() {
  return (
    <ViewMyListingStack.Navigator>
      <ViewMyListingStack.Screen
        name="ViewMyListingScreen"
        component={ViewMyListingScreen}
        options={{ 
          headerShown: true,
          title: 'My Listings',
          headerBackTitle: '',  
        }} 
      />
      <ViewMyListingStack.Screen
        name="BuyerConfirmationScreen"
        component={BuyerConfirmationScreen}
        options={{ 
          headerShown: true,
          title: 'Select Buyer',
          headerBackTitle: '', 
        }} 
      />
      <ViewMyListingStack.Screen
        name="RatingForBuyerScreen"
        component={RatingForBuyerScreen}
        options={{ 
          headerShown: true,
          title: 'Rate Buyer',
          headerBackTitle: '', 
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

