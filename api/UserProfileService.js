import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getUserProfile = async (userId) => {
  const token = await SecureStore.getItemAsync('token');
  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/userProfile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.ok) {
        const profile = await response.json();
        return profile;
      } else if (response.status === 404) {
        // Profile not found, return null
        return null;
      } else {
        const errorData = await response.json();
        console.error('Error fetching user profile:', errorData);
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  export const getUserLocation = async (userId) => {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/userProfile/${userId}/location`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
          const profile = await response.json();
          return profile;
        } else if (response.status === 404) {
          // Profile not found, return null or a specific message
          return null;
        } else {
          const errorData = await response.json();
          console.error('Error fetching user location:', errorData);
          throw new Error(errorData.message || 'Error fetching user location');
        }
    } catch (error) {
      console.error('Error fetching user location:', error);
      throw error;
    }
  };

  // This is not in use, use updateUserProfile instead
  export const createUserProfile = async (userId) => {
    try {
      const newProfile = {
        userId: userId,
        aboutMe: ''
      };
      const response = await fetch(`${BASE_URL}/userProfile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
      });
      if (response.ok) {
        const profile = await response.json();
        return profile;
      } else {
        const errorData = await response.json();
        console.error('Error creating user profile:', errorData);
        throw new Error(errorData.message || 'Error creating user profile');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  // This will create the profile if it does not exist.
  export const updateUserProfile = async (userId, updatedProfileData) => {
    
  const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetchWithTokenRefresh(`${BASE_URL}/userProfile/${userId}`, {
        method: 'PUT', // or 'PATCH' if you're updating partially
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfileData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating user profile');
      }
  
      const data = await response.json();
      return data; // Return the updated user data
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
  };

  export const uploadProfileImage = async (userId, imageUri) => {
    const token = await SecureStore.getItemAsync('token');
    const apiUrl = `${BASE_URL}/userProfile/${userId}/image`;
  
    // Create the form data to send to the server
    let formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // or your image's mime type
      name: 'profile-image.jpg', // or your image's name
    });
  
    try {
      const response = await fetchWithTokenRefresh(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error uploading profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };
