import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../constants/AppConstants';

export const fetchWithTokenRefresh = async (url, options) => {
  try {
    let response = await fetch(url, options);  
    
    if (response.status === 401) { // Token expired
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      console.log('Token expired');

      // Attempt to refresh the token
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        // Refresh token is expired or invalid, clear tokens and redirect to login
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        console.error('Refresh token is expired or invalid');
        throw new Error('RefreshTokenExpired');
      }

      const { access_token, refresh_token } = await refreshResponse.json();

      // Store the new tokens
      await SecureStore.setItemAsync('token', access_token);
      await SecureStore.setItemAsync('refreshToken', refresh_token);

      // Retry the original request with the new token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${access_token}`,
        },
      };

      response = await fetch(url, newOptions);
    }

    return response;
  } catch (error) {
    console.error('Error in fetchWithTokenRefresh:', error);
    throw error; // Re-throw the error so it can be caught and handled by the calling function
  }
};