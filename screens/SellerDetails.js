import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 

const SellerDetails = ({ route, navigation }) => {
    const { sellerProfile, ratingsWithProfile, averageRating } = route.params;
    const topThreeRatingsWithProfile = ratingsWithProfile.slice(0, 3); // Get top 3 ratings

    // Hide the bottom tab 
    useHideBottomTab(navigation, true);
    

    const navigateToAllRatings = () => {
        navigation.navigate('AllReviewsScreen', { sellerProfile, ratingsWithProfile, averageRating }); // Navigate to a screen that shows all ratings
    };

    return (
      <ScrollView style={styles.container}>
        {/* Section 1: Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Info</Text>
          <Image source={{ uri: sellerProfile.profilePicture }} style={styles.sellerImage} />
          <Text style={styles.sellerName}>{ratingsWithProfile[0].ratedUser.userName}</Text>
          <Text style={styles.sellerName}>{sellerProfile.aboutMe}</Text>
          {/* Display ratings */}
        </View>

        <View style={styles.separator} />

        {/* Section 2: Seller Ratings Info */}
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
                            source={{ uri: ratingWithProfile.ratedByProfilePicture }} 
                            style={styles.raterImage} 
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

        {/* Section 3: More Listings from this Seller */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More listings from this seller</Text>
          {/* Placeholder for listings component */}
        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        //marginVertical: 10,
      },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    sellerName: {
      fontSize: 16,
      marginTop: 10,
    },
      averageRating: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    ratingsSection: {
        padding: 10,
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
