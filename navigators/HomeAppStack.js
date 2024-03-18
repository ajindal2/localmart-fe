import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SavedListingStackNavigator from './SavedListingStackNavigator';
import MyMessagesStackNavigator from './MyMessagesStackNavigator';
import CreateListingStackNavigator from './CreateListingStackNavigator';
import HomeStackNavigator from './HomeStackNavigator'
import AccountStackNavigator from './AccountStackNavigator'
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import CameraButton from '../components/CameraButton'
import { useMessagesBadgeCount } from '../MessagesBadgeCountContext';

const Tab = createBottomTabNavigator();

function HomeAppStack() {
  const { messagesBadgeCount } = useMessagesBadgeCount(); // Use the unread message count from context

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
              case 'SavedListingStackNavigator':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'MyMessagesStackNavigator':
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
            paddingBottom: 10, // Add padding to bottom to center the icons vertically
            paddingTop: 5,
            // Add other styling if necessary
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }}/>
        <Tab.Screen name="SavedListingStackNavigator" component={SavedListingStackNavigator} options={{ headerShown: false, tabBarLabel: 'Saved' }}/>
        <Tab.Screen
          name="Create New Listing"
          component={CreateListingStackNavigator} // Component to be rendered when the Camera tab is pressed
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
            ),
            tabBarButton: (props) => <CameraButton {...props} />, // Custom component for the tab bar button
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="MyMessagesStackNavigator"
          component={MyMessagesStackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Messages',
            tabBarBadge: messagesBadgeCount > 0 ? messagesBadgeCount : null, // Show badge with unread count
          }}
        />
       <Tab.Screen name="Account" component={AccountStackNavigator} options={{ headerShown: false, tabBarLabel: 'Account' }} /> 
      </Tab.Navigator>
  );
}

export default HomeAppStack;
