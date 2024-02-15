//import BASE_URL from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/userProfile/${userId}`);
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
      return null;
    }
  };

export const getUserLocation = async (userId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/userProfile/${userId}/location`);
    if (response.ok) {
        const profile = await response.json();
        return profile;
      } else if (response.status === 404) {
        // Profile not found, return null or a specific message
        return null;
      } else {
        const errorData = await response.json();
        console.error('Error fetching user profile:', errorData);
        throw new Error(errorData.message || 'Error fetching user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // This is not in use, use updateUserProfile instead
  export const createUserProfile = async (userId) => {
      try {
        const newProfile = {
          userId: userId,
          aboutMe: ''
        };
        const response = await fetch('http://192.168.86.24:3000/userProfile/', {
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
    console.log('Profile update for userId', userId );
    console.log('Updated profile is: ', JSON.stringify(updatedProfileData));
    
  const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetchWithTokenRefresh(`http://192.168.86.24:3000/userProfile/${userId}`, {
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
    const apiUrl = `http://192.168.86.24:3000/userProfile/${userId}/image`;
  
    // Create the form data to send to the server
    let formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // or your image's mime type
      name: 'profile-image.jpg', // or your image's name
    });
  
    // Send the request to the server
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
        const errorData = await response.text();
        throw new Error(`Server Error: ${errorData}`);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };
