export const getSeller = async (sellerId) => {
    try {
      const response = await fetch(`http://192.168.86.24:3000/seller/${sellerId}`);
      if (response.ok) {
          const seller = await response.json();
          return seller;
        } else if (response.status === 404) {
          // seller not found, return null or a specific message
          return null;
        } else {
          const errorData = await response.json();
          console.error('Error fetching seller:', errorData);
          throw new Error(errorData.message || 'Error fetching seller');
        }
      } catch (error) {
        console.error('Error fetching seller:', error);
        return null;
      }
    };