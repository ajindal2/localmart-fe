import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
//import BASE_URL from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';

export const getListings = async (searchKey) => {
  try {
    let url = `http://192.168.86.49:3000/listings`; 
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