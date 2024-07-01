import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import SearchLocationPreferenceScreen from '../screens/SearchLocationPreferenceScreen';
import UserSearchPreferencesScreen from '../screens/UserSearchPreferenceScreen';


const HomeStack = createStackNavigator();

function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} 
        options={{ 
          headerShown: true,
          headerBackTitleVisible: false, // This hides the back title on iOS  
        }} /> 
        <HomeStack.Screen name="ViewListingStack" component={ViewListingStackNavigator} options={{ headerShown: false }} /> 
        <HomeStack.Screen name="SearchLocationPreferenceScreen" component={SearchLocationPreferenceScreen} 
        options={{ 
          headerShown: true,
          title: 'Set search location',
          headerBackTitleVisible: false, // This hides the back title on iOS  
        }} /> 
        <HomeStack.Screen name="UserSearchPreferencesScreen" component={UserSearchPreferencesScreen} 
        options={{ 
          headerShown: true,
          title: 'Search filters',
          headerBackTitleVisible: false, // This hides the back title on iOS  
      }} /> 
      </HomeStack.Navigator>
    );
  }

  export default HomeStackNavigator;