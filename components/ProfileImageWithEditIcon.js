import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { DEFAULT_IMAGE_URI } from '../constants/AppConstants'

const ProfileImageWithEditIcon = React.memo(({ imageUri, onEditPress }) => {
  const { colors, typography, spacing } = useTheme();
  const imageSource = typeof imageUri === 'string' && imageUri !== '' ? { uri: imageUri } : DEFAULT_IMAGE_URI;
  const { width } = Dimensions.get('window');
  const imageSize = width * 0.4; 
  
  const baseStyles = StyleSheet.create({
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: imageSize, // Set the width and height of the image
      height: imageSize,
      borderRadius: imageSize/2, // Round the corners if you want a circular image
    },
    iconPosition: {
      position: 'absolute', // Position the icon over the image
      right: spacing.size10Horizontal, // Distance from the right edge of the image
      bottom: spacing.size10Vertical, // Distance from the bottom edge of the image
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: make the background of the icon slightly darker
      borderRadius: 12, // If you want the icon background to be circular
      padding: 6, // Size of the touchable area around the icon
    },
  });
  
  return (
    <View style={baseStyles.imageContainer}>
      <Image source={imageSource} style={baseStyles.image} />
      <TouchableOpacity onPress={onEditPress} style={baseStyles.iconPosition}>
        <MaterialIcons name="edit" size={typography.iconLarge} color="white" />
      </TouchableOpacity>
    </View>
  );
});

export default ProfileImageWithEditIcon;