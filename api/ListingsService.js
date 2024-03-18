//import BASE_URL from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getListings = async (searchKey, locationParams, page = 1, limit = 10) => {
  try {
    let url = `http://192.168.86.24:3000/listings`;
    const queryParams = new URLSearchParams();

    queryParams.append('page', page);
    queryParams.append('limit', limit);

    if (searchKey) {
      queryParams.append('title', encodeURIComponent(searchKey));
    }

    if (locationParams) {
      const { latitude, longitude, maxDistance } = locationParams;

      if (latitude != null && longitude != null) {
        queryParams.append('location.latitude', latitude);
        queryParams.append('location.longitude', longitude);

        if (maxDistance != null) {
          queryParams.append('location.maxDistance', maxDistance);
        }
      }
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url);
    return await handleResponse(response); 
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    throw error; // Re-throw the error for calling code to handle it further
  }
};

export const getListingsByUser = async (userId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/listings/user/${userId}`);
    return await handleResponse(response); 
  } catch (error) {
    //return []; // Return an empty array in case of an error indicating empty seller listings for this user.
    console.error('Error fetching listings:', error.message);
    throw error; // Re-throw the error for calling code to handle it further
  }
};

export const getListingFromId = async (listingId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/listings/${listingId}`);
    if (response.ok) {
        const listing = await response.json();
        return listing;
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch the listing:', errorData);
        throw new Error(errorData.message || 'Failed to fetch listing');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      // TODO think how to handle this error, return empty?
    }
};

export const createListing = async (userId, listingDetails) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const url = `http://192.168.86.24:3000/listings/${userId}`;

    // Prepare the form data
    const formData = new FormData();
    //formData.append('userId', userId);
    formData.append('title', listingDetails.title);
    formData.append('description', listingDetails.description);
    formData.append('price', listingDetails.price);

    const locationString = JSON.stringify(listingDetails.location);
    formData.append('location', locationString);

    listingDetails.photos.forEach((photoUri, index) => {
      formData.append('images', { // Change this to 'images' to match server's expectation
        uri: photoUri,
        type: 'image/jpeg', // Adjust based on actual image type
        name: `photo${index}.jpg`, // Name of the file
      });
    });

    const response = await fetchWithTokenRefresh(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating listing');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (listingId, listingDetails) => {
  try {
    // Assuming you're using a token for authentication
    const token = await SecureStore.getItemAsync('token');
    const url = `http://192.168.86.24:3000/listings/${listingId}`;

    // Prepare the form data
    const formData = new FormData();
    formData.append('title', listingDetails.title);
    formData.append('description', listingDetails.description);
    formData.append('price', listingDetails.price);
    formData.append('location', JSON.stringify(listingDetails.location));

    listingDetails.photos.forEach((photoUri, index) => {
      formData.append('images', {
        uri: photoUri,
        type: 'image/jpeg', // Adjust based on actual image type
        name: `photo${index}.jpg`, // Name of the file
      });
    });

    const response = await fetchWithTokenRefresh(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating listing');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/listings/${listingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete the listing.');
    }

    console.log('Listing deleted successfully:', listingId);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error; // Re-throw to allow further handling, e.g., showing an error message in the UI
  }
};

export const updateListingStatus = async (listingId, status) => {
  try {
    const response = await fetch(`http://192.168.86.24:3000/listings/${listingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update listing status.');
    }

    console.log('Listing status updated successfully:', listingId, status);
  } catch (error) {
    console.error('Error updating listing status:', error);
    throw error; // Re-throw to allow further handling, e.g., showing an error message in the UI
  }
};

export const handleResponse = async(response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to fetch listings:', errorData);
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