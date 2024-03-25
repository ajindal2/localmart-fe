import React, { useCallback, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { getSavedListings, deleteSavedListing } from '../api/SavedListingService'; 
import useHideBottomTab from '../utils/HideBottomTab'; 
import CustomActionSheet from '../components/CustomActionSheet'; 
import { useTheme } from '../components/ThemeContext';
import ButtonComponent from '../components/ButtonComponent';
import shareListing from '../utils/ShareListing';


const SavedItems = ({navigation, route}) => {
  const { user, logout } = useContext(AuthContext);
  const [savedListings, setSavedListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
  const [activeItemId, setActiveItemId] = useState(null);
  const fromAccount = route.params?.fromAccount;
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const errorMessageTitle = "No Listings Found";
  const errorMessageDetails = "We're experiencing some problems on our end. Please try again later.";
  const emptyListingsMessage = "You dont have any saved listings at this time.";

  const fetchSavedListings = async () => {
    setError(null); // Reset the error state
    setLoading(true);
    setLoaded(false); // Reset loaded before fetching
    try {
      const data = await getSavedListings(user._id); // Fetch saved listings from backend
      setSavedListings(data);
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

  useHideBottomTab(navigation, fromAccount);

  useFocusEffect(
    useCallback(() => {
      fetchSavedListings();
    }, [user._id])
  );

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
      icon: 'trash-outline',
      text: 'Unsave Listing',
      onPress: () => {
        unsaveListing(item);
        setActiveItemId(null);
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
      onPress={() => {
        if (item.listing) {
          navigation.navigate('ViewListingStack', { 
            screen: 'ViewListing', 
            params: { item: item.listing }
          });
        } else {
          console.log('Listing is null, navigation aborted');
          // Optionally, you can show an alert or a toast message here
        }
      }}
    >
    <Image source={{ uri: item.listing.imageUrls[0] }} style={styles.image} />
    <View style={styles.listingInfo}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.listing.title}
      </Text>
      <Text style={styles.price}>${item.listing.price}</Text>
      <Text style={styles.state}> {item.listing.state}</Text>
    </View>
    <TouchableOpacity style={styles.optionsButton} onPress={() => handleOpenActionSheet(item)}>
      <Ionicons name="ellipsis-vertical" size={20} color="grey" />
    </TouchableOpacity>

    </TouchableOpacity>
 ), [navigation]);


  const unsaveListing = async (item) => {
    try {
      await deleteSavedListing(item._id); // API call to unsave the listing
      // Update the state to remove the unsaved item
      setSavedListings(currentSavedListings => 
        currentSavedListings.filter(listing => listing._id !== item._id)
      );
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        console.error('Error unsaving listing:', error);
        Alert.alert('Error', 'Error unsaving listing, please try again later.');
      }
    }
  };

  const formatDate = (dateString) => {
    // Format the date string into a more readable format
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const actionSheetOptions = savedListings
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
      ) : savedListings.length === 0 && loaded ? ( // Check if listings are empty and loaded
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
          <Text style={styles.errorMessage}>{emptyListingsMessage}</Text>
          <ButtonComponent iconName="home-outline" type="primary" title="Start Exploring"
            onPress={() => navigation.navigate('HomeScreen')}
            style={{ marginTop: spacing.sizeExtraLarge }}
          />
        </View>
      ) : (
      <FlatList
        data={savedListings}
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
  image: {
    width: imageSize, 
    height: imageSize, 
    borderRadius: imageSize / 8, 
    marginRight: spacing.size10Horizontal,
  },
  listingInfo: {
    flex: 1,
    marginLeft: spacing.size10Horizontal,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  price: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  state: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  optionsButton: {
    padding: spacing.size10Horizontal,
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

const getListingUrl = (listingId) => {
  return `localmart://listing/view/${listingId}`;
  //return `https://www.localmart.com/listing/${listingId}`;
};

export default SavedItems;
