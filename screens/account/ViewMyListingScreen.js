import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../AuthContext'; 
import { getListingsByUser, deleteListing, updateListingStatus } from '../../api/ListingsService'; 
import useHideBottomTab from '../../utils/HideBottomTab'; 
import CustomActionSheet from '../../components/CustomActionSheet'; 
import { useTheme } from '../../components/ThemeContext';
import ButtonComponent from '../../components/ButtonComponent';
import { useFocusEffect } from '@react-navigation/native'; 
import shareListing from '../../utils/ShareListing';


const ViewMyListingScreen = ({navigation}) => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
  const { user, logout } = useContext(AuthContext); 
  const [activeItemId, setActiveItemId] = useState(null);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const errorMessageTitle = "No Listings Found";
  const errorMessageDetails = "We're experiencing some problems on our end. Please try again later.";
  const emptyListingsMessage = "Start selling and mange your listings here.";
  
  useHideBottomTab(navigation, true);

   useFocusEffect(
      useCallback(() => {
      const loadListings = async () => {
        setError(null); // Reset the error state
        setLoading(true);
        setLoaded(false); // Reset loaded before fetching
        try {
          const fetchedListings = await getListingsByUser(user._id);
          setListings(fetchedListings);
          setLoading(false);
        } catch (error) {
          if (error.message === 'RefreshTokenExpired') {
            logout();
          } else {
            let errorMessage = error.message; // Default to the error message thrown
            if (error.message.includes('No listings found')) {
              errorMessage = emptyListingsMessage;
            } else if (error.message.includes('Internal server error')) {
              errorMessage = errorMessageDetails;
            }
            setError(errorMessage);
            setLoading(false);
          }
        } finally {
          setLoaded(true); // Set loaded to true after fetching, regardless of the outcome
        }
      };

      loadListings();
    }, [user._id])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ButtonComponent iconName="create-outline" type="primary" round={true}
        onPress={() => navigation.navigate('ListingStack', {
          screen: 'CreateNewListingScreen',
          params: {
            isEditing: false, 
            fromAccount: true, // To hide the bottom tab when navigating from here.
          },
        })}
       style={{ marginRight: 20 }}/>     
      ),
    });
  }, [navigation]);

  const markAsSold = async (listingId) => {
    try {
      await updateListingStatus(listingId, 'Sold');
      const updatedListings = listings.map(item =>
        item._id === listingId ? { ...item, status: 'Sold' } : item
      );
      setListings(updatedListings);
    } catch (error) {
      if (error.message === 'RefreshTokenExpired') {
        logout();
      } else {
        console.error('Error marking listing as sold:', error);
        Alert.alert('Error', 'Error updating status, please try again later.');
      }
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await deleteListing(listingId); 
      const updatedListings = listings.filter(item => item._id !== listingId); // Remove the deleted item from the listings array
      setListings(updatedListings); // Update the state with the new listings array
      Alert.alert('Listing deleted successfully');
    } catch (error) {
      if (error.message === 'RefreshTokenExpired') {
        logout();
      } else {
        console.error('Error deleting listing:', error);
        Alert.alert('Error', 'Error deleting listing, please try again later.');
      }
    }
  };

  // Handle share listing action
  const handleShareListing = (listingId) => {
    const listingTitle = 'Check this Item for Sale!';
    const listingUrl = getListingUrl(listingId);
    shareListing(listingTitle, listingUrl);
};

  const getActionSheetOptions = (item) => [
    {
      icon: 'share-social-outline',
      text: 'Share Listing',
      onPress: () => {
        console.log('Sharing listing:', item._id);
        handleShareListing(item._id);
        setActiveItemId(null);
      },
    },
    {
      icon: 'pencil-outline',
      text: 'Edit Listing',
      onPress: () => {
        navigation.navigate('ListingStack', {
          screen: 'CreateNewListingScreen',
          params: {
            isEditing: true, 
            listing: item,
            fromAccount: true, // To hide the bottom tab when navigating from here.
          },
        });
        setActiveItemId(null);
      },
    },
    {
      icon: 'checkmark-circle-outline',
      text: 'Mark as Sold',
      onPress: () => {
        Alert.alert(
          'Confirm',
          'Are you sure you want to mark this listing as sold, it cannot be undone?',
          [
            {
              text: 'Yes',
              onPress: async () => {
                markAsSold(item._id)
                setActiveItemId(null); // Close the action sheet only after confirming
              },
            },
            {
              text: 'No',
              onPress: () => console.log('Cancelled marking as sold'),
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
      },
    },
    {
      icon: 'trash-outline',
      text: 'Delete Listing',
      onPress: () => {
        Alert.alert(
          'Confirm',
          'Are you sure you want to delete this listing, it cannot be undone?',
          [
            {
              text: 'Yes',
              onPress: async () => {
                handleDeleteListing(item._id);
                setActiveItemId(null); // Close the action sheet only after confirming
              },
            },
            {
              text: 'No',
              onPress: () => console.log('Cancelled delete'),
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
      },
    },
  ];

  const handleOpenActionSheet = (item) => {
    setActiveItemId(item._id); 
  };

  // Using callback t omemoize the component to prevent unnecessary re-renders of list items if their props haven't changed
  const renderItem = React.useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.listingItem} 
      onPress={() =>  navigation.navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { item }
      })}
    >
      <Image source={{ uri: item.imageUrls[0] }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.listingDetails}>
        {`$${item.price.toFixed(2)}`} · {item.state} · Created on: {new Date(item.dateCreated).toLocaleDateString()}
      </Text>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOpenActionSheet(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="grey" />
      </TouchableOpacity>
    </TouchableOpacity>
   ), [navigation]);

  const actionSheetOptions = listings
  .filter(item => item._id === activeItemId)
  .map(item => getActionSheetOptions(item))[0] || [];

  return (
    <View style={styles.container}>
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
          <ButtonComponent iconName="create-outline" type="primary" title="Start Selling"
            onPress={() => navigation.navigate('ListingStack', {
              screen: 'CreateNewListingScreen',
              params: {
                isEditing: false, 
                fromAccount: true, // To hide the bottom tab when navigating from here.
              },
            })}
            style={{ marginTop: 50 }}
          />
        </View>
      ) : (
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        //ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      )}
      <CustomActionSheet
        isVisible={activeItemId !== null}
        onClose={() => setActiveItemId(null)}
        options={actionSheetOptions}
      />       
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.2; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8, // Rounded corners for the card
    padding: spacing.size10,
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size10, // Space between cards
  },
  listingImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 8,
    marginRight: spacing.size10,
  },
  listingInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.size10,
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  listingDetails: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  optionsButton: {
    padding: spacing.size10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.inputBorder,
    margin: spacing.xs
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

const getListingUrl = (listingId) => {
  return `localmart://listing/view/${listingId}`;
  //return `https://www.localmart.com/listing/${listingId}`;
};

export default ViewMyListingScreen;


/*
Error Handling: The screen should handle potential errors while fetching listings, such as showing an error message or a retry button.

Loading State: Consider adding a loading indicator while the listings are being fetched.

Empty State: Display a message when the user has no listings.

Styling: Adjust the styling according to your app's design theme.

Image Handling: The code assumes that the first image URL in the imageUrls array is the main image for the listing. Make sure this aligns with your data structure. Also, handle cases where an image might not be available.

Navigation Parameters: When navigating to the ViewListing screen, pass the necessary parameters (e.g., listingId) that the ViewListing screen might require to fetch and display the specific listing details.


*/
