import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext'; 
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getListingsByUser } from '../../api/ListingsService'; 

const ViewMyListingScreen = () => {
  const [listings, setListings] = useState([]);
  const { user } = useContext(AuthContext); 
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  useEffect(() => {
    const loadListings = async () => {
      try {
        const fetchedListings = await getListingsByUser(user._id);
        setListings(fetchedListings);
      } catch (error) {
        console.error('Failed to load listings:', error);
        // Handle error (e.g., show a message)
      }
    };

    loadListings();
  }, [user._id]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ListingStack', {
            screen: 'CreateNewListingScreen',
            params: {
              isEditing: false, 
            },
          })}
          style={styles.createButton}
        >
          <Ionicons name="create" size={24} color="black" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listingItem} 
      onPress={() => navigation.navigate('ViewListing', { listingId: item._id })}
    >
      <Image source={{ uri: item.imageUrls[0] }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingDetails}>
        {`$${item.price.toFixed(2)}`} · {new Date(item.dateCreated).toLocaleDateString()}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
      </View>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOptionsPress(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="grey" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleOptionsPress = (item) => {
    const options = ['Share', 'Edit Listing', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // Logic for sharing the listing
          //shareListing(item);
        } else if (buttonIndex === 1) {
          navigation.navigate('ListingStack', {
            screen: 'CreateNewListingScreen',
            params: {
              isEditing: true, 
              listing: item,
            },
          });
        }
      },
    );
  };

  return (
    <FlatList
      data={listings}
      renderItem={renderItem}
      keyExtractor={item => item._id}
    />
  );
};

const styles = StyleSheet.create({
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  createButtonText: {
    marginLeft: 5,
    color: 'black',
  },
  listingItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listingImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  listingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  listingTitle: {
    fontSize: 18,
    color: 'black',
  },
  listingPrice: {
    fontSize: 14,
    color: 'grey',
  },
  listingDate: {
    fontSize: 12,
    color: 'grey',
  },
  listingDetails: {
    fontSize: 14,
    color: 'grey',
    // Add any other styling you need
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonStyle: {
    backgroundColor: '#007bff', // Example button color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10, // Add margin to separate the buttons
  },
  buttonText: {
    color: 'white',
  },
  optionsButton: {
    padding: 30,
    paddingRight: -20
  },
});

export default ViewMyListingScreen;


/*
Error Handling: The screen should handle potential errors while fetching listings, such as showing an error message or a retry button.

Loading State: Consider adding a loading indicator while the listings are being fetched.

Empty State: Display a message when the user has no listings.

Styling: Adjust the styling according to your app's design theme.

Image Handling: The code assumes that the first image URL in the imageUrls array is the main image for the listing. Make sure this aligns with your data structure. Also, handle cases where an image might not be available.

Navigation Parameters: When navigating to the ViewListing screen, pass the necessary parameters (e.g., listingId) that the ViewListing screen might require to fetch and display the specific listing details.


*/
