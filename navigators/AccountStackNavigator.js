import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';
import MyProfile from '../screens/account/MyProfile';
import ChangeProfilePicture from '../screens/account/ChangeProfilePicture';
import ViewMyListingStackNavigator from './ViewMyListingStackNavigator';
import SavedListingStackNavigator from './SavedListingStackNavigator';

const AccountStack = createStackNavigator();

function AccountStackNavigator() {
    return (
      <AccountStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <AccountStack.Screen name="AccountScreen" component={AccountScreen} 
        options={{ 
          headerShown: true,
          title: 'My Account' 
        }}  /> 
        <AccountStack.Screen name="MyProfile" component={MyProfile} 
        options={{ 
          headerShown: true,
          title: 'My Profile' 
        }}  /> 
        <AccountStack.Screen name="ChangeProfilePicture" component={ChangeProfilePicture}
        options={{ 
          headerShown: true,
          title: 'Change photo' 
        }}  /> 
        <AccountStack.Screen name="ViewMyListingStackNavigator" component={ViewMyListingStackNavigator} options={{ headerShown: false }} /> 
        <AccountStack.Screen name="SavedListingStackNavigator" component={SavedListingStackNavigator} options={{ headerShown: false }} />  
      </AccountStack.Navigator>
    );
  }

export default AccountStackNavigator;