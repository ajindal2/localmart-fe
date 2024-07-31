import React, { useContext } from 'react';
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
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

function HomeAppStack() {
  const { messagesBadgeCount } = useMessagesBadgeCount(); // Use the unread message count from context
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleTabPress = (event, route) => {
    if (!user) {
      event.preventDefault();
      navigation.navigate('Auth', { screen: 'WelcomeScreen' });
    }
  };


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
        <Tab.Screen name="SavedListingStackNavigator" options={{ headerShown: false, tabBarLabel: 'Saved' }}
         listeners={{
          tabPress: event => handleTabPress(event, 'SavedListingStackNavigator'),
        }}>
          {props => <ProtectedRoute component={SavedListingStackNavigator} {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="CreateListingStackNavigator"
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
            ),
            tabBarButton: (props) => <CameraButton {...props} />, // Custom component for the tab bar button
            headerShown: false,
          }}
          listeners={{
            tabPress: event => handleTabPress(event, 'CreateListingStackNavigator'),
          }}
        >
          {props => <ProtectedRoute component={CreateListingStackNavigator} {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="MyMessagesStackNavigator"
          options={{
            headerShown: false,
            tabBarLabel: 'Messages',
            tabBarBadge: messagesBadgeCount > 0 ? messagesBadgeCount : null, // Show badge with unread count
          }}
          listeners={{
            tabPress: event => handleTabPress(event, 'MyMessagesStackNavigator'),
          }}
        >
          {props => <ProtectedRoute component={MyMessagesStackNavigator} {...props} />}
        </Tab.Screen>
      <Tab.Screen name="Account" options={{ headerShown: false, tabBarLabel: 'Account' }}
        listeners={{
          tabPress: event => handleTabPress(event, 'Account'),
        }}
      >
        {props => <ProtectedRoute component={AccountStackNavigator} {...props} />}
      </Tab.Screen>
      </Tab.Navigator>
  );
}

export default HomeAppStack;
