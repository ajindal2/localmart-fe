import { BASE_URL } from '../constants/AppConstants';
import * as SecureStore from 'expo-secure-store';
import { fetchWithTokenRefresh } from '../api/FetchService';

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      let errorCode = response.status;
      if (errorCode === 429) {
        throw new Error('Too many requests. Please try again in sometime.');
      } else {
        throw new Error('Failed to send forgot password email');
      }
    }
    return response.json();
  } catch (error) {
    console.error('Error handling forgot password', error);
    throw error; 
  }
};

export const sendContactUsForm = async (data, file) => {
  const token = await SecureStore.getItemAsync('token');

  const formData = new FormData();
  formData.append('subject', data.subject);
  formData.append('message', data.message);
  formData.append('email', data.email);
  
  if (file) {
    // Ensure the file object is correctly structured
    formData.append('attachment', {
        uri: file.uri,
        name: file.name || 'unnamed_file', // Some backend systems require a filename
        type: file.type || 'application/octet-stream' // Some backends require MIME type
    });
  }

  try {
    const response = await fetchWithTokenRefresh(`${BASE_URL}/auth/contact-us`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error sending email');
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Failed to send contact us email:', error);
    throw error;
  }
}

export const invalidateRefreshToken = async() => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      return await response.json(); 
    }
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
  }
}

