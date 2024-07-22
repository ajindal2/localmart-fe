import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import ButtonComponent from '../../components/ButtonComponent';
import { AuthContext } from '../../AuthContext'; 
import useHideBottomTab from '../../utils/HideBottomTab'; 
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';
import { RadioButton } from 'react-native-paper';
import { DEFAULT_IMAGE_URI } from '../../constants/AppConstants'
import { checkRatingExists } from '../../api/RatingsService';


const BuyerConfirmationScreen = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext); 
  const isConnected = useNetworkConnectivity();
  const { buyers, listing } = route.params;
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useHideBottomTab(navigation, true);

  const handleConfirm = async () => {
    try {
      const selectedBuyer = buyers.find(buyer => buyer.buyerId === selectedBuyerId);
      if(user) {
        const ratingsExists = await checkRatingExists(listing._id, user._id, selectedBuyerId);
        if (!ratingsExists) {
        // Rating does not exist, navigate to RatingForBuyerScreen
        navigation.navigate('RatingForBuyerScreen', { selectedBuyer, listing});
        } else {
            Alert.alert('Error', 'The rating for this buyer is already recorded');
        }
      } 
    } catch (error) {
        console.error('Failed to submit rating', error);
        if (error.message.includes('RefreshTokenExpired')) {
          await logout();
        } else {
          Alert.alert('Error', 'An unknown error occured, please try again later.');
        }
    }
  }

  const ListingHeader = ({ listing }) => {
    if (!listing) return null; // Return null if listing details aren't provided
  
    return (
      <View>
        <View style={styles.headerContainer}>
          <Image source={{ uri: listing.imageUrls[0] }} style={styles.listingImage} />
          <View style={styles.listingDetails}>
            <Text style={styles.listingTitle}>
              {listing.title}
              {listing.state && listing.state.toLowerCase() === 'sold' ? ' (Sold)' : ''}
            </Text>
            <Text style={styles.listingPrice}> 
              {listing.price === 0 ? 'FREE' : `$${listing.price.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
        <ListingHeader listing={listing} />
        <View style={styles.container}>
        <Text style={styles.title}>Who bought this item?</Text>
        {buyers.map(buyer => (
            <TouchableOpacity key={buyer.buyerId} style={styles.buyerContainer} onPress={() => setSelectedBuyerId(buyer.buyerId)}>
            <Image source={buyer.profilePicture ? { uri: buyer.profilePicture } : DEFAULT_IMAGE_URI} style={styles.profileImage} />
            <View style={styles.buyerInfo}>
                <Text style={styles.buyerName}>{buyer.displayName}</Text>
                <RadioButton
                value={buyer}
                status={selectedBuyerId === buyer.buyerId ? 'checked' : 'unchecked'}
                onPress={() => setSelectedBuyerId(buyer.buyerId)}
                color={colors.primary}
                />
            </View>
            </TouchableOpacity>
        ))}
        <View style={styles.bottomButtonContainer}>
            <ButtonComponent 
            title="Rate Buyer"
            type="primary"  
            onPress={handleConfirm} 
            style={{ flexDirection: 'row' }} />
        </View>
        </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.1; 
const listingImageSize = width * 0.15; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size20Horizontal,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    borderBottomWidth: 2, // This sets the thickness of the bottom border
    borderBottomColor: colors.separatorColor, 
  },
  listingImage: {
    width: listingImageSize,
    height: listingImageSize,
    borderRadius: 8,
    marginRight: spacing.size10Horizontal,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontWeight: 'bold',
    marginTop: spacing.size10Vertical,
  },
  listingPrice: {
    fontSize: typography.body,
    color: colors.secondaryText,
  },
  title: {
    fontSize: typography.pageTitle,
    fontWeight: 'bold',
    marginBottom: spacing.size20Vertical,
  },
  bottomButtonContainer: {
   position: 'absolute', // Position the button container absolutely
    bottom: 0, // At the bottom of the parent container
    left: 0,
    right: 0,
    padding: spacing.size10Horizontal,
  },
  profileImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2, // Half of width/height to make it circular
    marginRight: spacing.size10Horizontal, // Spacing between image and buyer info
  },
  buyerContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: spacing.sm, // Rounded corners for the card
    padding: spacing.size10Horizontal,
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size20Vertical, // Space between cards
  },
  buyerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyerName: {
    fontSize: typography.heading,
    flex: 1, // take up remaining space to push the radio button to the right
  },
});

export default BuyerConfirmationScreen;
