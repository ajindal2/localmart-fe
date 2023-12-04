import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SavedItems from './screens/SavedItems';
import MyMessages from './screens/MyMessages';
import AccountScreen from './screens/account/AccountScreen';
import AccountStackNavigator from './AccountStackNavigator'
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './constants/colors';


//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeAppStack() {
  return (
  /* <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
    </Stack.Navigator>
  );
} */

  <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'HomeScreen':
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
        })}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="SavedItems" component={SavedItems} />
        <Tab.Screen name="MyMessages" component={MyMessages} />
        <Tab.Screen name="Account" component={AccountStackNavigator} options={{ headerShown: false }} /> 
      </Tab.Navigator>
  );
}

export default HomeAppStack;
