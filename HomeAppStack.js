import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SavedItems from './screens/SavedItems';
import MyMessages from './screens/MyMessages';
import CreateNewListingScreen from './screens/CreateNewListingScreen';
import HomeStackNavigator from './HomeStackNavigator'
import AccountStackNavigator from './AccountStackNavigator'
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './constants/colors';
import CameraButton from './components/CameraButton'

const Tab = createBottomTabNavigator();

function HomeAppStack() {
  return (
  <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'SavedItems':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'MyMessages':
                iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                break;
              case 'Account':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.greyColor,
          tabBarStyle: {
            height: 60, // Increase tab bar height if necessary
            paddingBottom: 20, // Add padding to bottom to center the icons vertically
            // Add other styling if necessary
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }}/>
        <Tab.Screen name="SavedItems" component={SavedItems} />
        <Tab.Screen
        name="Create New Listing"
        component={CreateNewListingScreen} // Component to be rendered when the Camera tab is pressed
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
          ),
          tabBarButton: (props) => <CameraButton {...props} />, // Custom component for the tab bar button
          //headerShown: false,
        }}
      />
        <Tab.Screen name="MyMessages" component={MyMessages} />
        <Tab.Screen name="Account" component={AccountStackNavigator} options={{ headerShown: false }} /> 
      </Tab.Navigator>
  );
}

export default HomeAppStack;
