import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';
import MyProfile from '../screens/account/MyProfile';
import TermsScreen from '../screens/account/TermsScreen';
import PrivacyPolicyScreen from '../screens/account/PrivacyPolicyScreen';
import AboutScreen from '../screens/account/AboutScreen';
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
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="MyProfile" component={MyProfile} 
        options={{ 
          headerShown: true,
          title: 'My Profile',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="TermsScreen" component={TermsScreen} 
        options={{ 
          headerShown: true,
          title: 'Terms of Service',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} 
        options={{ 
          headerShown: true,
          title: 'Privacy Policy',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="AboutScreen" component={AboutScreen} 
        options={{ 
          headerShown: true,
          title: 'About Us',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="ContactUs" component={ContactUs} 
        options={{ 
          headerShown: true,
          title: 'Contact Us',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="ChangeProfilePicture" component={ChangeProfilePicture}
        options={{ 
          headerShown: true,
          title: 'Change photo',
          headerBackTitle: '', 
        }}  /> 
        <AccountStack.Screen name="ViewMyListingStackNavigator" component={ViewMyListingStackNavigator} options={{ headerShown: false }} /> 
        <AccountStack.Screen name="SavedListingStackNavigator" component={SavedListingStackNavigator} options={{ headerShown: false }} />  
        <AccountStack.Screen name="AllReviewsScreen" component={AllReviewsScreen}
          options={{ 
            headerShown: true,
            title: 'All reviews',
            headerBackTitle: '', 
            //tabBarStyle: { display: 'none' } 
        }} />
        <AccountStack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} 
          options={{ 
            headerShown: true,
            title: 'Update Password',
            headerBackTitle: '', 
        }}  /> 
      </AccountStack.Navigator>
    );
  }

export default AccountStackNavigator;