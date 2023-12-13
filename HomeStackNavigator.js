import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ViewListing from './screens/ViewListing';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }} /> 
        <HomeStack.Screen name="ViewListing" component={ViewListing} options={{ headerShown: true }} /> 
      </HomeStack.Navigator>
    );
  }

  export default HomeStackNavigator;