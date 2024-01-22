import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LocationContext } from '../components/LocationProvider';


const SearchLocationPreferenceScreen = ({ route }) => {
    const [zipCode, setZipCode] = useState('');
    const { setLocation } = useContext(LocationContext);
    
    const handleZipCodeChange = (text) => {
        if (/^\d{0,5}$/.test(text)) { // Regex for US ZIP code (0-5 digits)
        setZipCode(text);
        }
    };

    const updateLocationWithZipCode = async () => {
        if (/^\d{5}$/.test(zipCode)) {
            setLocation({ postalCode: zipCode });
            Alert.alert('Location Updated', `Location set to ZIP code: ${zipCode}`);
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
      <Text style={styles.heading}>Search Location Preference</Text>
      <Text style={styles.subHeading}>Where are you searching?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ZIP Code"
        keyboardType="numeric"
        value={zipCode}
        onChangeText={handleZipCodeChange}
      />
      <Button title="Update Location" onPress={updateLocationWithZipCode} />

      <Button 
        title="Get My Location" 
        onPress={getCurrentLocation} 
        style={styles.locationButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  locationButton: {
    marginTop: 10,
  }
});

export default SearchLocationPreferenceScreen;