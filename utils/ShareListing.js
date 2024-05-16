import { Share } from 'react-native';

const shareListing = async (listingTitle, listingUrl) => {  
  try {
    const result = await Share.share({
      message: `${listingTitle}\n\nCheck it out here: ${listingUrl}`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type:', result.activityType);
      } else {
        console.log('Listing shared');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Sharing dismissed');
    }
  } catch (error) {
    console.error(`Error during sharing listing ${listingUrl}`, error.message);
  }
};

  export default shareListing;