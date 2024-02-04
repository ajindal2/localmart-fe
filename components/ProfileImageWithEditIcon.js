import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const ProfileImageWithEditIcon = ({ imageUri, onEditPress }) => {
  const { colors, typography, spacing } = useTheme();
  const imageSource = imageUri ? { uri: imageUri } : { uri: 'https://via.placeholder.com/150' }; // Fallback image if imageUri is null

  const baseStyles = StyleSheet.create({
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: 150, // Set the width and height of the image
      height: 150,
      borderRadius: 75, // Round the corners if you want a circular image
    },
    iconPosition: {
      position: 'absolute', // Position the icon over the image
      right: 10, // Distance from the right edge of the image
      bottom: 10, // Distance from the bottom edge of the image
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: make the background of the icon slightly darker
      borderRadius: 12, // If you want the icon background to be circular
      padding: 6, // Size of the touchable area around the icon
    },
  });
  
  return (
    <View style={baseStyles.imageContainer}>
      <Image source={imageSource} style={baseStyles.image} />
      <TouchableOpacity onPress={onEditPress} style={baseStyles.iconPosition}>
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileImageWithEditIcon;