import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ViewListing from './screens/ViewListing';
import SearchLocationPreferenceScreen from './screens/SearchLocationPreferenceScreen';
import SellerDetails from './screens/SellerDetails';
import AllReviewsScreen from './screens/AllReviewsScreen';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }} /> 
        <HomeStack.Screen name="ViewListing" component={ViewListing} options={{ headerShown: true }} /> 
        <HomeStack.Screen name="SearchLocationPreferenceScreen" component={SearchLocationPreferenceScreen} options={{ headerShown: true }} /> 
        <HomeStack.Screen name="SellerDetails" component={SellerDetails} options={{ headerShown: true }} /> 
        <HomeStack.Screen name="AllReviewsScreen" component={AllReviewsScreen} options={{ headerShown: true }} /> 
      </HomeStack.Navigator>
    );
  }

  export default HomeStackNavigator;