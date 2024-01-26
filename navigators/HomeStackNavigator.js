import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import SearchLocationPreferenceScreen from '../screens/SearchLocationPreferenceScreen';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} 
        options={{ 
          headerShown: true,
          title: 'Home' 
        }} /> 
        <HomeStack.Screen name="ViewListingStack" component={ViewListingStackNavigator} options={{ headerShown: false }} /> 
        <HomeStack.Screen name="SearchLocationPreferenceScreen" component={SearchLocationPreferenceScreen} 
        options={{ 
          headerShown: true,
          title: 'Set search location' 
        }} /> 
      </HomeStack.Navigator>
    );
  }

  export default HomeStackNavigator;