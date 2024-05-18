import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../AuthContext'; 
import { getListingsByUser, deleteListing, updateListingStatus } from '../../api/ListingsService'; 
import { getBuyerInfoByListingId } from '../../api/ChatRestService';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import CustomActionSheet from '../../components/CustomActionSheet'; 
import { useTheme } from '../../components/ThemeContext';
import ButtonComponent from '../../components/ButtonComponent';
import { useFocusEffect } from '@react-navigation/native'; 
import shareListing from '../../utils/ShareListing';
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';


const ViewMyListingScreen = ({navigation}) => {
  const isConnected = useNetworkConnectivity();
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
        if (!user) {
          console.error('User is null, cannot loadListings');
          return; // Exit the function if there's no user
        }

        setError(null); // Reset the error state
        setLoading(true);
        setLoaded(false); // Reset loaded before fetching
        try {
          const fetchedListings = await getListingsByUser(user._id);
          setListings(fetchedListings);
          setLoading(false);
        } catch (error) {
          if (error.message.includes('RefreshTokenExpired')) {
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
    }, [user])
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

  const markAsSold = async (listing) => {
    try {
      await updateListingStatus(listing._id, 'Sold');
      const updatedListings = listings.map(item =>
        item._id === listing._id ? { ...item, status: 'Sold' } : item
      );
      setListings(updatedListings);
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        console.error(`Error marking listing ${listing} as sold:`, error);
        Alert.alert('Error', 'Error updating status, please try again later.');
      }
    }

    try {
      if(user) {
        const buyers = await getBuyerInfoByListingId(listing._id, user._id)
        if (buyers && buyers.length > 0) {
          // Buyers found, navigate to BuyerConfirmationScreen
          navigation.navigate('BuyerConfirmationScreen', { buyers, listing });
        } 
      }
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        // Just log and do nothing. User can start rating flow from this page later.
        console.error(`Error getting buyer details after marking as sold for user ${user._id} and listing ${listing._id}`, error);
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
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        console.error(`Error deleting listing ${listingId}`, error);
        Alert.alert('Error', 'Error deleting listing, please try again later.');
      }
    }
  };

  const handleRateMoreBuyers = async (listing) => {
    try{
      if (user) {
        const buyers = await getBuyerInfoByListingId(listing._id, user._id)
        if (buyers && buyers.length > 0) {
          // Buyers found, navigate to BuyerConfirmationScreen
          navigation.navigate('BuyerConfirmationScreen', { buyers, listing });
        }
        else {
          Alert.alert('Error', 'No buyers found for this listing');
        }
      }
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        console.error(`Error handling RateMoreBuyers for user ${user._id} and listing ${listing._id}`, error);
        Alert.alert('Error', 'An unknown error occured, please try again later.');
      }
    }
  };

  // Handle share listing action
  const handleShareListing = (listingId) => {
    const listingTitle = 'Check this Item for Sale!';
    const listingUrl = getListingUrl(listingId);
    shareListing(listingTitle, listingUrl);
  };

  const getActionSheetOptions = (item) => {
    let options = [
      {
        icon: 'share-social-outline',
        text: 'Share Listing',
        onPress: () => {
          handleShareListing(item._id);
          setActiveItemId(null);
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
                onPress: () => console.log('Cancelled delete listing'),
                style: 'cancel',
              },
            ],
            { cancelable: false }
          );
        },
      },
    ];
    if (item.state.toLowerCase() !== 'sold') {
      options.push({
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
      });

      options.push({
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
                  markAsSold(item)
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
      });
    }
    return options;
  };

  const handleOpenActionSheet = (item) => {
    setActiveItemId(item._id); 
  };

  // Using callback to memoize the component to prevent unnecessary re-renders of list items if their props haven't changed
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
          {`$${item.price.toFixed(2)}`}
          <Text style={styles.dot}> · </Text>
          {item.state}
          <Text style={styles.dot}> · </Text>
          Created on: {new Date(item.dateCreated).toLocaleDateString()}
        </Text>
        {item.state.toLowerCase() === 'sold' && (
          <ButtonComponent title="Rate More Buyers" type="secondary" 
            onPress={() => handleRateMoreBuyers(item)} 
            style={styles.rateMoreBuyersButton}
          />
        )}
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOpenActionSheet(item)}>
        <Ionicons name="ellipsis-vertical" size={typography.iconSize} color={colors.darkGrey} />
      </TouchableOpacity>
    </TouchableOpacity>
   ), [navigation]);

  const actionSheetOptions = listings
  .filter(item => item._id === activeItemId)
  .map(item => getActionSheetOptions(item))[0] || [];

  const handlePress = React.useCallback(() => {
    navigation.navigate('ListingStack', {
      screen: 'CreateNewListingScreen',
      params: {
        isEditing: false, 
        fromAccount: true, // To hide the bottom tab when navigating from here.
      },
    });
  }, [navigation]);


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

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
            onPress={handlePress}
            style={{ marginTop: spacing.sizeExtraLarge }}
          />
        </View>
      ) : (
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
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
    padding: spacing.size10Horizontal,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.size10Horizontal,
  },
  createButtonText: {
    marginLeft: spacing.size5Horizontal,
    color: 'black',
  },
  rateMoreBuyersButton: {
    alignSelf: 'flex-start', 
    paddingVertical: 2, 
    paddingHorizontal: spacing.size10Horizontal, 
    marginTop: spacing.size10Vertical,
  },
  listingItem: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: spacing.sm, // Rounded corners for the card
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size10Vertical, // Space between cards
  },
  listingImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 8,
    marginRight: spacing.size10Horizontal,
  },
  listingInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.size10Horizontal,
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  listingDetails: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
    //fontWeight: 'bold',
  },
  optionsButton: {
    padding: spacing.size10Horizontal,
  },
  separator: {
    height: 1,
    backgroundColor: colors.inputBorder,
    margin: spacing.xs
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
  dot: {
    fontSize: typography.heading,
    fontWeight: 'bold', 
  }
});

const getListingUrl = (listingId) => {
  return `https://farmvox.com/listing/view/${listingId}`;
};

export default ViewMyListingScreen;
