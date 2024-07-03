import React, { useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useLocation } from '../components/LocationProvider';
import {validateAndGeocodePostalCode} from '../api/LocationService'
import useHideBottomTab from '../utils/HideBottomTab'; 
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useTheme } from '../components/ThemeContext';
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SearchLocationPreferenceScreen = ({ navigation, route }) => {
    const isConnected = useNetworkConnectivity();
    const [zipCode, setZipCode] = useState('');
    const { setLocation } = useLocation();
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const { user, logout } = useContext(AuthContext);
    const [isCreating, setIsCreating] = useState(false); // to disable 'update location' button after single press
    const [isUpdating, setIsUpdating] = useState(false); // to disable 'Get my location' button after single press


    useHideBottomTab(navigation, true);
    
    const handleZipCodeChange = (text) => {
      if (/^\d{0,5}$/.test(text)) { // Regex for US ZIP code (0-5 digits)
        setZipCode(text);
      }
    };

    const updateLocationWithZipCode = async () => {
      setIsCreating(true); 
      if (/^\d{5}$/.test(zipCode)) {
        try {
          const result = await validateAndGeocodePostalCode(zipCode);
          const updatedProfileData = {
            location: { 
              city: result.city,
              state: result.state,
              postalCode: result.postalCode,
              coordinates: [{ latitude: result.coordinates[1], longitude: result.coordinates[0] }],
            }
          };
          setLocation(updatedProfileData.location);
          navigation.goBack();
        } catch (error) {
          if (error.message.includes('RefreshTokenExpired')) {
            logout();
          } 
          console.error('Failed to retrieve location details:', error);
          Alert.alert('Error', error.message);
        } finally {
          setIsCreating(false); 
        }
      } else {
        Alert.alert('Invalid ZIP Code', 'Please enter a valid 5-digit ZIP code.');
        setIsCreating(false); 
      }
    };

    const getCurrentLocation = async () => {
      setIsUpdating(true); 
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus !== 'granted') {
        // Show custom dialog or UI element explaining the need for location permission
        Alert.alert(
          "Location Permission",
          "We need to access your location to provide personalized content based on your area. This includes showing nearby listings and optimizing your search results.",
          [
              { 
                  text: "Cancel", 
                  onPress: () => console.log('Search location permission denied by user'), 
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
        setLocation(location);
        navigation.goBack();
      }
      setIsUpdating(false); 
    };

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied",
            "Location Permission was denied. Please enable it from app settings.");
          console.log('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        navigation.goBack();
    };

  // Dynamically set the button title
  let buttonTitle = isCreating ? "Processing..." : "Update Location";
  let getMyLocationButtonTitle = isUpdating ? "Processing..." : "Get My Location";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Where is you searching?</Text>

      <ButtonComponent 
        title={getMyLocationButtonTitle}
        type="secondary" 
        disabled={isUpdating}
        loading={isUpdating} 
        iconName="location"
        onPress={getCurrentLocation}
        style={[styles.button]}
      />

      <Text style={styles.orText}>or</Text>

      <InputComponent
          placeholder="Enter ZIP Code"
          keyboardType="numeric"
          value={zipCode}
          editable={true}
          onChangeText={handleZipCodeChange}
          style={styles.input}
        />

      <View style={styles.bottomButtonContainer}>
        <ButtonComponent 
          title={buttonTitle} 
          disabled={isCreating}
          loading={isCreating} 
        type="primary" 
          onPress={updateLocationWithZipCode}
          style={{ width: '100%', flexDirection: 'row' }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const screenHeight = Dimensions.get('window').height; // Get the screen height
const marginBottom = screenHeight * 0.04; // 5% of screen height for bottom margin
const marginTop = screenHeight * 0.05; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
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
  button: {
    width: '75%', 
    flexDirection: 'row',
    marginTop: marginTop,
    marginBottom: marginBottom,
  },
  input: {
    width: '75%', 
    flexDirection: 'row',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: marginBottom,
    width: '100%',
  },
  orText: {
    marginBottom: marginBottom,
    color: colors.secondaryText,
    fontSize: typography.body,
  },
});

export default SearchLocationPreferenceScreen;
