import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { useTheme } from './ThemeContext';

const ListingItem = ({ item, onPress }) => {
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);

    if (!item || !item.title) {
        return <View style={styles.invisibleItem} />;
    }

    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.itemContainer}>
        <View style={styles.infoContainer}>
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
        
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
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
  title: {
    fontWeight: 'bold',
    fontSize: typography.price,
    paddingTop: 5,
    paddingLeft: 5,
    overflow: 'hidden',
    width: '100%',
  },
  price: {
    fontSize: typography.caption,
    color: colors.secondaryText,
    paddingLeft: 5,
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
