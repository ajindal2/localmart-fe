import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const deleteUserAccount = async (userId) => {
  const token = await SecureStore.getItemAsync('token');

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/account/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting user account for userId ${userId}`, errorData);
      throw new Error('Error deleting account', errorData);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting user account for userId ${userId}`, error);
    throw error;
  }
};
