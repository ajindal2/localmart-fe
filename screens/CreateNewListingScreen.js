import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createListing } from '../api/ListingsService';
import { getSellerLocation } from '../api/SellerService';
import { AuthContext } from '../AuthContext';
import colors from '../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native'; 
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';


const CreatingNewListingScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
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

  useEffect(() => {
    console.log('Photos updated:', photos);
  }, [photos]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleCancelListing}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      ),
      title: 'Create New Listing',
    });
  }, [navigation]); 

  const updateLocation = async (newLocation) => {
    let updatedProfileData = {};
  
    if (newLocation.coords) {
        try {
            let response = await Location.reverseGeocodeAsync({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
            });
  
            let cityNameConst = '';
            let postalCodeConst = '';
  
            if (response.length > 0) {
                cityNameConst = response[0].city || '';
                postalCodeConst = response[0].postalCode || '';
            }
  
            updatedProfileData = {
                location: { 
                    coordinates: [{ latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude }],
                    city: cityNameConst,
                    postalCode: postalCodeConst,
                }
            };
        } catch (error) {
            console.error('Failed to retrieve location details:', error);
            // Handle error, e.g., show a user-friendly message or log the error
        }
    } else if (newLocation.postalCode) {
        updatedProfileData = {
            location: {
                postalCode: newLocation.postalCode,
            },
        };
    }
  
    if (Object.keys(updatedProfileData).length > 0 ) { 
      setPickupLocation(updatedProfileData.location);
    }
  };  

  useEffect(() => {
    const fetchAndSetSellerLocation = async () => {
      try {
        const locationData = await  getSellerLocation(user._id);
        if (locationData && locationData.city) {
          setPickupLocation(locationData); 
        }
      } catch (error) {
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
  }, [navigation, route.params?.updatedLocation, user._id]);
  
  const handleCancelListing = () => {
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
  
              // Navigate to home page
              navigation.navigate('HomeScreen');
            };
  
            // Call the async function
            resetListing();
          }
        }
      ]
    );
  };
  

  // TODO add logic to use camera for photos
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
      const newPhotos = result.assets.map(item => item.uri).slice(0, remainingSlots);
      const updatedPhotos = [...photos, ...newPhotos];

      setPhotos(updatedPhotos);
    }
  }

  const handleDeletePhoto = useCallback((index) => {
    setPhotos(currentPhotos => currentPhotos.filter((_, i) => i !== index));
  }, [photos]);

  useEffect(() => {   
      const handleCreateListing = async () => {
        const hasTitleError = !title.trim();
        const hasPriceError = !price.trim() && !isFree;
        const hasPhotoError = photos.length === 0;

        setTitleError(hasTitleError ? 'Title cannot be empty' : '');
        setPriceError(hasPriceError ? 'Price cannot be empty' : '');
        setPhotoError(hasPhotoError ? 'Add at least 1 photo' : '');

        // If any errors, do not proceed with listing creation
        if (hasTitleError || hasPriceError || hasPhotoError) {
          console.log('Error: Required fields are missing');
          return;
        }

        try {
          const listingDetails = {
            title,
            description,
            price: isFree ? '0' : price,
            photos,
            location: pickupLocation
          };
          const listing = await createListing(user._id, listingDetails);
          // Handle success
          setShouldCreateListing(false); // Reset the flag
          // Handle success - reset the form fields and navigate to HomeScreen
          setTitle('');
          setDescription('');
          setPrice('');
          setIsFree(false);
          setPhotos([]);
          navigation.navigate('HomeScreen'); // Navigate to the homeScreen
        } catch (error) {
          // Handle error
          console.error(error);
          setShouldCreateListing(false); // Reset the flag
        }
      };

      if (shouldCreateListing) {
        handleCreateListing();
        setShouldCreateListing(false); 
    }
  }, [photos, shouldCreateListing, title, description, price, isFree, user._id]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset error states and optionally form fields
      setTitleError('');
      setPriceError('');
      setPhotoError('');
  
      // Optionally reset form fields
      // setTitle('');
      // setDescription('');
      // setPrice('');
      // setIsFree(false);
      // setPhotos([]);
  
      return () => {
        // Optional: Any cleanup logic goes here
      };
    }, [user._id])
  );

  const renderPhotoSlots = () => {
    const slots = [];
    for (let i = 0; i < 10; i++) {
      slots.push(
        <TouchableOpacity key={i} style={[styles.photoSlot, i === 0 && photoError ? styles.errorPhotoSlot : {}]} onPress={() => handleAddPhoto()}>
          {photos[i] ? (
            <>
              <Image source={{ uri: photos[i] }} style={styles.photo} />
              <TouchableOpacity onPress={() => handleDeletePhoto(i)} style={styles.deleteIcon}>
                <Ionicons name="close-circle" size={22} style={styles.deleteIconImage} />
              </TouchableOpacity>
            </>
          ) : (
            <Ionicons name="cloud-upload-outline" size={22} color="gray" />
          )}
        </TouchableOpacity>
      );
    }
    return slots;
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add upto 10 photos</Text>
        <ScrollView style={styles.photoScrollView} horizontal showsHorizontalScrollIndicator={false}>
          {renderPhotoSlots()}
        </ScrollView>
        {photoError ? <Text style={styles.errorMessage}>{photoError}</Text> : null}
        <View style={styles.separator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What are you selling?</Text>
        <TextInput
          style={[styles.input, titleError ? styles.errorInput : {}]}
          placeholder="What are you selling?"
          onChangeText={setTitle}
          value={title}
        />
        {titleError ? <Text style={styles.errorMessage}>{titleError}</Text> : null}

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          onChangeText={setDescription}
          value={description}
          multiline
        />
      <View style={styles.separator} />

      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price</Text>
        <TextInput
          style={[
            styles.input, 
            isFree && styles.inputDisabled,
            priceError && styles.errorInput
          ]}
          placeholder="Price"
          onChangeText={setPrice}
          value={price}
          editable={!isFree} // Disable editing when isFree is true
        />
        {priceError ? <Text style={styles.errorMessage}>{priceError}</Text> : null}

        <View style={styles.toggleContainer}>
          <Text>Free</Text>
          <Switch
            value={isFree}
            onValueChange={(value) => {
              setIsFree(value);
              setPrice(value ? '0' : ''); // Set price to '0' if free, else empty string
            }}
          />
        </View>
        <View style={styles.separator} />
      </View>

      <View style={styles.section}>
      <Text style={styles.sectionTitle}>PickUp Location</Text>
      <Text>
        {pickupLocation.city || pickupLocation.postalCode || 'Loading location...'}
      </Text>
      <TouchableOpacity 
        style={styles.editButton} 
        //TODO
            // 1. location will contain either only zipcode or the exppo location. 
            // 2. Duplication the logic in LocationProvider update and set the newpickupLocation to updatedProfileData.location
            // 3. newpickupLocation is what will be sent to BE when creating a new listing to store location.
            // 4. Use pickupLocation to display on the page. It'll either be city if available or zipcode. 
            // 5. Add logic in BE similar to UP service to call google API when only zipcode is present.
          
            onPress={() => navigation.navigate('ListingLocationPreferenceScreen')}
      >
        <Text>Edit</Text>
      </TouchableOpacity>
    </View>

      <View style={styles.separator} />
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => {
            setShouldCreateListing(true); // Set the state as needed 
          }}
        > 
        <Text style={styles.nextButtonText}>Create</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  // Add your styles here
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  errorInput: {
    borderColor: 'red', // Color for error state
  },
  errorPhotoSlot: {
    borderColor: 'red', // Color for error state
    borderWidth: 1, // Adjust the border width as needed
  },
  errorMessage: {
    color: 'red', // Adjust color as needed
    fontSize: 14,
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Adjust as needed
  },
  cancelButtonText: {
    color: 'blue', // Adjust color as needed
    marginRight: 10,
    fontWeight: 'bold',
  },
  photoScrollView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nextButtonText: {
    color: 'white',
    marginRight: 10,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBackground,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#d9d9d9',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#e0e0e0',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  photoSlot: {
    width: 120,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight:10,
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
    top: -2, // Adjust these values as needed to place the icon correctly
    right: -2,
    backgroundColor: 'grey', // Grey background for the circle
    borderRadius: 12, // Half of width and height to make it circle
    width: 24, // Width of the circle
    height: 24, // Height of the circle
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
    zIndex: 1,
  },
  deleteIconImage: {
    color: 'white', // White color for the icon
  },
  editButton: {
    marginTop: 10,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginTop: 10,
  },
});

export default CreatingNewListingScreen;