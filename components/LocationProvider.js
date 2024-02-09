import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation, updateUserProfile } from '../api/UserProfileService';
import {reverseGeocode} from '../api/LocationService'
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
        if (expoLocation && expoLocation.coords) {
          try {
            const result = await reverseGeocode(expoLocation.coords.latitude, expoLocation.coords.longitude);
            const updatedProfileData = {
              location: { 
                city: result.city,
                state: result.state,
                postalCode: result.postalCode,
                coordinates: [{ latitude: result.coordinates[1], longitude: result.coordinates[0] }],
              }
            };
            await updateUserProfile(user._id, updatedProfileData);
            setLocation(updatedProfileData.location);
          } catch (error) {
            console.error('Failed to retrieve location details:', error);
            Alert.alert('Error', error.message);
          }         
        } else {
          // Handle the case where location is undefined or null
          Alert.alert('Error', 'Error occured when retrieving location');
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
    if (newLocation.coords) {
      try {
        const result = await reverseGeocode(newLocation.coords.latitude, newLocation.coords.longitude);
        const updatedProfileData = {
          location: { 
            city: result.city,
            state: result.state,
            postalCode: result.postalCode,
            coordinates: [{ latitude: result.coordinates[1], longitude: result.coordinates[0] }],
          }
        };
        await updateUserProfile(user._id, updatedProfileData);
        setLocation(updatedProfileData.location);
        navigation.navigate('HomeScreen');
      } catch (error) {
        console.error('Failed to retrieve location details:', error);
        Alert.alert('Error', error.message);
      }
    } else if (newLocation.city && newLocation.postalCode && newLocation.coordinates && newLocation.state) {
      const updatedProfileData = {
        location: { 
          city: newLocation.city,
          state:  newLocation.state,
          postalCode: newLocation.postalCode,
          coordinates: newLocation.coordinates,
        }
      };
      await updateUserProfile(user._id, updatedProfileData);
      setLocation(updatedProfileData.location);
      Alert.alert('Location Updated Successfully');
      navigation.navigate('HomeScreen');
    } else {
      // Handle the case where location is undefined or null
      Alert.alert('Error', 'Error occured when retrieving location');
      console.error('Failed to retrieve location.');
    }
};

return (
  <LocationContext.Provider value={{ location, setLocation: updateLocation }}>
    {children}
  </LocationContext.Provider>
  );
};
