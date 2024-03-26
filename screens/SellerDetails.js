import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import FullScreenImageModal from '../components/FullScreenImageModal';
import ListingItem from '../components/ListingItem';
import { getListingsByUser } from '../api/ListingsService'; 
import { AuthContext } from '../AuthContext';
import { DEFAULT_IMAGE_URI } from '../constants/AppConstants'


const SellerDetails = ({ route, navigation }) => {
    const { sellerProfile, ratingsWithProfile, averageRating } = route.params;
    const { logout } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [sellerImageLoadError, setSellerImageLoadError] = useState(false);
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false); // Track whether listings have been loaded
    const topThreeRatingsWithProfile = ratingsWithProfile.slice(0, 3); // Get top 3 ratings
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const errorMessageTitle = "No Listings Found";
    const errorMessageDetails = "Failed to load seller listings";
    const emptyListingsMessage = "This seller does not have other listings. LocalMart is a growing marketplace, please try again later.";

    const formatJoinedDate = (dateString) => {
      const date = new Date(dateString);
      const options = { month: 'short', year: 'numeric' };
      return date.toLocaleString('en-US', options);
    };

    const openImageModal = () => {
      setIsModalVisible(true);
    };
    
    const navigateToAllRatings = () => {
        navigation.navigate('AllReviewsScreen', {ratingsWithProfile, averageRating }); // Navigate to a screen that shows all ratings
    };

    // Function to handle image load error
    const handleImageError = (imageId) => {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [imageId]: true, // Mark this image as errored
      }));
    };

    // Hide the bottom tab 
    useHideBottomTab(navigation, true);

    useEffect(() => {
      const loadListings = async () => {
        setError(null); // Reset the error state
        setLoading(true);
        setLoaded(false); // Reset loaded before fetching
        try {
          const data = await getListingsByUser(sellerProfile.userId._id);
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
          } else if (error.message.includes('RefreshTokenExpired')) {
            logout();
          } 
          setError(errorMessage);
          setLoading(false);
        } finally {
          setLoaded(true); // Set loaded to true after fetching, regardless of the outcome
        }
      };
  
      loadListings();
    }, [sellerProfile.userId]);

    const ListHeader = () => (
      <>
        <View style={styles.topSection}>
        <TouchableOpacity  activeOpacity={1} onPress={openImageModal} style={styles.imageContainer}>
            <Image 
              source={
                sellerImageLoadError || !sellerProfile.profilePicture
                  ? DEFAULT_IMAGE_URI
                  : { uri: sellerProfile.profilePicture }
              }
              style={styles.sellerImage}
              onError={() => setSellerImageLoadError(true)}
            />
          </TouchableOpacity>
          <Text style={styles.sellerName}>{sellerProfile.userId.displayName}</Text>
          <Text style={styles.dateJoined}>Joined {formatJoinedDate(sellerProfile.userId.date)}</Text>
          {sellerProfile.aboutMe && (
            <Text style={styles.sellerDescription}>{sellerProfile.aboutMe}</Text>
          )}
        </View>


        {/* Section 2: Seller Ratings Info */}
        <View style={styles.bottomContainer}>
        {ratingsWithProfile.length > 0 ? (
          <>
        <TouchableOpacity onPress={navigateToAllRatings} style={styles.ratingsSection}>
          <View style={styles.section}>
              <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Ratings</Text>
                  <Ionicons name="chevron-forward" size={20} color="grey" />
              </View>
              <View style={styles.averageRatingContainer}>
                <StarRating rating={averageRating.toFixed(1)} />
                <Text style={styles.totalRatings}>
                    ({ratingsWithProfile.length} ratings)
                </Text>
              </View>
            

            {/* TODO add logic to show placeholder image when profile image does not exist */}
            {topThreeRatingsWithProfile.map((ratingWithProfile, index) => (
              <View key={index} style={styles.ratingItem}>
                  <View style={styles.separator} />
                  <View style={styles.ratingHeader}>
                    <Image
                      source={
                        imageErrors[ratingWithProfile.ratedByProfilePicture] || !ratingWithProfile.ratedByProfilePicture ? DEFAULT_IMAGE_URI : { uri: ratingWithProfile.ratedByProfilePicture }
                      }
                      style={styles.raterImage}
                      onError={() => handleImageError(ratingWithProfile.ratedByProfilePicture)} // Handle error for this specific image URI
                    />                 
                    <View style={styles.ratingDetails}>
                      <View style={styles.ratingInfo}>
                          <Text style={styles.raterName}>{ratingWithProfile.ratedBy.displayName}</Text>
                          <StarRating rating={ratingWithProfile.stars} size={16} />
                      </View>
                      <Text style={styles.ratingDate}>{formatDate(ratingWithProfile.dateGiven)}</Text>
                    </View>
                  </View>

                  <Text 
                  style={styles.ratingText} 
                  numberOfLines={3} 
                  ellipsizeMode='tail'
                  >
                  {ratingWithProfile.text}
                  </Text>

                  {ratingWithProfile.text.length > 100 && ( // Assuming 100 characters as the cutoff
                  <Text style={styles.seeMoreText}>See more</Text>
                  )}

              </View>
            ))}
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        </>
        ) : (
          <>
            <View style={styles.ratingsSection}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Ratings</Text>
                </View>
                <View style={styles.averageRatingContainer}>
                  <StarRating rating={averageRating.toFixed(1)} />
                  <Text style={styles.totalRatings}>
                      ({ratingsWithProfile.length} ratings)
                  </Text>
                </View>
              
              </View>
            </View>
          <View style={styles.separator} />
          </>
        )}

        {/* Section 3: More Listings from this Seller */}
          <Text style={styles.sectionTitle}>More listings from this seller</Text>
      </View>
    </>
  );


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={({ item }) => (
            <ListingItem
              item={item}
              onPress={() => navigation.navigate('ViewListingFromSeller', { item })}
            />
          )}
          keyExtractor={item => item._id ? item._id.toString() : Math.random().toString()}
          numColumns={2}
          ListHeaderComponent={ListHeader}
        />
      )}

      <FullScreenImageModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        imageUrls={[sellerProfile.profilePicture || DEFAULT_IMAGE_URI]}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.1; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
    },
    topSection: {
      backgroundColor: colors.white,
      paddingTop: spacing.size10Vertical,
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22, // Shadow opacity
      shadowRadius: 2.22, // Shadow blur radius
      elevation: 3, // Elevation for Android
    },
    bottomContainer: {
    },
    separator: {
      height: 1,
      backgroundColor: colors.separatorColor,
      marginBottom: spacing.size10Vertical,
      marginTop: spacing.size10Vertical,
      },
    section: {
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: typography.heading,
      fontWeight: 'bold',
      color: colors.headingColor, 
      paddingBottom: spacing.size10Vertical,
      paddingLeft: spacing.size10Horizontal,
    },
    averageRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.size10Vertical,
    },
    totalRatings: {
        fontSize: typography.subHeading,
        color: colors.darkGrey,
        marginLeft: spacing.size10Horizontal,
    },
    sellerImage: {
      width: '100%', // Make the image span the full width of its container
      height: 200, // Set a fixed height, or use a percentage like '30%' for relative sizing
    },
    sellerName: {
      fontSize: typography.pageTitle,
      fontWeight: 'bold',
      paddingBottom: spacing.size5Vertical,
      paddingLeft: spacing.size10Horizontal,
      paddingTop: spacing.size10Vertical,
    },
    dateJoined: {
      fontSize: typography.subHeading,
      paddingBottom: spacing.size5Vertical,
      paddingLeft: spacing.size10Horizontal,
    },
    sellerDescription: {
      fontSize: typography.subHeading,
      color: colors.secondaryText,
      paddingTop: spacing.size10Vertical,
      paddingLeft: spacing.size10Horizontal,
      paddingBottom: spacing.size10Vertical,
    },
    averageRating: {
      fontSize: typography.body,
      fontWeight: 'bold',
    },
    ratingsSection: {
      marginTop: spacing.size10Vertical,
      backgroundColor: colors.white, // Use a light color for the section background
      padding: spacing.size10Horizontal, // Internal padding for the section content
      marginBottom: spacing.size10Vertical, // Space between sections
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22, // Shadow opacity
      shadowRadius: 2.22, // Shadow blur radius
      elevation: 3, // Elevation for Android
    },
    ratingItem: {
    },
    ratingInfo: {
      // Aligns name and stars vertically
    },
    ratingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.size10Vertical,
      paddingBottom: spacing.size10Vertical
    },
    raterImage: {
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize/2, // To make it circular
      marginRight: spacing.size10Horizontal,
    },
    ratingDetails: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    raterName: {
      fontWeight: 'bold',
      fontSize: typography.body,
      flex: 1,  // Allocate remaining space to name
      paddingBottom: spacing.size5Vertical,
    },
    ratingDate: {
      fontSize: typography.caption,
      color: colors.darkGrey,
    },
    ratingText: {
      fontSize: typography.subHeading,
      color: 'black',
      paddingBottom: spacing.size10Vertical,
    },
    seeMoreText:{
      color: 'blue',
      marginTop: spacing.size5Vertical,
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default SellerDetails;
