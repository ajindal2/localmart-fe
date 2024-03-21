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
      throw new Error(`Error sending push token: ${response.status}`);
    }

    console.log(`Token stored successfully on attempt ${attempt + 1}`);
  } catch (error) {
    console.error(`Attempt ${attempt + 1}: Failed to store token`, error);
    if (attempt < MAX_RETRIES) {
      // Use setTimeout to retry with a delay
      setTimeout(() => sendPushToken(userId, token, attempt + 1), RETRY_DELAY);
    } else {
      // Handle the case when max retries are exceeded
      console.error('Exceeded max retries to store token for user: ', userId, token);
    }
  }
};