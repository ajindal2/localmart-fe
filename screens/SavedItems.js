import React, { useCallback, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { getSavedListings, deleteSavedListing } from '../api/SavedListingService'; 
import useHideBottomTab from '../utils/HideBottomTab'; 
import CustomActionSheet from '../components/CustomActionSheet'; 
import { useTheme } from '../components/ThemeContext';

const SavedItems = ({navigation, route}) => {
  const { user } = useContext(AuthContext);
  const [savedListings, setSavedListings] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null);
  const fromAccount = route.params?.fromAccount;
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const fetchSavedListings = async () => {
    try {
      const data = await getSavedListings(user._id); // Fetch saved listings from backend
      setSavedListings(data);
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    }
  };

  useHideBottomTab(navigation, fromAccount);

  useFocusEffect(
    useCallback(() => {
      fetchSavedListings();
    }, [user._id])
  );

  const getActionSheetOptions = (item) => [
    {
      icon: 'share-social-outline',
      text: 'Share Listing',
      onPress: () => {
        console.log('Sharing listing:', item._id);
        setActiveItemId(null);
      },
    },
    {
      icon: 'trash-outline',
      text: 'Unsave Listing',
      onPress: () => {
        unsaveListing(item);
        setActiveItemId(null);
      },
    },
  ];

  const handleOpenActionSheet = (item) => {
    setActiveItemId(item._id); 
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listingItem}
      onPress={() => {
        if (item.listing) {
          navigation.navigate('ViewListingStack', { 
            screen: 'ViewListing', 
            params: { item: item.listing }
          });
        } else {
          console.log('Listing is null, navigation aborted');
          // Optionally, you can show an alert or a toast message here
        }
      }}
    >
      <Image source={{ uri: item.listing.imageUrls[0] }} style={styles.image} />
      <View style={styles.listingInfo}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.listing.title}
        </Text>
        <Text style={styles.price}>${item.listing.price}</Text>
        <Text style={styles.state}> {item.listing.state}</Text>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOpenActionSheet(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="grey" />
      </TouchableOpacity>

    </TouchableOpacity>
  );

  const shareListing = (item) => {
    // Implement sharing functionality
    // You can use React Native's Share API or a custom method
  };

  const unsaveListing = async (item) => {
    try {
      await deleteSavedListing(item._id); // API call to unsave the listing
      // Update the state to remove the unsaved item
      setSavedListings(currentSavedListings => 
        currentSavedListings.filter(listing => listing._id !== item._id)
      );
    } catch (error) {
      console.error('Error unsaving the listing:', error);
      // Optionally, handle error (e.g., show a toast notification)
    }
  };

  const formatDate = (dateString) => {
    // Format the date string into a more readable format
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const actionSheetOptions = savedListings
  .filter(item => item._id === activeItemId)
  .map(item => getActionSheetOptions(item))[0] || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={savedListings}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
     <CustomActionSheet
        isVisible={activeItemId !== null}
        onClose={() => setActiveItemId(null)}
        options={actionSheetOptions}
      />
  </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width * 0.2; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listingItem: {
    flexDirection: 'row',
    padding: spacing.size10,
    alignItems: 'center',
  },
  image: {
    width: imageSize, 
    height: imageSize, 
    borderRadius: imageSize / 8, 
    marginRight: spacing.size10,
  },
  listingInfo: {
    flex: 1,
    marginLeft: spacing.size10,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  price: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  state: {
    fontSize: typography.price,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  optionsButton: {
    padding: spacing.size10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.inputBorder,
    margin: spacing.xs
  },
});

export default SavedItems;
