import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { getSellerRatings } from '../api/RatingsService';
import StarRating from '../components/StarRating';
import Toast from 'react-native-toast-message';
import { createSavedListing, deleteSavedListing, checkSavedStatus } from '../api/SavedListingService';
import { getListingFromId } from '../api/ListingsService';
import {createOrGetChat} from '../api/ChatRestService';
import shareListing from '../utils/ShareListing';
import FullScreenImageModal from '../components/FullScreenImageModal'; 
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import ButtonComponent from '../components/ButtonComponent';
import ExpandingTextComponent from '../components/ExpandingTextComponent';
import ListingMap from '../components/ListingMap';


const ViewListing = ({ route, navigation }) => {
    //const { item } = route.params;
    const hasFetchedData = useRef(false);
    const screenWidth = Dimensions.get('window').width;
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user, logout } = useContext(AuthContext);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [ratingsWithProfile, setRatingsWithProfile] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [isSaved, setIsSaved] = useState(false);
    const [savedListingId, setSavedListingId] = useState(null);
    const [item, setItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sellerImageLoadError, setSellerImageLoadError] = useState(false);
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const STOCK_IMAGE_URI = require('../assets/stock-image.png'); 
    const STOCK_LISTING_IMAGE_URI = require('../assets/app_icon.png'); 

    // Hide the bottom tab 
    useHideBottomTab(navigation, true);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { month: 'short', year: 'numeric' };
      return date.toLocaleString('en-US', options);
    };

    const openImageModal = () => {
      //setCurrentImageUrl(item.imageUrls);
      setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

    const navigateToSellerDetails = () => {
        navigation.navigate('SellerDetails', { sellerProfile, ratingsWithProfile, averageRating });
    };

    const handleScroll = (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / screenWidth);
      setCurrentIndex(newIndex);
    };
  
    const renderScrollDots = () => {
      return item && item.imageUrls && item.imageUrls.length > 0 ? (
        item.imageUrls.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))
      ) : null; // Return null or some other placeholder if no images are available
    };

    // Handle save listing action
    const handleSaveListing = async () => {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
      
        try {
          if (newSavedState) {
            const resp = await createSavedListing(user._id, item._id);
            setSavedListingId(resp._id);
            Toast.show({
              type: 'success',
              text1: 'Listing Saved',
              visibilityTime: 4000,
              autoHide: true,
              position: 'bottom',
              topOffset: 30,
              bottomOffset: 40,
            });
          } else {
            await deleteSavedListing(savedListingId);
            setSavedListingId(null);
            Toast.show({
              type: 'success',
              text1: 'Listing Unsaved',
              visibilityTime: 4000,
              autoHide: true,
              position: 'bottom',
              topOffset: 30,
              bottomOffset: 40,
            });
          }
        } catch (error) {
          if (error.message.includes('RefreshTokenExpired')) {
            logout();
          } 
          Toast.show({
            type: 'error',
            text1: 'An error occurred. Please try again later.',
            visibilityTime: 4000,
            autoHide: true,
            position: 'bottom',
            topOffset: 30,
            bottomOffset: 40,
          });
        }
    };

    // Handle share listing action
    const handleShareListing = () => {
        const listingId = item._id; 
        const listingTitle = 'Check this Item for Sale!';
        const listingUrl = getListingUrl(listingId);
        shareListing(listingTitle, listingUrl);
    };

    const handleSend = async (sellerId, buyerId, listingId) => {
      const createChatDTO = {
        sellerId,
        buyerId,
        listingId,
      };
    
      try {
        const item = await createOrGetChat(createChatDTO);
        navigation.navigate('ChatScreen', { chat : item });
      } catch (error) {
        if (error.message.includes('RefreshTokenExpired')) {
          logout();
        } 
        Alert.alert('Error', 'An error aoccured when sending the message. Please try again later.');
        console.error('Error creating chat', error);
      }
    };

    useEffect(() => {
       
        const fetchSellerRatings = async () => {
          try {
            const { averageRating, ratingsWithProfile, sellerProfile } = await getSellerRatings(item.sellerId);
            setRatingsWithProfile(ratingsWithProfile);
            setAverageRating(averageRating); 
            setSellerProfile(sellerProfile);
          } catch (error) {
            console.error('Error fetching seller ratings', error);
          }
        };
        
        const checkIfSaved = async () => {
          try {
            const response = await checkSavedStatus(user._id, item._id);
            if (response) {
              setIsSaved(response.isSaved);
              setSavedListingId(response.savedListingId);
            }
          } catch (error) {
            console.error('Error checking saved status:', error);
          }
        };

        if (route.params?.item) {
          // Navigated from within the app
          setItem(route.params.item);
          hasFetchedData.current = true;
        } else if (route.params?.listingId && !hasFetchedData.current) {
          // Navigated from a deep link and haven't fetched data yet
          const listingId = route.params.listingId;
          getListingFromId(listingId).then(data => {
            setItem(data);
            hasFetchedData.current = true; // Set to true to avoid refetching on subsequent renders
          }).catch(error => {
            console.error('Error fetching listing details:', error);
            Alert.alert('Error', 'Failed to load listing details. Please try again later.');
          });
        }
        
        if(item && user) {
          checkIfSaved();
        }
        if(item && item.sellerId) {
          fetchSellerRatings();
        }    
       
      }, [item, user, route.params]);

      if (!item) {
        // Render a loading indicator or null if no item data is available yet
        return <Text>Loading...</Text>;
    }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.topContainer}>
      <View style={styles.imageContainer}>
        {/* Section 1: Images, Title, and Price */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          //ref={scrollViewRef}
        >
        {
          item && item.imageUrls && item.imageUrls.length > 0 ? (
            item.imageUrls.map((url, index) => (
              <View key={index} style={[styles.imageWrapper, { width: screenWidth }]}>
                <TouchableOpacity activeOpacity={1} onPress={() => openImageModal(url)}>
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity onPress={handleShareListing} style={styles.iconCircle}>
                    <Ionicons name="share-social" size={typography.iconLarge} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveListing} style={styles.iconCircle}>
                    <Ionicons name={isSaved ? "heart" : "heart-outline"} size={typography.iconLarge} color={isSaved ? colors.primary : colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.dotContainer}>{renderScrollDots()}</View>
              </View>
            ))
          ) : (
            // Render a placeholder or message if no images are available
            <View style={[styles.imageWrapper, { width: screenWidth }]}>
              <Image source={STOCK_LISTING_IMAGE_URI} style={styles.image} />
            </View>
          )
        }
        </ScrollView>

        <FullScreenImageModal
          isVisible={isModalVisible}
          onClose={closeModal}
          imageUrls={item.imageUrls} // Pass all image URLs
          initialIndex={currentIndex}  // Pass the current index
        />
      
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>

        {/* Section 2: Seller Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Details</Text>
          {
              sellerProfile ? (
                  <View>
                  <TouchableOpacity activeOpacity={1} onPress={navigateToSellerDetails} style={styles.sellerDetailsContainer}>
                      <View style={styles.sellerDetails}>
                      <Image 
                        source={
                          sellerImageLoadError || !sellerProfile.profilePicture
                            ? STOCK_IMAGE_URI
                            : { uri: sellerProfile.profilePicture }
                        }
                        style={styles.sellerImage}
                        onError={() => setSellerImageLoadError(true)}
                      />
                      <View style={styles.sellerInfo}>
                          <Text style={styles.sellerName}>{sellerProfile.userId.userName}</Text>
                          <Text style={styles.dateJoined}>Joined {formatDate(sellerProfile.userId.date)}</Text>
                          <View style={styles.ratingContainer}>
                          <StarRating
                              rating={averageRating.toFixed(1)}
                          />
                          <Text style={styles.ratingCount}>
                            {ratingsWithProfile.length > 0 ? `${averageRating.toFixed(1)} (${ratingsWithProfile.length} Ratings)` : 'No Ratings'}
                          </Text>
                          </View>
                      </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="grey" />
                  </TouchableOpacity>
                </View>
              ) : (
              <Text style={styles.sellerDetailsContainer}>Unable to load seller details</Text>
              )
          }
          </View>


        {/* Section 3: Listing Description */}
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <ExpandingTextComponent description={item.description} />
        </View>


        {/* Section 4: Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            {item.location ? 
                (
                  item.location.city && item.location.state ? `${item.location.city}, ${item.location.state}` :
                  item.location.city || item.location.postalCode || 'Location not specified'
                ) : 
                'Unable to load location'
            }
            </Text>
            {/* Check if location data exists before rendering the map */}
            {item.location && item.location.coordinates && item.location.coordinates.coordinates && item.location.coordinates.coordinates.length == 2 &&(
              <ListingMap location={item.location.coordinates} />
            )}
          </View>
    </ScrollView>

    <View style={styles.buttonContainer}>
      {sellerProfile && sellerProfile.userId._id !== user._id && (
        <ButtonComponent 
          title="Message Seller"
          type="primary"
          onPress={() => handleSend(sellerProfile.userId._id, user._id, item._id)}
          style={{ width: '100%', flexDirection: 'row' }}
        />
      )}
    </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;
