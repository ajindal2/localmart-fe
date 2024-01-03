export const getSellerRatings = async (sellerId) => {
    try {
        // TODO: think if authorization is needed to fetch the ratings.
      const response = await fetch(`http://192.168.86.24:3000/ratings/seller/${sellerId}`);
      if (response.ok) {
          const sellerRatings = await response.json();
          return sellerRatings;
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch ratings:', errorData);
          throw new Error(errorData.message || 'Failed to fetch ratings');
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
        return []; // Return an empty array in case of an error indicating empty retings for this seller.
      }
    };