import { BASE_URL } from '../constants/AppConstants';

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
        throw new Error('Failed to send forgot password email');
      }
      return response.json();
    } catch (error) {
      console.error('Error handling forgot password', error);
      throw error; 
    }
  };

  export const forgotUserName = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-username`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to send forgot username email');
      }
    
      return response.json();
    } catch (error) {
      console.error('Error handling forgot username', error);
      throw error; 
    }
    };