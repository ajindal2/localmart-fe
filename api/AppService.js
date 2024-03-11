export const sendPushToken = async (userId, token) => {
  console.log('token for user: ', token);
  try {
    const response = await fetch(`http://192.168.86.24:3000/users/${userId}/pushToken`, {
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