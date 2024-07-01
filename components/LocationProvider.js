import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation, updateUserProfile } from '../api/UserProfileService';
import {reverseGeocode} from '../api/LocationService'
import * as Location from 'expo-location';
import { AuthContext } from '../AuthContext';


const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const initializeLocation = async () => {

      if (!user) {
        // User data not available yet, return
        return;
      }

      // Think about the need to add a dialog similar to SearchLocationPreferenceScreen to educate user why we need location
      const locationPermissionAsked = await AsyncStorage.getItem('locationPermissionAsked');
      // Ask for permission only once.
      if (locationPermissionAsked !== 'true') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        await AsyncStorage.setItem('locationPermissionAsked', 'true');

        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Setting your location helps you to buy or sell items near you.');
          console.error(`Permission to access location was denied for user ${user._id}`);
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
                formatted_address: result.formatted_address,
              }
            };
            await updateUserProfile(user._id, updatedProfileData);
            setLocation(updatedProfileData.location);
          } catch (error) {
            console.error('Failed to retrieve location details:', error);
            if (error.message.includes('RefreshTokenExpired')) {
              logout();
            }
            Alert.alert('Error', 'Error occured when retrieving user location');
          }         
        } else {
          // Handle the case where location is undefined or null
          Alert.alert('Error', 'Error occured when retrieving user location');
          console.error('Failed to retrieve location.');
        }
      } else {
          try {
            // Fetch location from the backend
            const fetchedLocation = await getUserLocation(user._id);
            if (fetchedLocation) {
              const location = {
                city: fetchedLocation.city,
                state: fetchedLocation.state,
                postalCode: fetchedLocation.postalCode,
                formatted_address: fetchedLocation.formatted_address
              };

              if (fetchedLocation.coordinates && fetchedLocation.coordinates.coordinates) {
                location.coordinates = [{
                  latitude: fetchedLocation.coordinates.coordinates[1],
                  longitude: fetchedLocation.coordinates.coordinates[0]
                }];
              }

              setLocation(location);
          }
          } catch (error) {
            if (error.message.includes('RefreshTokenExpired')) {
              logout();
            } else {
              console.error(`Error occured when retrieving user location for user ${user._id}`);
            }
          }
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
            formatted_address: result.formatted_address,
          }
        };
        await updateUserProfile(user._id, updatedProfileData);
        setLocation(updatedProfileData.location);
       // navigation.navigate('HomeScreen');
      } catch (error) {
        console.error('Failed to retrieve location details:', error);
        Alert.alert('Error', 'Error occured when retrieving location');
      }
    } else if (newLocation.city && newLocation.postalCode && newLocation.coordinates && newLocation.state) {
      const updatedProfileData = {
        location: { 
          city: newLocation.city,
          state:  newLocation.state,
          postalCode: newLocation.postalCode,
          coordinates: newLocation.coordinates,
          formatted_address: newLocation.formatted_address,
        }
      };
      await updateUserProfile(user._id, updatedProfileData);
      setLocation(updatedProfileData.location);
      Alert.alert('Location Updated Successfully');
      //navigation.navigate('HomeScreen');
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

export const useLocation = () => {
  return useContext(LocationContext);
};