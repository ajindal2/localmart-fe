import React, { useCallback, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getSavedListings, deleteSavedListing } from '../api/SavedListingService'; // Replace with your actual API service call

const SavedItems = ({navigation}) => {
  const { user } = useContext(AuthContext);
  const [savedListings, setSavedListings] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();

  const fetchSavedListings = async () => {
    try {
      const data = await getSavedListings(user._id); // Fetch saved listings from backend
      setSavedListings(data);
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedListings();
    }, [user._id])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
  style={styles.listingItem}
  onPress={() => {
    if (item.listing) {
      navigation.navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { item: item.listing }
      });
      //navigation.navigate('ViewListing', { item: item.listing });
    } else {
      console.log('Listing is null, navigation aborted');
      // Optionally, you can show an alert or a toast message here
    }
  }}
>
      <Image source={{ uri: item.listing.imageUrls[0] }} style={styles.image} />
      <View style={styles.listingInfo}>
        <Text style={styles.title}>{item.listing.title}</Text>
        <Text style={styles.price}>${item.listing.price}</Text>
        <Text style={styles.dateSaved}>Saved on: {formatDate(item.savedOn)}</Text>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOptionsPress(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="grey" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleOptionsPress = (item) => {
    const options = ['Share Listing', 'Unsave Listing', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // Logic for sharing the listing
          shareListing(item);
        } else if (buttonIndex === 1) {
          // Logic for unsaving the listing
          unsaveListing(item);
        }
      },
    );
  };

  const shareListing = (item) => {
    // Implement sharing functionality
    // You can use React Native's Share API or a custom method
  };

  const unsaveListing = async (item) => {
    try {
      await deleteSavedListing(item._id); // API call to unsave the listing
      // Update the state to remove the unsaved item
      setSavedListings(currentSavedListings => 
        currentSavedListings.filter(listing => listing._id !== item._id)
      );
    } catch (error) {
      console.error('Error unsaving the listing:', error);
      // Optionally, handle error (e.g., show a toast notification)
    }
  };

  const formatDate = (dateString) => {
    // Format the date string into a more readable format
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <FlatList
      data={savedListings}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listingItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  listingInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'grey',
  },
  dateSaved: {
    fontSize: 12,
    color: 'grey',
  },
  optionsButton: {
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 120, // This should match the width of the image + its padding/margin
  },
});

export default SavedItems;
