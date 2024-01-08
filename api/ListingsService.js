import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
//import BASE_URL from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';

export const getListings = async (searchKey) => {
  try {
    let url = `http://192.168.86.24:3000/listings`; 
    if (searchKey) {
      // Assuming your backend uses 'title' as a query param to filter listings
      url += `?title=${encodeURIComponent(searchKey)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error; // You can also handle errors as per your app's design
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
    //console.log('Inside createListing for userid: ', userId);
    const token = await SecureStore.getItemAsync('token');
    const url = `http://192.168.86.24:3000/listings`;

    // Prepare the form data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', listingDetails.title);
    formData.append('description', listingDetails.description);
    formData.append('price', listingDetails.price);

    listingDetails.photos.forEach((photoUri, index) => {
      formData.append('images', { // Change this to 'images' to match server's expectation
        uri: photoUri,
        type: 'image/jpeg', // Adjust based on actual image type
        name: `photo${index}.jpg`, // Name of the file
      });
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        //'Content-Type': 'multipart/form-data', // Important for sending files
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