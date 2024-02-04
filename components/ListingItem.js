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
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
        </TouchableOpacity>
    );
    };

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: spacing.size10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: typography.body,
    paddingTop: spacing.size10,
    overflow: 'hidden',
    width: '100%',
  },
  price: {
    fontSize: typography.price,
    color: colors.secondaryText,
  },
  invisibleItem: {
    flex: 1,
    flexDirection: 'column',
    padding: spacing.size10,
    opacity: 0, // Make the item invisible
  }
});

export default ListingItem;
