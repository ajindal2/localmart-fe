import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Dimensions, Platform, Alert } from 'react-native';
import MySearchBar from '../components/MySearchBar';
import { getListings } from '../api/ListingsService';
import LocationInfoDisplay from '../components/LocationInfoDisplay';
import { useLocation } from '../components/LocationProvider';
import { useSearchPreferences } from '../components/SearchPreferencesContext';
import ListingItem from '../components/ListingItem';
import { useTheme } from '../components/ThemeContext';
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import {APP_NAME_IMAGE} from '../constants/AppConstants';


const HomeScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { user, logout } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const currentPageRef = useRef(1);
  const [totalPages, setTotalPages] = useState(null);
  const { location } = useLocation();
  const { searchDistance } = useSearchPreferences();
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const errorMessageTitle = "No Listings Found";
  const errorMessageDetails = "We're experiencing some problems on our end. Please try again later.";
  const emptyListingsMessage = "There are no listings available at the moment for your keyword/ location. FarmVox is a growing marketplace, please try again later.";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image 
          source={APP_NAME_IMAGE}
          style={styles.logo} 
        />
      )
    });
  }, [navigation]);
  
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
    if (searchDistance) {
       // Reset listings and current page when searchDistance changes
      setListings([]);
      //setCurrentPage(1); // Reset to first page
      currentPageRef.current = 1;
      setTotalPages(null); // Reset total pages

      fetchListings(null); // fetchListings will pick up the searchDistance from the context
    }
  }, [searchDistance]);

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

  /*
  useEffect(() => {
    console.log('inside getPermissionStatus useeffect');
    const getPermissionStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasRequestedPermission');
        console.log('value : ', value);
        if (value !== null) {
          setHasRequestedPermission(JSON.parse(value));
        } else {
          setHasRequestedPermission(false);
        }
      } catch (e) {
        console.error('Failed to fetch permission status from AsyncStorage', e);
      }
    };

    getPermissionStatus();
  }, []);


  useEffect(() => {
    console.log('inside hasRequestedPermission useeffect');
    console.log('hasRequestedPermission ', hasRequestedPermission);
    if (hasRequestedPermission !== null) {
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => {
        subscription.remove();
      };
    }
  }, [hasRequestedPermission]);

  const handleAppStateChange = async (nextAppState) => {
    console.log('Inside handleAppStateChange');
    if (nextAppState === 'active' && !hasRequestedPermission) {
      setHasRequestedPermission(true); 
      await AsyncStorage.setItem('hasRequestedPermission', JSON.stringify(true));
      registerForPushNotificationsAsync();
    }
  };

  const registerForPushNotificationsAsync = async () => {
    console.log("registerForPushNotificationsAsync");
    if (!Device.isDevice) {
        console.error('Must use physical device for Push Notifications');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log('existingStatus for notification ', existingStatus);
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    console.log('finalStatus for notification ', finalStatus);
    if (finalStatus !== 'granted') {
        console.log(`Push notification access is denied`);
        Alert.alert('Permission Denied', 'Notifications permission was denied. Please enable it from app settings.');
        await AsyncStorage.setItem('hasRequestedPermission', JSON.stringify(true));
        setHasRequestedPermission(true); 
        return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      // TODO how to handle this
      handleRegistrationError('Project ID not found');
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    })).data;

    console.log('token in homescreen is: ', token);

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    await AsyncStorage.setItem('hasRequestedPermission', JSON.stringify(true));
    setHasRequestedPermission(true);

    // Save the token in AsyncStorage and send it to backend
    // Check if the token is different from the one stored or if there's a new user
    if (user) {
      // Save the token in AsyncStorage and send it to backend
      const previousToken = await AsyncStorage.getItem('pushToken');
      const previousUser = await AsyncStorage.getItem('userId');
  
      if (token !== previousToken || user._id !== previousUser) {
        await AsyncStorage.setItem('pushToken', token);
        await AsyncStorage.setItem('userId', user._id);
        try {
            await sendPushToken(user._id, token);
        } catch (error) {
            console.error(`Error sending push token to backend for user ${user._id}: `, error);
        }
      }
    } else {
      // Handle guest users: store token locally, but don't send to backend
      await AsyncStorage.setItem('pushToken', token);
      console.log('inside else');
    } 
}
*/

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
            maxDistance: searchDistance * 1609.34 // Convert miles to meters
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
        await logout();
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
    if(user) {
    navigation.navigate('UserSearchPreferencesScreen')
    } else {
      navigation.navigate('Auth', { screen: 'WelcomeScreen' });
    }
  }, [user, navigation]);

  const loadMoreListings = () => {
    if (!loading && currentPageRef.current < totalPages) {
      currentPageRef.current += 1; // Update the ref value
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchListings(null).then(() => setRefreshing(false));
  }, [searchDistance, location]);

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
        // Using index condition because of the dummy item inserted when odd listings since that wont have _id field.
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        numColumns={2}
        initialNumToRender={10} 
        maxToRenderPerBatch={6} // Number of items to render per batch
        windowSize={9} // Determines the number of items rendered outside of the viewport
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const logoSize = width * 0.3; 

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
  logo: {
    width: logoSize,
    height: 0.25 * logoSize,
  },
});

export const updateLocationInContext = (location, setLocation) => {
  setLocation(location);
};

export default HomeScreen;