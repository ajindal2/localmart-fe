import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../AuthContext'; 
import { getListingsByUser } from '../../api/ListingsService'; 
import useHideBottomTab from '../../utils/HideBottomTab'; 
import CustomActionSheet from '../../components/CustomActionSheet'; 
import { useTheme } from '../../components/ThemeContext';
import ButtonComponent from '../../components/ButtonComponent';

const ViewMyListingScreen = ({navigation}) => {
  const [listings, setListings] = useState([]);
  const { user } = useContext(AuthContext); 
  const [activeItemId, setActiveItemId] = useState(null);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useHideBottomTab(navigation, true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const fetchedListings = await getListingsByUser(user._id);
        setListings(fetchedListings);
      } catch (error) {
        console.error('Failed to load listings:', error);
        // Handle error (e.g., show a message)
      }
    };

    loadListings();
  }, [user._id]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ButtonComponent iconName="create-outline" type="primary" round={true}
        onPress={() => navigation.navigate('ListingStack', {
          screen: 'CreateNewListingScreen',
          params: {
            isEditing: false, 
            fromAccount: true, // To hide the bottom tab when navigating from here.
          },
        })}
       style={{ marginRight: 20 }}/>
        
      ),
    });
  }, [navigation]);

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
      icon: 'pencil-outline',
      text: 'Edit Listing',
      onPress: () => {
        navigation.navigate('ListingStack', {
          screen: 'CreateNewListingScreen',
          params: {
            isEditing: true, 
            listing: item,
            fromAccount: true, // To hide the bottom tab when navigating from here.
          },
        });
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
      onPress={() =>  navigation.navigate('ViewListingStack', { 
        screen: 'ViewListing', 
        params: { item }
      })}
    >
      <Image source={{ uri: item.imageUrls[0] }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={styles.listingDetails}>
        {`$${item.price.toFixed(2)}`} · {new Date(item.dateCreated).toLocaleDateString()}
      </Text>
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={() => handleOpenActionSheet(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="grey" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const actionSheetOptions = listings
  .filter(item => item._id === activeItemId)
  .map(item => getActionSheetOptions(item))[0] || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={item => item._id}
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  createButtonText: {
    marginLeft: 5,
    color: 'black',
  },
  listingItem: {
    flexDirection: 'row',
    padding: spacing.size10,
    alignItems: 'center',
  },
  listingImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 8,
    marginRight: spacing.size10,
  },
  listingInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.size10,
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  listingDetails: {
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

export default ViewMyListingScreen;


/*
Error Handling: The screen should handle potential errors while fetching listings, such as showing an error message or a retry button.

Loading State: Consider adding a loading indicator while the listings are being fetched.

Empty State: Display a message when the user has no listings.

Styling: Adjust the styling according to your app's design theme.

Image Handling: The code assumes that the first image URL in the imageUrls array is the main image for the listing. Make sure this aligns with your data structure. Also, handle cases where an image might not be available.

Navigation Parameters: When navigating to the ViewListing screen, pass the necessary parameters (e.g., listingId) that the ViewListing screen might require to fetch and display the specific listing details.


*/
