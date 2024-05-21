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
            title: 'My Messages',
            headerBackTitleVisible: false, // This hides the back title on iOS  
          }} /> 
        <MyMessagesStack.Screen name="ChatScreen" component={ChatScreen} 
        options={{ 
          headerShown: true,
          title: 'Message',
          headerBackTitleVisible: false, // This hides the back title on iOS  
        }} /> 
        <MyMessagesStack.Screen name="ViewListingStack" component={ViewListingStackNavigator}
        options={{ 
          headerShown: false,
        }} />
        <MyMessagesStack.Screen name="RatingForSellerScreen" component={RatingForSellerScreen}
        options={{ 
          headerShown: true,
          title: 'Rate Seller',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  />
      </MyMessagesStack.Navigator>
    );
  }

  export default MyMessagesStackNavigator;