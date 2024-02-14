import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MySearchBar from '../components/MySearchBar';
import { getListings } from '../api/ListingsService';
import LocationInfoDisplay from '../components/LocationInfoDisplay';
import { LocationContext } from '../components/LocationProvider';
import ListingItem from '../components/ListingItem';
import { useTheme } from '../components/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
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
    fetchListings(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (location) {
      getListings(null, {
        latitude: location.coordinates[0].latitude,
        longitude: location.coordinates[0].longitude,
        maxDistance: 50000 // 500 meters TODO adjust
      }).then(data => {
        setListings(data);
      }).catch(error => {
        console.error('Error fetching listings:', error);
      });
    }
  }, [location]);

  const fetchListings = async (searchKey = '') => {
    setError(null); // Reset the error state
    setLoading(true);
    setLoaded(false); // Reset loaded before fetching
    try {
      let data;
      if(location) {
       data = await getListings(searchKey, {
          latitude: location.coordinates[0].latitude,
          longitude: location.coordinates[0].longitude,
          maxDistance: 50000 // 500 meters TODO adjust
        });
      } else {
       data = await getListings(searchKey, {});
      }
      let modifiedData = data;

      // Check if the number of listings is odd
      if (data.length % 2 !== 0) {
        modifiedData = [...data, {}]; // Create a new array with an extra empty object
      } 
      setListings(modifiedData);
      setLoading(false);
    } catch (error) {
      let errorMessage = error.message; // Default to the error message thrown
      if (error.message.includes('No listings found')) {
        errorMessage = emptyListingsMessage;
      } else if (error.message.includes('Internal server error')) {
        errorMessage = errorMessageDetails;
      }

      setError(errorMessage);
      setLoading(false);
    } finally {
      setLoaded(true); // Set loaded to true after fetching, regardless of the outcome
    }
  };

  return (
    <View style={styles.container}>
      <MySearchBar
       value={search}
       onUpdate={(text) => setSearch(text)}
       navigation={navigation}
      />
     <LocationInfoDisplay onPress={() => navigation.navigate('SearchLocationPreferenceScreen')} />
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
            onPress={() => navigation.navigate('ViewListingStack', { 
              screen: 'ViewListing', 
              params: { item }
            })}
          />
        )}
        keyExtractor={item => item._id ? item._id.toString() : Math.random().toString()}
        numColumns={2}
      />
      )}
    </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    marginTop: 0,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20, // Add some horizontal padding for better readability
  },
});

export const updateLocationInContext = (location, setLocation) => {
  setLocation(location);
};

export default HomeScreen;