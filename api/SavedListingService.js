import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.86.24:3000'; 

export const getSavedListings = async (userId) => {
    try {
        // TODO: think if authorization is needed to fetch the ratings.
      const response = await fetch(`http://192.168.86.24:3000/savedListings/${userId}`);
      if (response.ok) {
          const savedListings = await response.json();
          return savedListings;
        } else {
          const errorData = await response.json();
          console.error('Failed to the saved listings:', errorData);
          throw new Error(errorData.message || 'Failed to fetch saved listings');
        }
      } catch (error) {
        console.error('Error fetching saved listings:', error);
        return []; // Return an empty array in case of an error indicating empty saved listings for this user.
      }
};

export const createSavedListing = async (userId, listingId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`http://192.168.86.24:3000/savedListings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user: userId, listing: listingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating saved listing:', errorData);
      throw new Error('Error creating saved listing');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to delete (unsave) a saved listing
export const deleteSavedListing = async (savedListingId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`http://192.168.86.24:3000/savedListings/${savedListingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Error deleting saved listing: ', errorData);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkSavedStatus = async (userId, listingId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/savedlistings/check-status/${userId}/${listingId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking saved status:', error);
    throw error;
  }
};
