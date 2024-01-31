import { createStackNavigator } from '@react-navigation/stack';
import ViewListing from '../screens/ViewListing';
import SellerDetails from '../screens/SellerDetails';
import AllReviewsScreen from '../screens/AllReviewsScreen';

const ViewListingStack = createStackNavigator();

function ViewListingStackNavigator() {
  return (
    <ViewListingStack.Navigator>
      <ViewListingStack.Screen name="ViewListing" component={ViewListing} 
       options={{ 
          headerShown: true,
          title: 'Listing details',
        }} />
      <ViewListingStack.Screen name="SellerDetails" component={SellerDetails} 
      options={{ 
        headerShown: true,
        title: 'Seller details',
        tabBarStyle: { display: 'none' } 
      }} />
      <ViewListingStack.Screen name="AllReviewsScreen" component={AllReviewsScreen}
      options={{ 
        headerShown: true,
        title: 'All reviews',
        tabBarStyle: { display: 'none' } 
      }} />
    </ViewListingStack.Navigator>
  );
}

export default ViewListingStackNavigator;
