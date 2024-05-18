import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';
import { BASE_URL } from '../constants/AppConstants';

export const getSavedListings = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/savedListings/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    //return await handleResponse(response); 

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to fetch saved listings for user ${userId}`, errorData);
      let errorCode = response.status;
      if (errorCode === 404) {
        throw new Error('No listings found.');
      } else if (errorCode >= 500) {
        throw new Error('Internal server error. Please try again later.');
      } else {
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }
    }
    const data = await response.json();
    return data;

    } catch (error) {
      console.error(`Failed to fetch saved listings for user ${userId}`, error);
      throw error; // Re-throw the error for calling code to handle it further
  }
};

export const createSavedListing = async (userId, listingId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetchWithTokenRefresh(`${BASE_URL}/savedListings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user: userId, listing: listingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error creating saved listing for user ${userId}, listing ${listingId}`, errorData);
      throw new Error(errorData.message || 'Failed to create saved listing.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating saved listing for user ${userId}, listing ${listingId}`, error);
    throw error;
  }
};

// Function to delete (unsave) a saved listing
export const deleteSavedListing = async (savedListingId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetchWithTokenRefresh(`${BASE_URL}/savedListings/${savedListingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting saved listing for listing ${savedListingId}`, errorData);
      throw new Error(errorData.message || 'Failed to delete saved listing.');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting saved listing for listing ${savedListingId}`, error);
    throw error;
  }
};

export const checkSavedStatus = async (userId, listingId) => {
  // Not adding auth for user to be able to view listing without login.
  try {
    const response = await fetch(`${BASE_URL}/savedlistings/check-status/${userId}/${listingId}`);
    if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        console.error(`Error fetching saved status for user ${userId}, listing ${listingId}`, errorData);
        throw new Error(errorData.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error(`Error fetching saved status for user ${userId}, listing ${listingId}`, error);
      throw error;
    }
};

export const handleResponse = async(response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to fetch saved listings:', errorData);
    let errorCode = response.status;
    if (errorCode === 404) {
      throw new Error('No listings found.');
    } else if (errorCode >= 500) {
      throw new Error('Internal server error. Please try again later.');
    } else {
      throw new Error(errorData.message || 'An error occurred. Please try again.');
    }
  }
  const data = await response.json();
  return data;
}