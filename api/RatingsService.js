import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getSellerRatings = async (sellerId) => {
  // Not adding auth to display listing without login
  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/ratings/seller/${sellerId}`);
    if (response.ok) {
        const sellerRatings = await response.json();
        return sellerRatings;
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch ratings:', errorData);
        //throw new Error(errorData.message || 'Failed to fetch ratings');
        return []; // Return an empty array in case of an error indicating empty retings for this seller.
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return []; // Return an empty array in case of an error indicating empty retings for this seller.
    }
};

export const getUserRatings = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/ratings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.ok) {
        const userRatings = await response.json();
        return userRatings;
      } else {
        const errorData = await response.json();
        console.error(`Failed to fetch ratings for user ${userId}: `, errorData);
        throw new Error(errorData.message || 'Failed to fetch ratings');
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
};

export const createRating = async (ratingDetails) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetchWithTokenRefresh(`${BASE_URL}/ratings`, { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorCode = response.status;
      console.error('Failed to create rating:', errorData);
      // ConflictException
      if (errorCode === 409) {
        throw new Error('Rating already exists');
      } else {
        throw new Error(errorData.message || 'Failed to create rating');
      }
    }

    const rating = await response.json();
    return rating;
  } catch (error) {
    console.error('Error creating rating:', error);
    throw error;
  }
};

export const checkRatingExists = async (listingId, ratedBy, ratedUser) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const queryParams = new URLSearchParams({ listingId, ratedBy, ratedUser }).toString();
    const response = await fetchWithTokenRefresh(`${BASE_URL}/ratings/exists?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const exists = await response.json(); // Directly get the boolean value
      return exists;
    } else {
      const errorData = await response.json();
      console.error('Failed to check rating existence', errorData.message);
      // Returning false. Let the user continue and add a double check when creating rating if it already exists.
     return false;
    }
  } catch (error) {
    console.error('Error checking rating existence:', error);
    // Throwing error here and not returning false since it could be token refresh error.
    throw error;
  }
};