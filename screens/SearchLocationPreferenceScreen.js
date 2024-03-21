import React, { useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LocationContext } from '../components/LocationProvider';
import {validateAndGeocodePostalCode} from '../api/LocationService'
import useHideBottomTab from '../utils/HideBottomTab'; 
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useTheme } from '../components/ThemeContext';

const SearchLocationPreferenceScreen = ({ navigation, route }) => {
    const [zipCode, setZipCode] = useState('');
    const { setLocation } = useContext(LocationContext);
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);

    useHideBottomTab(navigation, true);
    
    const handleZipCodeChange = (text) => {
      if (/^\d{0,5}$/.test(text)) { // Regex for US ZIP code (0-5 digits)
        setZipCode(text);
      }
    };

    const updateLocationWithZipCode = async () => {
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
         
        } catch (error) {
          console.error('Failed to retrieve location details:', error);
          Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Invalid ZIP Code', 'Please enter a valid 5-digit ZIP code.');
      }
    };

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
                  onPress: () => console.log('Permission denied by user'), 
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
      }
    };

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where is you searching?</Text>

      <ButtonComponent title="Get My Location" type="secondary" iconName="location"
        onPress={getCurrentLocation}
        style={[styles.button]}
      />

      <Text style={styles.orText}>or</Text>

      <InputComponent
          placeholder="Enter ZIP Code"
          keyboardType="numeric"
          value={zipCode}
          onChangeText={handleZipCodeChange}
          style={styles.input}
        />

      <View style={styles.bottomButtonContainer}>
        <ButtonComponent title="Update Location" type="primary" 
          onPress={updateLocationWithZipCode}
          style={{ width: '100%', flexDirection: 'row' }}
        />
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height; // Get the screen height
const marginBottom = screenHeight * 0.04; // 5% of screen height for bottom margin
const marginTop = screenHeight * 0.05; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size10,
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
