import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, Dimensions  } from 'react-native';
import * as Location from 'expo-location';
import useHideBottomTab from '../utils/HideBottomTab'; 
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useTheme } from '../components/ThemeContext';
import {validateAndGeocodePostalCode} from '../api/LocationService'
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const ListingLocationPreferenceScreen = ({ route, navigation }) => {
    const isConnected = useNetworkConnectivity();
    const [zipCode, setZipCode] = useState('');
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const { logout } = useContext(AuthContext);
    const [isCreating, setIsCreating] = useState(false); // to disable button after single press
    const [selectedAddress, setSelectedAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const autocompleteRef = useRef(null);

    useHideBottomTab(navigation, true);
    
    // When the location is updated and the user is ready to navigate back, pass the updated location back as a navigation parameter
    const updateLocation = (newLocation) => {
      navigation.navigate('CreateNewListingScreen', { updatedLocation: newLocation });
    };

    const handleAddressPress = (data, details) => {
  
      if (details) {
        const address = {
          formatted_address: details.formatted_address,
          coordinates: details.geometry.location, // {"lat": <>, "lng": <>}
          city: getCity(details.address_components),
          state: getState(details.address_components),
          postalCode: getPostalCode(details.address_components),
        };
        setSelectedAddress(address);
      } else {
        setErrorMessage('Failed to fetch address details');
      }
    };
  
    const getCity = (addressComponents) => {
      const city = addressComponents.find(component =>
        component.types.includes('locality') || component.types.includes('sublocality') || component.types.includes('political')
      );
      return city ? city.long_name : '';
    };
  
    const getState = (addressComponents) => {
      const state = addressComponents.find(component =>
        component.types.includes('administrative_area_level_1')
      );
      return state ? state.short_name : '';
    };
  
    const getPostalCode = (addressComponents) => {
      const postalCode = addressComponents.find(component =>
        component.types.includes('postal_code')
      );
      return postalCode ? postalCode.long_name : '';
    };

    const updateLocationWithAddress = async() => {
      const updatedProfileData = {
        location: { 
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          coordinates: [{ latitude: selectedAddress.coordinates.lat, longitude: selectedAddress.coordinates.lng }],
          formatted_address: selectedAddress.formatted_address
        }
      };
      updateLocation(updatedProfileData.location);
    }

    const getCurrentLocation = async () => {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus !== 'granted') {
        // Show custom dialog or UI element explaining the need for location permission
        Alert.alert(
          "Location Permission",
          "We need to access your location to provide personalized content based on your area. This includes showing nearby listings and optimizing your search results.",
          [
            { 
              text: "Cancel", 
              onPress: () => {console.log('Listing location permission denied by user')}, 
              style: 'cancel'
            },
            { 
              text: "OK", 
              onPress: () => requestLocationPermission() 
            },
          ]
        );
      } else {
        const location = await Location.getCurrentPositionAsync({});
        updateLocation(location);
      }
    };

    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied",
          "Location Permission was denied. Please enable it from app settings.");
        console.log('Location Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      updateLocation(location);
    };

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

  // Dynamically set the button title
  let buttonTitle = isCreating ? "Processing..." : "Update Location";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
    >

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.topContainer}>

        <Text style={styles.heading}>Where is your item located?</Text>
        <Text style={styles.subHeading}>Your exact location is never shown to users,
          only an approximate location will be displayed in the listing.</Text>
        <Text style={styles.text}>
          Get your device's your current location.
        </Text>
        <Text style={styles.text}> or </Text>  
        <Text style={styles.text}>
          Enter an address which can be a public meetup point,
          e.g., your nearby public park. 
        </Text> 

        <ButtonComponent title="Get My Location" type="secondary" iconName="location"
          onPress={getCurrentLocation}
          style={[styles.button]}
        />

        <Text style={styles.orText}>or</Text>

        <GooglePlacesAutocomplete
          //ref={autocompleteRef}
          placeholder="Enter an Address"
          onPress={handleAddressPress}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              width: '100%',
              borderColor: colors.primary, // Set border color to orange
              borderWidth: 1, // Set border width
              backgroundColor: 'white', // Set background color to transparent
              borderRadius: spacing.sm,
            },
            textInput: {
              //height: 44,
              color: '#5d5d5d', // Color of the input text
              fontSize: 16,
              backgroundColor: 'transparent', 
              placeholderTextColor: colors.primary, 
            },
            listView: {
              backgroundColor: 'white', // Ensure dropdown list has a white background for readability
              zIndex: 1,
              flexGrow: 0,
            },
          }}
          onFail={(error) => {
            console.error(error);
            setErrorMessage(error.message);
          }}
          enablePoweredByContainer={false}
          keepResultsAfterBlur={true}
          //renderDescription={(row) => row.description || row.formatted_address || row.name}
        />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>

    </TouchableWithoutFeedback>
    <View style={styles.bottomButtonContainer}>
      <ButtonComponent 
        title={buttonTitle} 
        disabled={isCreating}
        loading={isCreating}
        type="primary" 
        onPress={updateLocationWithAddress}
        style={{ width: '100%', flexDirection: 'row' }}
      />
    </View>
    </KeyboardAvoidingView>
  );
};

const screenHeight = Dimensions.get('window').height; // Get the screen height
const marginBottom = screenHeight * 0.03; // 5% of screen height for bottom margin
const marginForUpdate = screenHeight * 0.01; 
const marginTop = screenHeight * 0.05; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    padding: spacing.size10Horizontal,
    alignItems: 'center',
  },
  heading: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.secondaryText, 
    padding: spacing.xs,
  },
  subHeading: {
    fontSize: typography.subHeading,
    color: colors.secondaryText, 
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: typography.subHeading,
    color: colors.secondaryText, 
    padding: spacing.xs,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    marginTop: marginTop,
    marginBottom: marginBottom,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthButton: {
    width: '100%', // Ensure button takes up full width
  },
  input: {
    width: '75%', 
    flexDirection: 'row',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: marginForUpdate,
    width: '100%',
    flex: 1,
    padding: spacing.size10Horizontal,
  },
  orText: {
    marginBottom: marginBottom,
    color: colors.secondaryText,
    fontSize: typography.body,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ListingLocationPreferenceScreen;
