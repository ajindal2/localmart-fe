import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';


const AllReviewsScreen = ({ route, navigation }) => {
    const { sellerProfile, ratingsWithProfile, averageRating } = route.params;
    const [imageErrors, setImageErrors] = useState({});
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const STOCK_IMAGE_URI = require('../assets/stock-image.png'); 

    useHideBottomTab(navigation, true);

    // Function to handle image load error
    const handleImageError = (imageId) => {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [imageId]: true, // Mark this image as errored
      }));
    };

    return (
        <ScrollView style={styles.container}>
            {/* Section 1: Reviews summary */}
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.totalReviews}>{ratingsWithProfile.length} Reviews</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => {/* Filter logic */}}>
                    <Ionicons name="filter" size={20} color="black" />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.ratingContainer}>
                <StarRating rating={averageRating} size={20} />
                <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
              </View>
            </View>

            {/* Section 2: Individual Reviews */}
            <View style={styles.section}>
            {ratingsWithProfile.map((ratingWithProfile, index) => (
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
        </ScrollView>
    );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
      padding: spacing.size10,
    },
    section: {
      //padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalReviews: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 20,
    },
    filterText: {
      marginLeft: 5,
      fontSize: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    averageRatingText: {
      marginLeft: 10,
      fontSize: 16,
    },
    raterImage: {
      width: 50,
      height: 50,
      borderRadius: 25, // To make it circular
      marginRight: 10,
    },
    ratingDetails: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom:10,
      //marginLeft: 10,
    },
    raterName: {
      fontWeight: 'bold',
      fontSize: 16,
      paddingBottom: 5
      //flex: 1,  // Allocate remaining space to name
    },
    ratingDate: {
      fontSize: 12,
      color: 'grey',
    },
    ratingText: {
      fontSize: 14,
      color: 'black',
      paddingTop: 10,
      paddingBottom: 10
    },
    seeMoreText:{
      color: 'blue',
      marginTop: 5,
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
      //paddingTop: 10,
      //paddingBottom: 10
    },
    separator: {
      height: 2,
      backgroundColor: colors.separatorColor,
      marginBottom: spacing.size10,
      marginTop: spacing.size10,
    },
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

export default AllReviewsScreen;
