import { createStackNavigator } from '@react-navigation/stack';
import MyMessages from '../screens/MyMessages';
import ChatScreen from '../screens/ChatScreen';
import ViewListingStackNavigator from './ViewListingStackNavigator';
import RatingForSellerScreen from '../screens/RatingForSellerScreen';


const MyMessagesStack = createStackNavigator();

function MyMessagesStackNavigator() {
    return (
      <MyMessagesStack.Navigator screenOptions={{ headerShown: false }}>         
        <MyMessagesStack.Screen name="MyMessages" component={MyMessages} 
        options={{ 
            headerShown: true,
            title: 'My Messages' 
          }} /> 
        <MyMessagesStack.Screen name="ChatScreen" component={ChatScreen} 
        options={{ 
          headerShown: true,
          title: 'Message' 
        }} /> 
        <MyMessagesStack.Screen name="ViewListingStack" component={ViewListingStackNavigator}
        options={{ 
          headerShown: false,
        }} />
        <MyMessagesStack.Screen name="RatingForSellerScreen" component={RatingForSellerScreen}
        options={{ 
          headerShown: true,
          title: 'Rate Seller',
        }}  />
      </MyMessagesStack.Navigator>
    );
  }

  export default MyMessagesStackNavigator;