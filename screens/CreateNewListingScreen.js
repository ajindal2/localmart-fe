import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createListing, updateListing } from '../api/ListingsService';
import { getSellerLocation } from '../api/SellerService';
import { AuthContext } from '../AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import {reverseGeocode} from '../api/LocationService'
import useHideBottomTab from '../utils/HideBottomTab'; 
import { useTheme } from '../components/ThemeContext';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';

const CreatingNewListingScreen = ({ navigation, route }) => {
  const PHOTO_SLOT_WIDTH = 120; // Use the same width as defined in your photoSlot style

  const { user, logout } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [shouldCreateListing, setShouldCreateListing] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isEditing] = useState(route.params?.isEditing || false);
  const [listing] = useState(route.params?.listing || {});
  const fromAccount = route.params?.fromAccount;
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press

  useEffect(() => {
    console.log('Photos updated:', photos);
  }, [photos]);

  useHideBottomTab(navigation, fromAccount);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleCancelListing}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      ),
      title: isEditing ? 'Edit listing' : 'Create listing',
    });
  }, [navigation, isEditing]); 

  const updateLocation = async (newLocation) => {
    let updatedProfileData = {};

    if (newLocation.coords) {
      try {
        const result = await reverseGeocode(newLocation.coords.latitude, newLocation.coords.longitude);
        updatedProfileData = {
          location: { 
            city: result.city,
            state: result.state,
            postalCode: result.postalCode,
            coordinates: [{ latitude: result.coordinates[1], longitude: result.coordinates[0] }],
          }
        };       
      } catch (error) {
        if (error.message.includes('RefreshTokenExpired')) {
          logout();
        }
        console.error('Failed to retrieve location details:', error);
        Alert.alert('Error', error.message);
      }
    } else if (newLocation.city && newLocation.postalCode && newLocation.coordinates) {
      updatedProfileData = {
        location: { 
          city: newLocation.city,
          state: newLocation.state,
          postalCode: newLocation.postalCode,
          coordinates: newLocation.coordinates,
        }
      };
    } else {
      // Handle the case where location is undefined or null
      Alert.alert('Error', 'Error occured when retrieving location');
      console.error('Failed to retrieve location.');
    }

    if (Object.keys(updatedProfileData).length > 0 ) { 
      setPickupLocation(updatedProfileData.location);
    }
  };  

  useEffect(() => {
    if (isEditing && listing) {
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setPrice(listing.price.toString() || '');
      setPhotos(listing.imageUrls || []);
      setPickupLocation(listing.location || {});
      setIsFree(listing.price === 0);
    }
  }, [isEditing, listing]);

  useEffect(() => {
    const fetchAndSetSellerLocation = async () => {
      // Check if user is null before proceeding
      if (!user) {
        console.error('User is null, cannot fetchAndSetSellerLocation');
        return; // Exit the function if there's no user
      }
      try {
        const locationData = await  getSellerLocation(user._id);
        if (locationData && locationData.city && locationData.coordinates && locationData.coordinates.coordinates) {
          const location = { 
            city: locationData.city,
            state: locationData.state,
            postalCode: locationData.postalCode,
            coordinates: [{ latitude: locationData.coordinates.coordinates[1], longitude: locationData.coordinates.coordinates[0] }],
          }
          setPickupLocation(location); 
        }
      } catch (error) {
        if (error.message.includes('RefreshTokenExpired')) {
          logout();
        }
        console.error('Error fetching seller location:', error);
      }
    };
  
    if (route.params?.updatedLocation) {
      const newLocation = route.params.updatedLocation;
      updateLocation(newLocation);
    } else {
      fetchAndSetSellerLocation();
    }
  
    return () => {
      // Cleanup or reset route params if needed
    };
  }, [route.params?.updatedLocation, user]);
  
  const handleCancelListing = () => {
    // Check if user is null before proceeding
    if (!user) {
      console.error('User is null, cannot fetch seller location.');
      return; // Exit the function if there's no user
    }
    Alert.alert(
      "Discard Listing",
      "Are you sure you want to discard this listing?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK",
          onPress: () => {
            // Define an async function inside the onPress callback
            const resetListing = async () => {
              // Clear state
              setTitle('');
              setDescription('');
              setPrice('');
              setPhotos([]);
              setIsFree(false);
  
              // Refetch and reset the seller's original location
              try {
                const locationData = await getSellerLocation(user._id);
                if (locationData && locationData.city) {
                  setPickupLocation(locationData);
                } else {
                  setPickupLocation({}); // Reset to an empty object or a default value
                }
              } catch (error) {
                console.error('Error refetching seller location:', error);
                setPickupLocation({}); // Reset in case of error
              }
  
              if(isEditing) {
                /*navigation.navigate('AccountStackNavigator', {
                  screen: 'AccountScreen',
                }); */
                navigation.goBack();
              } else {
                navigation.navigate('HomeScreen');
              }
            };
  
            // Call the async function
            resetListing();
          }
        }
      ]
    );
  };
  
  const handleAddPhoto = async () => {
    const remainingSlots = 10 - photos.length;
    if (remainingSlots <= 0) {
      alert('You can only add up to 10 photos.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots, // Limit the number of selectable images
    });

    if (!result.canceled && result.assets) {
      // Append a cache-busting query parameter. This will force the system to bypass the cache and treat the image as a new resource
      const newPhotos = result.assets.map(item => `${item.uri}?${Date.now()}`).slice(0, remainingSlots);
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
    }
  }

  const handleDeletePhoto = useCallback((index) => {
    setPhotos(currentPhotos => currentPhotos.filter((_, i) => i !== index));
  }, [photos]);

  const handleLongPress = (index) => {
    Alert.alert(
      "Set as Primary Image",
      "Do you want to set this image as the primary image for your listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Set as Primary",
          onPress: () => {
            const newPhotos = [...photos];
            const [selectedPhoto] = newPhotos.splice(index, 1); // Remove the selected photo
            newPhotos.unshift(selectedPhoto); // Add it to the beginning
            setPhotos(newPhotos); // Update the photos array
          },
        },
      ],
      { cancelable: false }
    );
  };

  //useEffect(() => {   
      const handleCreateListing = async () => {
        if (!user) {
          console.error('User is null, cannot create listing');
          return; // Exit the function if there's no user
        }

        setIsCreating(true); 

        const hasTitleError = !title.trim();
        const hasPhotoError = photos.length === 0;
        const priceErrorMessage = validatePrice(price);
        const hasLocationError = pickupLocation == null || !pickupLocation || (!pickupLocation.coordinates && !pickupLocation.postalCode);

        setPriceError(priceErrorMessage);
        setTitleError(hasTitleError ? 'Title cannot be empty' : '');
        setPhotoError(hasPhotoError ? 'Add at least 1 photo' : '');
        setLocationError(hasLocationError ? 'Location cannot be empty' : '');

        // If any errors, do not proceed with listing creation
        if (hasTitleError || priceErrorMessage || hasPhotoError || hasLocationError) {
          console.log('Error: Required fields are missing');
          setIsCreating(false); 
          return;
        }

        const listingDetails = {
          title,
          description,
          price: isFree ? '0' : price,
          photos,
          location: pickupLocation
        };
        try {
          if (isEditing) {
            // Call API to update the listing
            await updateListing(listing._id, listingDetails);
            Alert.alert('Listing updated successfully');
          } else {
            // Call API to create a new listing
            await createListing(user._id, listingDetails);
            Alert.alert('Listing created successfully');
          }
          // Handle success
          // setShouldCreateListing(false); // Reset the flag
          // Handle success - reset the form fields and navigate to HomeScreen
          setTitle('');
          setDescription('');
          setPrice('');
          setIsFree(false);
          setPhotos([]);
          navigation.navigate('HomeScreen'); // Navigate to the homeScreen
      } catch (error) {
        if (error.message.includes('RefreshTokenExpired')) {
          logout();
        } else {
          Alert.alert('Error', 'An unknown error occured, please try again later.');
        }
        console.error(error);
        //setShouldCreateListing(false); // Reset the flag
      } finally {
        setIsCreating(false); 
        //setShouldCreateListing(false);
      }
    };

    //if (shouldCreateListing) {
      //handleCreateListing();
      //setShouldCreateListing(false); 
    //}
  //}, [photos, shouldCreateListing, title, description, price, isFree, user._id]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset error states and optionally form fields
      setTitleError('');
      setPriceError('');
      setPhotoError('');
      setLocationError('');
      setIsCreating(false); 
      // Optionally reset form fields
      // setTitle('');
      // setDescription('');
      // setPrice('');
      // setIsFree(false);
      // setPhotos([]);
  
      return () => {
        // Optional: Any cleanup logic goes here
      };
    }, [user])
  );

  const renderPhotoSlots = () => {
    const slots = [];
    for (let i = 0; i < 10; i++) {
      slots.push(
        <TouchableOpacity key={i} onLongPress={() => handleLongPress(i)} style={[styles.photoSlot, i === 0 && photoError ? styles.errorPhotoSlot : {}]} onPress={() => handleAddPhoto()}>
          {photos[i] ? (
            <>
              <Image source={{ uri: photos[i] }} style={styles.photo} />
              <TouchableOpacity onPress={() => handleDeletePhoto(i)} style={styles.deleteIcon}>
                <Ionicons name="close-circle" size={22} style={styles.deleteIconImage} />
              </TouchableOpacity>
              <View style={styles.longPressIndicator}>
              <Text style={styles.longPressText}>Hold to Set Primary</Text>
            </View>
            </>
          ) : (
            <Ionicons name="cloud-upload-outline" size={22} color="gray" />
          )}
        </TouchableOpacity>
      );
    }
    return slots;
  };

  const validatePrice = (input) => {
    if(!input.trim() && !isFree) {
      return "Price cannot be empty.";
    }
    const numericRegex = /^[0-9]*\.?[0-9]*$/; // Regex to allow numbers and a single decimal point
    const isValidNumericInput = numericRegex.test(input);
  
    if (!isValidNumericInput) {
      return "Only numeric values are allowed.";
    }
  
    const floatValue = parseFloat(input);
    if (floatValue > 10000) {
      return "Max price cannot exceed 10000.";
    }
  
    // If input passes both checks, it's valid
    return '';
  };

  const navigateToListingLocationPreferenceScreen = React.useCallback(() => {
    navigation.navigate('ListingLocationPreferenceScreen');
  }, [navigation]);

   // Dynamically set the button title
   let buttonTitle = isEditing ? "Update" : "Create";
   if (isCreating) {
     buttonTitle = "Processing...";
   }

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.section}>
        <Text style={styles.text}>Add upto 10 photos</Text>
        <ScrollView style={styles.photoScrollView} horizontal showsHorizontalScrollIndicator={false}>
          {renderPhotoSlots()}
        </ScrollView>
        {photoError ? <Text style={styles.errorMessage}>{photoError}</Text> : null}
        <View style={styles.separator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>What are you selling?</Text>

        <InputComponent
           placeholder="What are you selling?"
           onChangeText={setTitle}
           value={title}
           style={[titleError ? styles.errorInput : {marginTop: spacing.size10Vertical, padding:spacing.size10Horizontal}]}
        />
        {titleError ? <Text style={styles.errorMessage}>{titleError}</Text> : null}

        <InputComponent
          placeholder="Description"
          value={description}          
          onChangeText={setDescription}
          style={{marginTop: spacing.size10Vertical, padding: spacing.size10Horizontal}}
          multiline
        />
      <View style={styles.separator} />

      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Price</Text>

        <InputComponent
          placeholder="Price"
          keyboardType="numeric"
          onChangeText={setPrice}
          value={price}
          editable={!isFree}  // Disable editing when isFree is true
          style={[
            isFree && styles.inputDisabled,
            priceError && styles.errorInput,
            {marginTop: spacing.size10Vertical, padding: spacing.size10Horizontal}
          ]}
        />
        {priceError ? <Text style={styles.errorMessage}>{priceError}</Text> : null}

        <View style={styles.toggleContainer}>
          <Text>Free</Text>
          <Switch
            value={isFree}
            trackColor={{ false: colors.darkGrey, true: colors.primary }} // Colors for the track
            thumbColor={isFree ? colors.secondary : colors.lightWhite} // Color for the thumb
            onValueChange={(value) => {
              setIsFree(value);
              setPrice(value ? '0' : ''); // Set price to '0' if free, else empty string
            }}
          />
        </View>
        <View style={styles.separator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Pickup Location</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            {pickupLocation ? 
              (
                pickupLocation.city && pickupLocation.state ? `${pickupLocation.city}, ${pickupLocation.state}` :
                pickupLocation.city || pickupLocation.postalCode || 'Set a location (required)'
              ) : 
              'Unable to load location'
            }
          </Text>
          <ButtonComponent 
            title="Edit"
            onPress={navigateToListingLocationPreferenceScreen}
            style={styles.buttonStyle} 
          />
        </View>
        {locationError ? <Text style={styles.errorMessage}>{locationError}</Text> : null}

        <View style={styles.separator} />
      </View>

      <ButtonComponent 
        title={buttonTitle} 
        disabled={isCreating}
        loading={isCreating}
        type="primary" 
        onPress={() => {
          handleCreateListing();
          //setShouldCreateListing(true); // Set the state as needed 
        }}
        style={{ marginTop: spacing.size20Vertical, width: '100%', flexDirection: 'row' }}
      />
  
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const photoSlotSize = width * 0.3; 
const deleteIconSize = width * 0.05; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size10Horizontal,
  },
  errorInput: {
    borderColor: colors.error, // Color for error state
  },
  errorPhotoSlot: {
    borderColor: colors.error, // Color for error state
    borderWidth: 1, // Adjust the border width as needed
  },
  errorMessage: {
    color: colors.error, // Adjust color as needed
    fontSize: typography.subHeading,
    marginTop: spacing.size5Vertical,
  },
  cancelButtonText: {
    color: colors.primary,
    marginRight: spacing.size10Horizontal,
    fontWeight: 'bold',
  },
  photoScrollView: {
    flexDirection: 'row',
    marginTop: spacing.size10Vertical,
  },
  section: {
  },
  inputDisabled: {
    backgroundColor: typography.disabledBox,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.size10Vertical,
  },
  photoSlot: {
    width: photoSlotSize,
    height: photoSlotSize,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.size10Vertical,
    marginRight:spacing.size10Horizontal,
    position: 'relative',
    overflow: 'visible', // Allow overflow
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  deleteIcon: {
    position: 'absolute',
    top: -2, 
    right: -2,
    backgroundColor: colors.darkGrey,
    borderRadius: deleteIconSize/2, // Half of width and height to make it circle
    width: deleteIconSize, // Width of the circle
    height: deleteIconSize, // Height of the circle
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
    zIndex: 1,
  },
  deleteIconImage: {
    color: 'white', // White color for the icon
  },
  separator: {
    height: 0, // hiding the separator and keeping the margins
    backgroundColor: colors.separatorColor,
    marginBottom: spacing.size5Vertical,
    marginTop: spacing.size5Vertical,
  },
  text: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.headingColor, 
    paddingBottom: spacing.size5Vertical,
  },
  locationText: {
    color: colors.secondaryText, 
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonStyle: {
    height: 30, // Decrease button height
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: typography.caption,
  },
  longPressIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    padding: 2,
  },
  longPressText: {
    color: colors.white,
    fontSize: typography.small,
  },
});

export default CreatingNewListingScreen;