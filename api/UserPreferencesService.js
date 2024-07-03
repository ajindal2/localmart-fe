import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const updateSearchDistance = async (userId, searchDistance) => {
    const token = await SecureStore.getItemAsync('token');

    const url = `${BASE_URL}/user-preferences/${userId}/search-distance`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ searchDistance })
    };
  
    try {
      const response = await fetchWithTokenRefresh(url, requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error updating search distance for user ${userId}`, errorData);
        throw new Error(errorData.message || 'Failed to update search distance');
      }
  
      const updatedPreferences = await response.json();
      return updatedPreferences;
    } catch (error) {
      console.error(`Error updating search distance for ${userId}`, error);
      throw error; // Re-throw the error to be handled by the calling code
    }
  };

  export const getSearchDistance = async (userId) => {
  
    try {
      const response = await fetch(`${BASE_URL}/user-preferences/${userId}/search-distance`, {
        method: 'GET',
        headers: { },
      });
      if (response.ok) {
        const searchDistance = await response.json();
        return searchDistance;
      } else {
        const errorData = await response.json();
        console.error(`Error fetching search distance for user ${userId}`, errorData);
        throw new Error(errorData.message || 'Error fetching search distance');
      }
    } catch (error) {
      console.error(`Error fetching search distance for ${userId}`, error);
      throw error;
    }
  };
  