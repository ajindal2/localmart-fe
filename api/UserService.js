import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getUser = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating User ${userId}`, errorData);
      throw new Error('Error getting User', errorData);
    }
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
};

export const updateUser = async (userId, user) => {
  const token = await SecureStore.getItemAsync('token');
 
    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/users/${userId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error updating User ${userId}`, errorData);
        throw new Error('Error updating User', errorData);
      }
  
      const data = await response.json();
      return data; // Return the updated user data
    } catch (error) {
      console.error(`Error updating User ${userId}`, error);
      throw error;
    }
  };

  export const updatePassword = async (userId, currentPassword, newPassword) => {
    const token = await SecureStore.getItemAsync('token');

    const requestBody = {
      currentPassword,
      newPassword,
    };
  
    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/users/${userId}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
      // Handling !response.ok is done on the screen
      return response;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };
  
