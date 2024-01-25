import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from './screens/account/AccountScreen';
import MyProfile from './screens/account/MyProfile';
import ChangeProfilePicture from './screens/account/ChangeProfilePicture';
import ViewMyListingStackNavigator from './ViewMyListingStackNavigator';

const AccountStack = createStackNavigator();

function AccountStackNavigator() {
    return (
      <AccountStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <AccountStack.Screen name="My Account" component={AccountScreen} options={{ headerShown: true }} /> 
        <AccountStack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: true }} /> 
        <AccountStack.Screen name="ChangeProfilePicture" component={ChangeProfilePicture} options={{ headerShown: true }} /> 
        <AccountStack.Screen 
          name="ViewMyListingStackNavigator"
          component={ViewMyListingStackNavigator}  
        /> 
      </AccountStack.Navigator>
    );
  }

export default AccountStackNavigator;