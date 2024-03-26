import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from './ThemeContext';
import { Ionicons } from '@expo/vector-icons'; 

const ButtonComponent = ({ title, iconName, iconSize = 20, iconColor, type, onPress, style, round = false,  disabled = false,
  loading = false }) => {
  const { colors, typography, spacing } = useTheme();

  // Determine the size of the round button based on the iconSize
  const roundButtonSize = iconSize * 2;

  const baseButtonStyles = StyleSheet.create({
    button: {
      backgroundColor: type === 'primary' ? colors.primary : 'white',
      borderColor: type === 'primary' ? 'transparent' : colors.primary,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding:  round ? 0 : spacing.size10Horizontal,
      borderRadius: round ? roundButtonSize / 2 : spacing.sm,
      width: round ? roundButtonSize : 'auto', // Set width for round button
      height: round ? roundButtonSize : 'auto', // Set height for round button
      //marginRight: round ? spacing.size10 : 0,
      flexDirection: 'row', // Allows icon and text to be in the same row
    },
    text: {
      color: type === 'primary' ? colors.white : colors.primary,
      fontSize: typography.body,
      marginLeft: iconName && !round ? spacing.size5Horizontal : 0, // Add margin only if there is an icon and it's not a round button
    },
    icon: {
      color: iconColor || (type === 'primary' ? colors.white : colors.primary), // Use iconColor prop or default to button text color
    },
    activityIndicator: {
      marginLeft: spacing.size10Horizontal,
      marginRight: spacing.size5Horizontal,
    }
  });

  return (
    <TouchableOpacity 
      onPress={!disabled && !loading ? onPress : undefined} 
      disabled={disabled || loading}
      style={[baseButtonStyles.button, style]}
    >
      {iconName && !loading && (
        <Ionicons
          name={iconName}
          size={iconSize}
          color={baseButtonStyles.icon.color}
          style={title ? { marginRight: spacing.size10Horizontal } : {}}
        />
      )}
      {loading && (
        <ActivityIndicator
          size="small"
          color={type === 'primary' ? colors.white : colors.primary}
          style={baseButtonStyles.activityIndicator}
        />
      )}
      {title && <Text style={baseButtonStyles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default ButtonComponent;


