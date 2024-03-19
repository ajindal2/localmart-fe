import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const reverseGeocode = async (lat, lng) => {
  const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/location/reverse-geocode?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
  
      if (!response.ok) {
        if (data.message.includes('Invalid postal code format')) {
          throw new Error('Location is not in the United States.');
        } else {
          throw new Error(data.message || 'Failed to fetch location. Please try again.');
        }
      }
  
      return data; // Contains city, postalCode, and coordinates
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };

  export const validateAndGeocodePostalCode = async (postalCode) => {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/location/validate-postal?postalCode=${postalCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
  
      if (!response.ok) {
        if (data.message.includes('Invalid postal code format')) {
          throw new Error('Invalid postal code format. Please check and try again.');
        } else if (data.message.includes('Postal code not found')) {
          throw new Error('Postal code not found. Please enter a valid postal code.');
        } else if (data.message.includes('Postal code is not within the United States')) {
          throw new Error('Postal code is not within the United States.');
        } else {
          throw new Error(data.message || 'Failed to fetch location. Please try again.');
        }
      }
  
      return data;
    } catch (error) {
      console.error('Validate Postal Code Error:', error.message);
      throw error;
    }
  };