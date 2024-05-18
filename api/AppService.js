import { BASE_URL } from '../constants/AppConstants';

const MAX_RETRIES = 3;
const RETRY_DELAY = 10000; // 10 seconds

export const sendPushToken = async (userId, token, attempt = 0) => {
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
      const errorData = await response.json();
      console.error(`Error sending push token ${token} for user ${userId}`, errorData);
      throw new Error(`Error sending push token: ${response.status}`);
    }

  } catch (error) {
    console.error(`Attempt ${attempt + 1}: Failed to store token ${token} for user ${userId}`, error);
    if (attempt < MAX_RETRIES) {
      // Use setTimeout to retry with a delay
      setTimeout(() => sendPushToken(userId, token, attempt + 1), RETRY_DELAY);
    } else {
      // Handle the case when max retries are exceeded
      console.error(`Exceeded max retries to store token ${token} for user ${userId}`, error);
    }
  }
};