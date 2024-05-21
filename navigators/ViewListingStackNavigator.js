import { createStackNavigator } from '@react-navigation/stack';
import ViewListing from '../screens/ViewListing';
import SellerDetails from '../screens/SellerDetails';
import AllReviewsScreen from '../screens/AllReviewsScreen';
import ChatScreen from '../screens/ChatScreen';

const ViewListingStack = createStackNavigator();

function ViewListingStackNavigator() {
  return (
    <ViewListingStack.Navigator>
      <ViewListingStack.Screen name="ViewListing" component={ViewListing} 
       options={{ 
          headerShown: true,
          title: 'Listing details',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }} />
      <ViewListingStack.Screen name="SellerDetails" component={SellerDetails} 
      options={{ 
        headerShown: true,
        title: 'Seller details',
        headerBackTitleVisible: false, // This hides the back title on iOS 
      }} />
      <ViewListingStack.Screen name="AllReviewsScreen" component={AllReviewsScreen}
      options={{ 
        headerShown: true,
        title: 'All reviews',
        headerBackTitleVisible: false, // This hides the back title on iOS  
      }} />
      {/* Additional ViewListing Screen for navigating from SellerDetails */}
      <ViewListingStack.Screen name="ViewListingFromSeller" component={ViewListing} 
        options={{ 
          headerShown: true,
          title: 'Listing Details',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }} 
      />
      <ViewListingStack.Screen name="ChatScreen" component={ChatScreen} 
       options={{ 
          headerShown: true,
          title: 'Message',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }} />
    </ViewListingStack.Navigator>
  );
}

export default ViewListingStackNavigator;
