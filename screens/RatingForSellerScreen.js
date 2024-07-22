import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import StarRating from '../components/StarRating'; 
import { DEFAULT_IMAGE_URI } from '../constants/AppConstants';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import useHideBottomTab from '../utils/HideBottomTab'; 
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { useTheme } from '../components/ThemeContext';
import { AuthContext } from '../AuthContext'; 
import { createRating } from '../api/RatingsService';
import { getSeller } from '../api/SellerService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const RatingForSellerScreen = ({ navigation, route }) => {
  const isConnected = useNetworkConnectivity();
  const { user, logout } = useContext(AuthContext); 
  const { listing, buyerId } = route.params; 
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listingDetails, setListingDetails] = useState('');
  const [sellerDetails, setSellerDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const positiveTags =  ['On Time', 'Friendly', 'Communicative', 'Quality of Product'];
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press

  useHideBottomTab(navigation, true);

  const handleTagSelect = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };


  const handleCreateRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting.');
      return; // Exit the function if no rating is selected
    }

    setIsCreating(true); 

    //The logged in user should be same as the buyer
    if (user && user._id === buyerId._id) {
      const ratingDetails = {
        role: 'seller',
        listingId: listing._id, 
        ratedBy: user._id, 
        ratedUser: sellerDetails.userId, 
        stars: rating,
        text: review,
        tags: selectedTags, 
      };
    
      try {
        const createdRating = await createRating(ratingDetails);
        Alert.alert('Rating created successfully');
        navigation.goBack();
      } catch (error) {
        console.error('Failed to submit rating:', error);
        if (error.message.includes('RefreshTokenExpired')) {
          await logout();
        } else if (error.message.includes('Rating already exists')) {
          Alert.alert('Error', 'The rating for this seller is already recorded');
        }  else {
          Alert.alert('Error', 'An unknown error occured, please try again later.');
        }
      } finally {
        setIsCreating(false); 
      }
    }
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setIsLoading(true);
        if(listing) {
          const sellerDetails = await getSeller(listing.sellerId);
          setSellerDetails(sellerDetails);
        }
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to fetch listing details:', err);
        setError('Failed to fetch listing details');
      } finally {
        setIsLoading(false);
      }
    };
    if (listing) {
      fetchListingDetails();
    }
  }, [listing]); // Dependency array to re-run the effect if listing changes

  const ListingHeader = React.memo(({ listing }) => {
    if (!listing) return null; // Return null if listing details aren't provided
  
    return (
      <View>
        <View style={styles.headerContainer}>
          <Image source={{ uri: listing.imageUrls[0] }} style={styles.listingImage} />
          <View style={styles.listingDetails}>
            <Text style={styles.listingTitle} numberOfLines={1} ellipsizeMode="tail">
              {listing.title}
              {listing.state && listing.state.toLowerCase() === 'sold' ? ' (Sold)' : ''}
            </Text>
            <Text style={styles.listingPrice}>
              {listing.price === 0 ? 'FREE' : `$${listing.price.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
    );
  });
  

  let buttonTitle = isCreating ? "Processing..." : "Submit Rating";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
       {isLoading ? (
         <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
        <>
          <ListingHeader/>
          <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <Image source={sellerDetails.profilePicture ? { uri: sellerDetails.profilePicture } : DEFAULT_IMAGE_URI} style={styles.profileImage} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>How was your experience buying from {sellerDetails.displayName}?</Text>
            </View>
            <StarRating rating={rating} onRatingChange={setRating} size={30} />
            
            {/* Conditionally render tags only if a rating has been selected (rating > 0) */}
            {rating > 0 && (
              <>
                {/* Render tags for high rating */}
                {rating > 3 && (
                  <View style={styles.tagsContainer}>
                    {positiveTags.map((tag, index) => (
                      <TouchableOpacity key={index} onPress={() => handleTagSelect(tag)} style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
            
            <InputComponent
              placeholder="Write a review (optional)"
              multiline
              value={review}
              onChangeText={setReview}          
              style={styles.textInput}
              editable={true}
              textAlignVertical="top"
            />
            
            <View style={styles.bottomButtonContainer}>
              <ButtonComponent 
              title={buttonTitle}
              disabled={isCreating}
              loading={isCreating}
              type="primary"  
              onPress={handleCreateRating} 
              style={{ flexDirection: 'row' }} />
            </View>
          </KeyboardAwareScrollView>
        </>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.4; 
const listingImageSize = width * 0.15; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
   // flex: 1,
    alignItems: 'center',
    padding: spacing.size20Horizontal,
  },
  bottomButtonContainer: {
    position: 'absolute', // Position the button container absolutely
     bottom: 0, // At the bottom of the parent container
     left: 0,
     right: 0,
     padding: spacing.size10Horizontal,
   },
   titleContainer: {
    width: '100%', // Ensures the container spans the entire width
    alignItems: 'center', // Centers content horizontally in flex container
  },
  title: {
    fontSize: typography.pageTitle,
    fontWeight: 'bold',
    marginBottom: spacing.size20Vertical,
    textAlign: 'center', // Centers the text inside the Text component
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: spacing.size20Vertical,
  },
  errorText: {
    fontSize: typography.subHeading,
    color: colors.secondaryText,
    marginTop: spacing.size10Vertical,
    textAlign: 'center',
    paddingHorizontal: spacing.size20Horizontal,
  },
  profileImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize/2,
    marginBottom: spacing.size20Vertical,
    marginTop: spacing.sizeLarge,
  },
  rating: {
    paddingVertical: spacing.size10Vertical,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.size20Vertical,
  },
  tag: {
    backgroundColor: colors.disabledBox,
    borderRadius: 20,
    paddingHorizontal: spacing.size10Horizontal,
    paddingVertical: spacing.size5Vertical,
    margin: spacing.size5Horizontal,
  },
  selectedTag: {
    backgroundColor: colors.secondary, // Selected tag background color
  },
  tagText: {
    fontSize: 14,
    padding: 3
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    width: '100%',
    marginTop: spacing.sizeLarge,
    marginBottom: spacing.sizeExtraLarge,
    padding: spacing.size10Horizontal,
    textAlignVertical: 'top',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    borderBottomWidth: 2, 
    borderBottomColor: colors.separatorColor, 
  },
  listingImage: {
    width: listingImageSize,
    height: listingImageSize,
    borderRadius: 8,
    marginRight: spacing.size10Horizontal,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontWeight: 'bold',
    marginTop: spacing.size10Vertical,
  },
  listingPrice: {
    fontSize: typography.body,
    color: colors.secondaryText,
  },
});

export default RatingForSellerScreen;
