import { BASE_URL } from '../constants/AppConstants';

export const sendPushToken = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/pushToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending push token:', error);
  }
}