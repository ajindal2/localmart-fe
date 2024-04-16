import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import { DEFAULT_IMAGE_URI } from '../constants/AppConstants'
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import TagsSummary from '../components/TagsSummary';
import ExpandingTextComponent from '../components/ExpandingTextComponent';


const AllReviewsScreen = ({ route, navigation }) => {
  const isConnected = useNetworkConnectivity();
    const { ratingsWithProfile, averageRating, tagsSummary } = route.params;
    const [imageErrors, setImageErrors] = useState({});
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const errorMessageTitle = "No Ratings Found";
    const emptyRatingsMessage = "You dont have any ratings yet";
    
    useHideBottomTab(navigation, true);

    // Function to handle image load error
    const handleImageError = (imageId) => {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [imageId]: true, // Mark this image as errored
      }));
    };

    if (!isConnected) {
      return (
        <View style={styles.container}>
          <NoInternetComponent/>
        </View>
      );
    }

    return (
        <ScrollView style={styles.container}>
          {(!ratingsWithProfile || ratingsWithProfile.length === 0) ? (
              <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>{errorMessageTitle}</Text>
              <Text style={styles.errorMessage}>{emptyRatingsMessage}</Text>
            </View>
          ) : (
            <>
            {/* Section 1: Reviews summary */}
            <View style={styles.topSection}>
              <View style={styles.header}>
                <Text style={styles.totalReviews}>{ratingsWithProfile.length} Reviews</Text>
              </View>
              <View style={styles.ratingContainer}>
                <StarRating rating={averageRating} size={typography.iconSize} />
                <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
              </View>
              <TagsSummary tagsSummary={tagsSummary} />
            </View>

            {/* Section 2: Individual Reviews */}
            <View style={styles.section}>
            {ratingsWithProfile.map((ratingWithProfile, index) => (
                <View key={index} style={styles.ratingItem}>
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
                                <StarRating rating={ratingWithProfile.stars} size={typography.iconSmall} />
                            </View>
                        <Text style={styles.ratingDate}>{formatDate(ratingWithProfile.dateGiven)}</Text>
                        </View>
                    </View>

                    {ratingWithProfile.text && ratingWithProfile.text.trim().length > 0 && (
                      <ExpandingTextComponent description={ratingWithProfile.text} />
                    )}
                </View>
                ))}
            </View>
      </>
    )}
  </ScrollView>
    );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.12; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
    },
    section: {
    },
    topSection: {
      backgroundColor: '#fff',
      paddingTop: spacing.size10Vertical,
      paddingLeft: spacing.size10Horizontal,
      paddingBottom: spacing.size10Vertical,
      marginBottom: spacing.size10Vertical,
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22, // Shadow opacity
      shadowRadius: 2.22, // Shadow blur radius
      elevation: 3, // Elevation for Android
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalReviews: {
      fontSize: typography.heading,
      fontWeight: 'bold',
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.size5Horizontal,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 20,
    },
    filterText: {
      marginLeft: spacing.size5Horizontal,
      fontSize: typography.body,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.size5Vertical,
    },
    averageRatingText: {
      marginLeft: spacing.size10Horizontal,
      fontSize: typography.body,
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
      paddingBottom:spacing.size10Vertical,
    },
    raterName: {
      fontWeight: 'bold',
      fontSize: typography.body,
      paddingBottom: spacing.size5Vertical,
    },
    ratingDate: {
      fontSize: typography.caption,
      color: colors.darkGrey,
    },
    ratingText: {
      fontSize: typography.subHeading,
      color: 'black',
      paddingTop: spacing.size10Vertical,
      paddingBottom: spacing.size10Vertical,
    },
    seeMoreText:{
      color: 'blue',
      marginTop: spacing.size5Vertical,
    },
    ratingItem: {
      margin: spacing.size5Horizontal,
      backgroundColor: colors.white, // Use a light color for the section background
      borderRadius: 8, // Rounded corners for the section
      padding: spacing.size10Horizontal, // Internal padding for the section content
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22, // Shadow opacity
      shadowRadius: 2.22, // Shadow blur radius
      elevation: 3, // Elevation for Android
    },
    ratingInfo: {
      // Aligns name and stars vertically
    },
    ratingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      height: 2,
      backgroundColor: colors.separatorColor,
      marginBottom: spacing.size10Vertical,
      marginTop: spacing.size10Vertical,
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

export default AllReviewsScreen;
