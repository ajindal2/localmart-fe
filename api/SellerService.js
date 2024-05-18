import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getSeller = async (sellerId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/seller/${sellerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (response.ok) {
        const seller = await response.json();
        return seller;
      } else if (response.status === 404) {
        // seller not found, return null or a specific message
        return null;
      } else {
        const errorData = await response.json();
        console.error(`Error fetching seller details for seller id ${sellerId}`, errorData);
        throw new Error(errorData.message || 'Error fetching seller');
      }
    } catch (error) {
      console.error(`Error fetching seller details for seller id ${sellerId}`, error);
      throw error;
    }
};

export const getSellerLocation = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/seller/${userId}/location`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    // BE return a null lcoation if it does not exist
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      console.error(`Error fetching seller location for user id ${userId}`, errorData);
      throw new Error(errorData.message || 'Error fetching seller');
    }
  } catch (error) {
    console.error(`Error fetching seller location for user id ${userId}`, error);
    throw error;
  }
};