import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import FullScreenImageModal from '../components/FullScreenImageModal';

const SellerDetails = ({ route, navigation }) => {
    const { sellerProfile, ratingsWithProfile, averageRating } = route.params;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [sellerImageLoadError, setSellerImageLoadError] = useState(false);
    const topThreeRatingsWithProfile = ratingsWithProfile.slice(0, 3); // Get top 3 ratings
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const STOCK_IMAGE_URI = require('../assets/stock-image.png'); 

    const openImageModal = () => {
      setIsModalVisible(true);
    };
    
    const navigateToAllRatings = () => {
        navigation.navigate('AllReviewsScreen', { sellerProfile, ratingsWithProfile, averageRating }); // Navigate to a screen that shows all ratings
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

    return (
      <ScrollView style={styles.container}>
        {/* Section 1: Seller Info */}
        <View style={styles.section}>
        <TouchableOpacity  activeOpacity={1} onPress={openImageModal} style={styles.imageContainer}>
            <Image 
              source={
                sellerImageLoadError || !sellerProfile.profilePicture
                  ? STOCK_IMAGE_URI
                  : { uri: sellerProfile.profilePicture }
              }
              style={styles.sellerImage}
              onError={() => setSellerImageLoadError(true)}
            />
          </TouchableOpacity>
          <Text style={styles.sellerName}>{sellerProfile.userId.userName}</Text>
          {sellerProfile.aboutMe && (
            <Text style={styles.sellerDescription}>{sellerProfile.aboutMe}</Text>
          )}
        </View>

        <View style={styles.separator} />

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
                        imageErrors[ratingWithProfile.ratedByProfilePicture] || !ratingWithProfile.ratedByProfilePicture ? STOCK_IMAGE_URI : { uri: ratingWithProfile.ratedByProfilePicture }
                      }
                      style={styles.raterImage}
                      onError={() => handleImageError(ratingWithProfile.ratedByProfilePicture)} // Handle error for this specific image URI
                    />                 
                    <View style={styles.ratingDetails}>
                      <View style={styles.ratingInfo}>
                          <Text style={styles.raterName}>{ratingWithProfile.ratedBy.userName}</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More listings from this seller</Text>
          {/* Placeholder for listings component */}
        </View>
        </View>

        <FullScreenImageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          imageUrls={[sellerProfile.profilePicture || STOCK_IMAGE_URI]} // Pass the seller's profile picture or stock image
        />
      </ScrollView>
    );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
    },
    bottomContainer: {
      padding: spacing.size10,
    },
    separator: {
      height: 2,
      backgroundColor: colors.separatorColor,
      marginBottom: spacing.size10,
      marginTop: spacing.size10,
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
      paddingBottom: spacing.size10,
    },
    averageRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    totalRatings: {
        fontSize: 14,
        color: 'grey',
        marginLeft: 8,
    },
    sellerImage: {
      width: '100%', // Make the image span the full width of its container
      height: 200, // Set a fixed height, or use a percentage like '30%' for relative sizing
    },
    sellerName: {
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 5,
      paddingLeft: spacing.size10,
      paddingTop: spacing.size10,
    },
    sellerDescription: {
      fontSize: typography.body,
      color: colors.secondaryText,
      paddingLeft: spacing.size10,
    },
    averageRating: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    ratingsSection: {
        //padding: 10,
    },
    ratingItem: {
        //padding: 10,
      },
      ratingInfo: {
        // Aligns name and stars vertically
      },
      ratingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
      },
      raterImage: {
        width: 40,
        height: 40,
        borderRadius: 20, // To make it circular
        marginRight: 10,
      },
      ratingDetails: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //marginLeft: 10,
      },
      raterName: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,  // Allocate remaining space to name
        paddingBottom: 5,
      },
      ratingDate: {
        fontSize: 12,
        color: 'grey',
      },
      ratingText: {
        fontSize: 14,
        color: 'black',
        //paddingTop: 5,
        paddingBottom: 10
      },
      seeMoreText:{
        color: 'blue',
        marginTop: 5,
      }
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

export default SellerDetails;