const imageSize = screenHeight * 0.3; 
const sellerImageSize = screenHeight * 0.1;

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1, 
  },
  section: {
    margin: spacing.size5Horizontal,
    backgroundColor: colors.white, // Use a light color for the section background
    borderRadius: spacing.sm, // Rounded corners for the section
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
  topContainer: {
    flex: 1,
    marginBottom: spacing.sizeExtraLarge,
  },
  textContainer: {
  },
  imageWrapper: {
    position: 'relative',
  },
  iconsContainer: {
    position: 'absolute',
    top: spacing.size10Vertical,
    right: spacing.size10Horizontal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    padding: spacing.size5Horizontal,
    marginLeft: spacing.size5Horizontal,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: spacing.size10Vertical,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    height: imageSize,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.size10Vertical,
    backgroundColor: colors.white,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22, // Shadow opacity
    shadowRadius: 2.22, // Shadow blur radius
    elevation: 3, // Elevation for Android
  },
  title: {
    fontSize: typography.sectionTitle,
    fontWeight: 'bold',
    paddingTop: spacing.size5Vertical,
    paddingBottom: spacing.size5Vertical,
    paddingLeft: spacing.size10Horizontal,
  },
  price: {
    fontSize: typography.heading,
    color: colors.secondaryText,
    paddingLeft: spacing.size10Horizontal,
    paddingBottom: spacing.size5Vertical,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.headingColor, 
    paddingBottom: spacing.size5Vertical,
  },
  sellerDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.size10Vertical,
  },
  sellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInfo: {
  },
  sellerName: {
    fontSize: typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.size5Vertical, 
  },
  dateJoined: {
    fontSize: typography.subHeading,
    marginBottom: spacing.size5Vertical, 
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.size5Vertical
  },
  ratingCount: {
    fontSize: typography.subHeading,
    marginLeft: spacing.size5Vertical,
  },
  sellerImage: {
    width: sellerImageSize,
    height: sellerImageSize,
    borderRadius: sellerImageSize/2,
    marginRight: spacing.size10Horizontal,
  },
  dotContainer: {
    position: 'absolute',
    bottom: spacing.size10Vertical,
    alignSelf: 'center',
    flexDirection: 'row',
    padding: spacing.size5Horizontal,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    borderRadius: 15,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'black', // Color for active dot
  },
  inactiveDot: {
    backgroundColor: 'white', // Color for inactive dots
  },
  locationText: {
    paddingBottom: spacing.size10Vertical,
    color: colors.secondaryText, 
  },
});

const getListingUrl = (listingId) => {
  return `localmart://listing/view/${listingId}`;
  //return `https://www.localmart.com/listing/${listingId}`;
};

export default ViewListing;
