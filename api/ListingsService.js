import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const getListings = async (searchKey, locationParams, page = 1, limit = 50) => {
  try {
    let url = `${BASE_URL}/listings`;
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
    // return await handleResponse(response); 

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching listings for searchKey ${searchKey}`, errorData);
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
    console.error(`Error fetching listings for searchKey ${searchKey}`, error.message);
    throw error; // Re-throw the error for calling code to handle it further
  }
};

export const getListingsByUser = async (userId) => {

  try {
    const response = await fetch(`${BASE_URL}/listings/user/${userId}`, {
      method: 'GET',
      headers: {
        //'Authorization': `Bearer ${token}`
      },
    });
    //return await handleResponse(response); 

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching listings for user ${userId}`, errorData);
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
    //return []; // Return an empty array in case of an error indicating empty seller listings for this user.
    console.error(`Error fetching listings for user ${userId}`, error.message);
    throw error; // Re-throw the error for calling code to handle it further
  }
};

export const getListingFromId = async (listingId) => {
  try {
    const response = await fetch(`${BASE_URL}/listings/${listingId}`);
    if (response.ok) {
        const listing = await response.json();
        return listing;
      } else {
        const errorData = await response.json();
        console.error(`Failed to fetch the listing ${listingId}`, errorData);
        throw new Error(errorData.message || 'Failed to fetch listing');
      }
    } catch (error) {
      console.error(`Error fetching listing ${listingId}`, error);
      throw error;
    }
};

export const createListing = async (userId, listingDetails) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const url = `${BASE_URL}/listings/${userId}`;

    // Prepare the form data
    const formData = new FormData();
    //formData.append('userId', userId);
    formData.append('title', listingDetails.title);
    formData.append('description', listingDetails.description);
    formData.append('price', listingDetails.price);

    const locationString = JSON.stringify(listingDetails.location);
    formData.append('location', locationString);

    if (listingDetails.category) {
      formData.append('category', JSON.stringify(listingDetails.category));
    }

    listingDetails.photos.forEach((photoUri, index) => {
      // Determine the file extension
      const fileExtension = photoUri.split('.').pop().toLowerCase(); // Extract extension and make it lowercase
    
      // Set the appropriate MIME type and file name extension
      let mimeType = 'image/jpeg'; // Default to JPEG
      let fileName = `photo${index}.jpg`;
    
      if (fileExtension === 'png') {
        mimeType = 'image/png';
        fileName = `photo${index}.png`; // Adjust the file extension for PNG
      }
    
      // Append the image file to the FormData object
      formData.append('images', {
        uri: photoUri,
        type: mimeType,
        name: fileName,
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
      console.error(`Error creating listing for user ${userId}`, errorData);
      throw new Error(errorData.message || 'Error creating listing');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating listing for user ${userId}`, error);
    throw error;
  }
};

export const updateListing = async (listingId, listingDetails) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const url = `${BASE_URL}/listings/${listingId}`;

    // Prepare the form data
    const formData = new FormData();
    formData.append('title', listingDetails.title);
    formData.append('description', listingDetails.description);
    formData.append('price', listingDetails.price);
    formData.append('location', JSON.stringify(listingDetails.location));

    if (listingDetails.category) {
      formData.append('category', JSON.stringify(listingDetails.category));
    }

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
      console.error(`Error updating listing ${listingId}`, errorData);
      throw new Error(errorData.message || 'Error updating listing');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating listing ${listingId}`, error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting listing ${listingId}`, errorData);
      throw new Error(errorData.message || 'Failed to delete the listing.');
    }

  } catch (error) {
    console.error(`Error deleting listing ${listingId}`, error);
    throw error; // Re-throw to allow further handling, e.g., showing an error message in the UI
  }
};

export const updateListingStatus = async (listingId, status) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/listings/${listingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating listing status ${status} for listing ${listingId}`, errorData);
      throw new Error(errorData.message || 'Failed to update listing status.');
    }
  } catch (error) {
    console.error(`Error updating listing status ${status} for listing ${listingId}`, error);
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