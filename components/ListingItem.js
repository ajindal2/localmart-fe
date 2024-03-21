import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { useTheme } from './ThemeContext';

const ListingItem = ({ item, onPress }) => {
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
    const STOCK_IMAGE_URI = require('../assets/stock-image.png'); 

    const convertMetersToMiles = (meters) => {
      return meters * 0.000621371;
    };

    if (!item || !item.title) {
        return <View style={styles.invisibleItem} />;
    }

    const renderDistance = () => {
      if (item.distance) {
        return (
          <>
            <Text style={styles.dot}> · </Text>
            <Text style={styles.distance}>{convertMetersToMiles(item.distance).toFixed(2)} mi</Text>
          </>
        );
      }
      return null;
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.itemContainer}>
        <View style={styles.infoContainer}>
        <Image 
          source={item?.imageUrls?.[0] ? { uri: item.imageUrls[0] } : require('../assets/stock-image.png')}
          style={styles.image} 
        />      
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <View style={styles.priceDistanceContainer}>
            {typeof item?.price === 'number' && (
              <Text style={styles.price}>${item.price}</Text>
            )}
            {/* Conditional rendering for distance */}
            {renderDistance()}    
          </View>
        </View>
      </TouchableOpacity>
    );
  };

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: spacing.size10,
    //width: 150,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 0, // No radius for the bottom left corner
    borderBottomRightRadius: 0, // No radius for the bottom right corner
  },
  infoContainer: {
    backgroundColor: '#fff', // Use a background color for the info box
    //padding: spacing.size10,
    borderTopLeftRadius: 5, // Only round the top left corner
    borderTopRightRadius: 5, // Only round the top right corner
    borderBottomLeftRadius: 5, // No radius for the bottom left corner
    borderBottomRightRadius: 5, // No radius for the bottom right corner
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  priceDistanceContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
  },
  title: {
    fontWeight: 'bold',
    fontSize: typography.body,
    paddingTop: 5,
    paddingLeft: 5,
    overflow: 'hidden',
    width: '100%',
  },
  price: {
    fontSize: typography.price,
    color: colors.secondaryText,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  dot: {
    fontSize: typography.body,
    color: colors.secondaryText,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  distance: {
    fontSize: typography.price,
    color: colors.secondaryText,
   // paddingLeft: 5,
    paddingBottom: 5,
  },
  invisibleItem: {
    flex: 1,
    flexDirection: 'column',
    padding: spacing.size10,
    opacity: 0, // Make the item invisible
  }
});

export default ListingItem;
