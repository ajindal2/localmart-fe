import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation, updateUserProfile } from '../api/UserProfileService';
import * as Location from 'expo-location';
import { AuthContext } from '../AuthContext';


export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const initializeLocation = async () => {

      if (!user) {
        // User data not available yet, return
        return;
      }

      // Think about the need to add a dialog similar to SearchLocationPreferenceScreen to educate user why we need location
      const locationPermissionAsked = await AsyncStorage.getItem('locationPermissionAsked');
      //await AsyncStorage.removeItem('locationPermissionAsked');
      console.log('locationPermissionAsked: ', locationPermissionAsked);

      // Ask for permission only once.
      if (locationPermissionAsked !== 'true') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        await AsyncStorage.setItem('locationPermissionAsked', 'true');

        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Setting your location helps you to buy or sell items near you.');
          console.error('Permission to access location was denied');
          return;
        }

        let expoLocation = await Location.getCurrentPositionAsync({});
        let cityNameConst = '';
        let postalCodeConst = '';

        if (expoLocation) {
          let response = await Location.reverseGeocodeAsync({
            latitude: expoLocation.coords.latitude,
            longitude: expoLocation.coords.longitude,
          });

          if (response.length > 0) {
            cityNameConst = response[0].city;
            postalCodeConst = response[0].postalCode;
          } 
          const updatedProfileData = {
            location: { 
              type: "Point", 
              coordinates: [expoLocation.coords.longitude, expoLocation.coords.latitude],
              city: cityNameConst,
              postalCode: postalCodeConst,
            }
          };
         
          await updateUserProfile(user._id, updatedProfileData);
          setLocation(updatedProfileData.location);
        } else {
          // Handle the case where location is undefined or null
          console.error('Failed to retrieve location.');
        }
      } else {
        // Fetch location from the backend
        const fetchedLocation = await getUserLocation(user._id);
        setLocation(fetchedLocation);
      }
    };

    initializeLocation();
  }, [user]);

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
                    type: "Point", 
                    coordinates: [newLocation.coords.longitude, newLocation.coords.latitude],
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
                type: "ZipCode", 
                postalCode: newLocation.postalCode,
            },
        };
    }

    if (Object.keys(updatedProfileData).length > 0 && user._id) { 
        try {
            await updateUserProfile(user._id, updatedProfileData);
            setLocation(updatedProfileData.location);
        } catch (error) {
            console.error('Error updating user profile:', error);
            // Handle error, e.g., show a user-friendly message or log the error
        }
    }
};

// Make sure to bind this function in the context where it is used.


  return (
    <LocationContext.Provider value={{ location, setLocation: updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
