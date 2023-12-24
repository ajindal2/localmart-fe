//import BASE_URL from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';

export const getUser = async (userId) => {
  try {
    const response = await fetch(`http://192.168.86.49:3000/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Handle errors or rethrow them
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
};

export const updateUser = async (userId, user) => {
  const token = await SecureStore.getItemAsync('token');
 
    try {
      const response = await fetch(`http://192.168.86.49:3000/users/${userId}`, {
        method: 'PUT', // or 'PATCH' if you're updating partially
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error updating User', errorData)
        throw new Error('Error updating User', errorData);
      }
  
      const data = await response.json();
      return data; // Return the updated user data
    } catch (error) {
      // Handle or throw the error depending on your error handling strategy
      throw error;
    }
  };
