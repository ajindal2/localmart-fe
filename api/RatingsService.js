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
        throw new Error(errorData.message || 'Failed to fetch ratings');
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
      return []; // Return an empty array in case of an error indicating empty retings for this seller.
    }
};