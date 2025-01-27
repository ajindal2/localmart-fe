import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { getSellerRatings } from '../api/RatingsService';
import StarRating from '../components/StarRating';
import Toast from 'react-native-toast-message';
import { createSavedListing, deleteSavedListing, checkSavedStatus } from '../api/SavedListingService';
import { getListingFromId } from '../api/ListingsService';
import {createOrGetChat} from '../api/ChatRestService';
import { sendReportListing } from '../api/AuthService';
import shareListing from '../utils/ShareListing';
import FullScreenImageModal from '../components/FullScreenImageModal'; 
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import ExpandingTextComponent from '../components/ExpandingTextComponent';
import ListingMap from '../components/ListingMap';
import { DEFAULT_IMAGE_URI } from '../constants/AppConstants'
import { DEFAULT_LISTING_IMAGE_URI } from '../constants/AppConstants'
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';


const ViewListing = ({ route, navigation }) => {
    const isConnected = useNetworkConnectivity();
    const hasFetchedData = useRef(false);
    const screenWidth = Dimensions.get('window').width;
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user, logout } = useContext(AuthContext);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [ratingsWithProfile, setRatingsWithProfile] = useState([]);
    const [tagsSummary, setTagsSummary] = useState(null);
    const [averageRating, setAverageRating] = useState(0); 
    const [isSaved, setIsSaved] = useState(false);
    const [savedListingId, setSavedListingId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');  
    const [item, setItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sellerImageLoadError, setSellerImageLoadError] = useState(false);
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const [isSubmitting, setIsSubmitting] = useState(false); // to disable submit report button

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

    // Helper function to determine the correct image source
    const getImageSource = (imagePath) => {
      // Check if imagePath is a number, typical of local images loaded via require()
      if (typeof imagePath === 'number') {
        return imagePath;  // Return the local image directly
      }
      // Check if imagePath is a network URL
      if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('https'))) {
        return { uri: imagePath };
      }
      // Handle default local image or any other cases
      return DEFAULT_LISTING_IMAGE_URI;
    };

    const navigateToSellerDetails = React.useCallback(() => {
      navigation.navigate('SellerDetails', { sellerProfile, ratingsWithProfile, averageRating, tagsSummary });
    }, [navigation, sellerProfile, ratingsWithProfile, averageRating, tagsSummary]);

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
        if (!user) {
          // Redirect to WelcomeScreen
          navigation.navigate('Auth', { screen: 'WelcomeScreen' });
          return; // Exit the function if there's no user
        }
  

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
            await logout();
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
        const listingTitle = `Check this Item for Sale!\n${item.title}`;
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
          await logout();
        } 
        Alert.alert('Error', 'An error aoccured when sending the message. Please try again later.');
        console.error('Error creating chat', error);
      }
    };

    useEffect(() => {
      const fetchSellerRatings = async () => {
        try {
          const { averageRating, ratingsWithProfile, sellerProfile, tagsSummary } = await getSellerRatings(item.sellerId);
          setRatingsWithProfile(ratingsWithProfile);
          setAverageRating(averageRating); 
          setSellerProfile(sellerProfile);
          setTagsSummary(tagsSummary);
        } catch (error) {
          console.error('Error fetching seller ratings', error);
        }
      };
      
      const checkIfSaved = async () => {
        if (!user) {
          console.error('User is null, cannot checkIfSaved');
          return; // Exit the function if there's no user
        }

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

    const convertMetersToMiles = (meters) => {
      return meters * 0.000621371;
    };

    const renderDistance = () => {
      if (item.distance) {
        return (
          <>
            <Text style={styles.dotSep}> · </Text>
            <Text style={styles.distance}>{convertMetersToMiles(item.distance).toFixed(2)} mi</Text>
          </>
        );
      }
      return null;
    };

    const handleReportListing = async (listingId) => {
      setIsSubmitting(true);
      if (!reportReason || reportReason.trim() === '') {
        Alert.alert('Error', 'Please provide a reason for reporting.');
        setIsSubmitting(false);
        return;
      }

      try {
        const reportData = {
          listingId: listingId,
          reason: reportReason,
        };
  
        await sendReportListing(reportData);
        Alert.alert('Report Submitted', 'Thank you for reporting this listing, we will contact you on your registered email');
        setModalVisible(false);
        setReportReason(''); // Clear the input after submission
      } catch (error) {
        console.error('Error reporting listing:', error);
        Alert.alert('Error', 'There was an issue submitting your report. Please try again later.');
      } finally {
        setIsSubmitting(false); 
      }
    };

   // Dynamically set the button title
   let reportButtonTitle = isSubmitting ? "Processing..." : "Submit Report";
   
    if (!isConnected) {
      return (
        <View style={styles.container}>
          <NoInternetComponent/>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      {!item ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
      <>
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
              <Image source={DEFAULT_LISTING_IMAGE_URI} style={styles.image} />
            </View>
          )
        }
        </ScrollView>

        <FullScreenImageModal
          isVisible={isModalVisible}
          onClose={closeModal}
          imageUrls={item.imageUrls ? item.imageUrls.map(getImageSource) : [DEFAULT_IMAGE_URI]}
          initialIndex={currentIndex}  // Pass the current index
        />
      
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.priceDistanceContainer}>
            {typeof item?.price === 'number' && (
              <Text style={styles.price}>
                {item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}
              </Text>
            )}
            {/* Conditional rendering for distance */}
            {renderDistance()}    
          </View>   
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
                            ? DEFAULT_IMAGE_URI
                            : { uri: sellerProfile.profilePicture }
                        }
                        style={styles.sellerImage}
                        onError={() => setSellerImageLoadError(true)}
                      />
                      <View style={styles.sellerInfo}>
                          <Text style={styles.sellerName}>{sellerProfile.userId.displayName}</Text>
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

      {/* CTA for reporting the listing */}

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => {
         if (user) {
           setModalVisible(true);
         } else {
           navigation.navigate('Auth', { screen: 'WelcomeScreen' });
         }
       }}
      >
        <Text style={styles.reportButtonText}>Report this listing</Text>
      </TouchableOpacity>

      {/* Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Report Listing</Text>
              <Text style={styles.modalDescription}>
              Please let us know why you are reporting this listing.
              </Text>
            <InputComponent
              style={styles.textInput}
              placeholder="Enter details here"
              value={reportReason}
              onChangeText={setReportReason}
              multiline
              textAlignVertical="top"
            />
            <ButtonComponent 
              title={reportButtonTitle}
              type="secondary"
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={() => {   
                handleReportListing(item._id);              
              }}
              style={{ width: '100%', flexDirection: 'row' }}
            />
          </View>
        </View>
      </Modal>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {((user && sellerProfile && sellerProfile.userId._id !== user._id) || !user) && (
          <ButtonComponent 
            title="Message Seller"
            type="primary"
            onPress={() => {
              if (user) {
                handleSend(sellerProfile.userId._id, user._id, item._id);
              } else {
                navigation.navigate('Auth', { screen: 'WelcomeScreen' });
              }
            }}
            style={{ width: '100%', flexDirection: 'row' }}
          />
        )}
      </View>
    </>
    )}
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
    //marginTop: spacing.size5Vertical
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
  priceDistanceContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
  },
  dotSep: {
    fontSize: typography.heading,
    color: colors.secondaryText,
    fontWeight: 'bold',
    paddingBottom: spacing.size5Vertical,
  },
  distance: {
    fontSize: typography.heading,
    color: colors.secondaryText,
    //paddingLeft: spacing.size10Horizontal,
    paddingBottom: spacing.size5Vertical,
  },
 
  reportButton: {
    marginTop: 10,
    //paddingVertical: 12,
    //backgroundColor: '#f44',
   // borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    fontSize: 14,
    color: '#f44',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.size10Horizontal,
    fontSize: typography.body,
    marginBottom: spacing.sizeLarge,
    textAlignVertical: 'top',
    height: 100
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10, // Aligns the icon to the right
    zIndex: 1, // Ensures the icon stays above other elements
  },
});

const getListingUrl = (listingId) => {
  return `https://farmvox.com/listing/view/${listingId}`;
};

export default ViewListing;
