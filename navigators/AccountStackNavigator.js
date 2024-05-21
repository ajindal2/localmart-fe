import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';
import MyProfile from '../screens/account/MyProfile';
import ContactUs from '../screens/account/ContactUs';
import ChangeProfilePicture from '../screens/account/ChangeProfilePicture';
import ViewMyListingStackNavigator from './ViewMyListingStackNavigator';
import SavedListingStackNavigator from './SavedListingStackNavigator';
import AllReviewsScreen from '../screens/AllReviewsScreen';
import UpdatePasswordScreen from '../screens/account/UpdatePasswordScreen';


const AccountStack = createStackNavigator();

function AccountStackNavigator() {
    return (
      <AccountStack.Navigator screenOptions={{ headerShown: false }}> 
        {/* Hide the header for the stack */}
        <AccountStack.Screen name="AccountScreen" component={AccountScreen} 
        options={{ 
          headerShown: true,
          title: 'My Account',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  /> 
        <AccountStack.Screen name="MyProfile" component={MyProfile} 
        options={{ 
          headerShown: true,
          title: 'My Profile',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  /> 
        <AccountStack.Screen name="ContactUs" component={ContactUs} 
        options={{ 
          headerShown: true,
          title: 'Contact Us',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  /> 
        <AccountStack.Screen name="ChangeProfilePicture" component={ChangeProfilePicture}
        options={{ 
          headerShown: true,
          title: 'Change photo',
          headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  /> 
        <AccountStack.Screen name="ViewMyListingStackNavigator" component={ViewMyListingStackNavigator} options={{ headerShown: false }} /> 
        <AccountStack.Screen name="SavedListingStackNavigator" component={SavedListingStackNavigator} options={{ headerShown: false }} />  
        <AccountStack.Screen name="AllReviewsScreen" component={AllReviewsScreen}
          options={{ 
            headerShown: true,
            title: 'All reviews',
            headerBackTitleVisible: false, // This hides the back title on iOS
            //tabBarStyle: { display: 'none' } 
        }} />
        <AccountStack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} 
          options={{ 
            headerShown: true,
            title: 'Update Password',
            headerBackTitleVisible: false, // This hides the back title on iOS 
        }}  /> 
      </AccountStack.Navigator>
    );
  }

export default AccountStackNavigator;