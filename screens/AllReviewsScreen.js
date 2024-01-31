import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../components/StarRating';
import useHideBottomTab from '../utils/HideBottomTab'; 

const AllReviewsScreen = ({ route, navigation }) => {
    const { sellerProfile, ratingsWithProfile, averageRating } = route.params;

    useHideBottomTab(navigation, true);

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
      

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    section: {
      padding: 10,
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
      marginTop: 10,
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
      //paddingTop: 5,
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
      paddingTop: 10,
      paddingBottom: 10
    },
    separator: {
      height: 1,
      backgroundColor: '#e0e0e0',
      //marginVertical: 10,
    },
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

export default AllReviewsScreen;
