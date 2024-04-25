import React, { useEffect, useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MySearchBar from '../components/MySearchBar';
import { getListings } from '../api/ListingsService';
import LocationInfoDisplay from '../components/LocationInfoDisplay';
import { LocationContext } from '../components/LocationProvider';
import ListingItem from '../components/ListingItem';
import { useTheme } from '../components/ThemeContext';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {sendPushToken} from '../api/AppService';
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import * as Device from 'expo-device';


const HomeScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { user, logout } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef = useRef(1);
  const [totalPages, setTotalPages] = useState(null);
  const { location } = useContext(LocationContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const errorMessageTitle = "No Listings Found";
  const errorMessageDetails = "We're experiencing some problems on our end. Please try again later.";
  const emptyListingsMessage = "There are no listings available at the moment for your keyword/ location. LocalMart is a growing marketplace, please try again later.";

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Debounce the search

    return () => clearTimeout(timerId);
  }, [search]);

  useEffect(() => {
    setListings([]);
    //setCurrentPage(1); // Reset to first page
    currentPageRef.current = 1;
    setTotalPages(null); // Reset total pages

    fetchListings(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (location) {
       // Reset listings and current page when location changes
      setListings([]);
      //setCurrentPage(1); // Reset to first page
      currentPageRef.current = 1;
      setTotalPages(null); // Reset total pages

      fetchListings(null); // fetchListings will pick up the location from the context
    }
  }, [location]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      registerForPushNotificationsAsync();
    }
  };

  /*const registerForPushNotificationsAsync = async () => {
    let token;
    // Check if the token already exists
    //await AsyncStorage.removeItem('pushToken');
    token = await AsyncStorage.getItem('pushToken');
    console.log('token is: ', token);

    if (token) {
      return;
    }

    //await AsyncStorage.removeItem('askedForNotificationPermission');
    
    const askedForPermission = await AsyncStorage.getItem('askedForNotificationPermission');
    console.log('askedForNotificationPermission: ', askedForPermission);

    try {
        if (!askedForPermission) {
            if (Constants.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                token = (await Notifications.getExpoPushTokenAsync({
                  projectId: Constants.expoConfig?.extra?.eas?.projectId,
                })).data;
            } else {
                alert('Must use physical device for Push Notifications');
            }

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
            // Save a flag to local storage so we don't ask again
            await AsyncStorage.setItem('askedForNotificationPermission', 'true');
        } 
    } catch (error) {
        console.error('Error getting push token:', error);
    }

    // Save the token to local storage after it's generated
    await AsyncStorage.setItem('pushToken', token);
    try {
      await sendPushToken(user._id, token);
    } catch (error) {
      // Handle any errors that may occur during the initial call
      console.error('An unexpected error occurred when trying to send the push token:', error);
    }
  }*/

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    })).data;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

  // Save the token in AsyncStorage and send it to backend
  // Check if the token is different from the one stored or if there's a new user
  const previousToken = await AsyncStorage.getItem('pushToken');
  const previousUser = await AsyncStorage.getItem('userId');

  if (token !== previousToken || user._id !== previousUser) {
      await AsyncStorage.setItem('pushToken', token);
      await AsyncStorage.setItem('userId', user._id);
      // Send the token to backend server associated with the `currentUser`
      try {
          await sendPushToken(user._id, token);
      } catch (error) {
          console.error(`Error sending push token to backend for user ${user._id}: `, error);
      }
  }
}


const fetchListings = async (searchKey = '') => {

    setError(null); // Reset the error state
    setLoading(true);
    setLoaded(false); // Reset loaded before fetching

    try {  
      let paginatedResult;
      if(location) {
        paginatedResult = await getListings(
          searchKey,{
            latitude: location.coordinates[0].latitude,
            longitude: location.coordinates[0].longitude,
            maxDistance: 80467  // 50 miles in meters
            },  
            currentPageRef.current,
            50, // Set your desired limit or make it configurable
          );
      } else {
        paginatedResult = await getListings(searchKey, {}, currentPageRef.current, 50);
      }
      
      const { listings, pagination } = paginatedResult; // Destructure to get the listings array
      setTotalPages(pagination.totalPages);

      let modifiedData = listings.length % 2 !== 0 ? [...listings, {}] : listings;

      setListings(modifiedData);
      setLoading(false);
    } catch (error) {
      let errorMessage = error.message; // Default to the error message thrown
      if (error.message.includes('No listings found')) {
        errorMessage = emptyListingsMessage;
      } else if (error.message.includes('Internal server error')) {
        errorMessage = errorMessageDetails;
      } else if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } 

      setError(errorMessage);
      setLoading(false);
    } finally {
      setLoaded(true); // Set loaded to true after fetching, regardless of the outcome
    }
  };

  const handlePress = React.useCallback((item) => {
    navigation.navigate('ViewListingStack', { 
      screen: 'ViewListing', 
      params: { item }
    });
  }, [navigation]);

  const locationInfoPress = React.useCallback(() => {
    navigation.navigate('SearchLocationPreferenceScreen')
  }, [navigation]);

  const loadMoreListings = () => {
    if (!loading && currentPageRef.current < totalPages) {
      currentPageRef.current += 1; // Update the ref value
    }
  };


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MySearchBar
       value={search}
       onUpdate={(text) => setSearch(text)}
       navigation={navigation}
      />
     <LocationInfoDisplay onPress={() => locationInfoPress()} />
     {loading ? (
      <ActivityIndicator size="large" color={colors.primary} />
    ) : error ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    ) : listings.length === 0 && loaded ? ( // Check if listings are empty and loaded
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
        <Text style={styles.errorMessage}>{emptyListingsMessage}</Text>
      </View>
    ) : (
     <FlatList
        data={listings}
        renderItem={({ item }) => (
          <ListingItem
            item={item}
            onPress={() => handlePress(item)}
          />
        )}
        onEndReached={loadMoreListings} 
        onEndReachedThreshold={0.5}
        // Using index condition because of the dummy item insertged when odd listings since taht wont have _id field.
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        numColumns={2}
      />
      )}
    </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.size5Vertical,
    marginTop: 0,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: spacing.size20Vertical,
  },
  errorTitle: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  errorMessage: {
    fontSize: typography.subHeading,
    color: colors.secondaryText,
    marginTop: spacing.size10Vertical,
    textAlign: 'center',
    paddingHorizontal: spacing.size20Horizontal,
  },
});

export const updateLocationInContext = (location, setLocation) => {
  setLocation(location);
};

export default HomeScreen;