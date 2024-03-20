import { BASE_URL } from '../constants/AppConstants';

// TODO add try-catch
export const forgotPassword = async (email) => {
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
  };

  export const forgotUserName = async (email) => {
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
    };