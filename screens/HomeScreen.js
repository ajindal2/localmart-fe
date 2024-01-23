import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { AuthContext } from '../AuthContext';
import MySearchBar from '../components/MySearchBar';
import { getListings } from '../api/ListingsService';
import colors from '../constants/colors';
import LocationInfoDisplay from '../components/LocationInfoDisplay';
import { LocationContext } from '../components/LocationProvider';


const HomeScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const { user, logout} = useContext(AuthContext);
  const { location, setLocation } = useContext(LocationContext);

  const handleLogout = () => {
    logout();
  };


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

  // TODO: will have to truncate long titles
  // TODO: check how a description with new lines etc is stored in mongo.
  // tODO: check complications of decimal prices
  const RenderItem = ({ item }) => {
    // Check if the item is the filler item
    if (!item.title) {
      return <View style={styles.invisibleItem} />;
    }

    const handlePress = () => {
      navigation.navigate('ViewListing', { item });
    };
  
    return (
      <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Logout"
        onPress={handleLogout}
      />
      <View>
    { /*location && (
      <>
        <Text>Coordinates: {location.coordinates.join(', ')}</Text>
        <Text>City: {location.city}</Text>
        <Text>Postal Code: {location.postalCode}</Text>
      </>
    ) */}
  </View>
      
      <MySearchBar
       value={search}
       onUpdate={(text) => setSearch(text)}
      />
     <LocationInfoDisplay onPress={() => navigation.navigate('SearchLocationPreferenceScreen')} />
      <FlatList
         data={listings}
         renderItem={({ item }) => <RenderItem item={item} navigation={navigation} />}
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
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
  },
  image: {
    width: '100%',
    height: 150, // Adjust height
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    color: 'grey',
  },
  invisibleItem: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    opacity: 0, // Make the item invisible
  }
});

export const updateLocationInContext = (location, setLocation) => {
  setLocation(location);
};

export default HomeScreen;