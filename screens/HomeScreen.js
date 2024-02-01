import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { AuthContext } from '../AuthContext';
import MySearchBar from '../components/MySearchBar';
import { getListings } from '../api/ListingsService';
import LocationInfoDisplay from '../components/LocationInfoDisplay';
import { LocationContext } from '../components/LocationProvider';
import ListingItem from '../components/ListingItem';

const HomeScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const { user, logout} = useContext(AuthContext);
  const { location } = useContext(LocationContext);

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
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        maxDistance: 5000 // 500 meters TODO adjust
      }).then(data => {
        setListings(data);
      }).catch(error => {
        console.error('Error fetching listings:', error);
      });
    }
  }, [location]);

  const fetchListings = async (searchKey = '') => {
    try {
      const data = await getListings(searchKey);
      let modifiedData = data;

      // Check if the number of listings is odd
      if (data.length % 2 !== 0) {
        modifiedData = [...data, {}]; // Create a new array with an extra empty object
      }
  
      setListings(modifiedData);
    } catch (error) {
      Alert.alert('Error loading listings', error.message);
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    marginTop: 0,
  },
});

export const updateLocationInContext = (location, setLocation) => {
  setLocation(location);
};

export default HomeScreen;