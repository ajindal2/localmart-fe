import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const ButtonComponent = ({ title, type, onPress, style }) => {
  const { colors, typography, spacing } = useTheme();

  const baseButtonStyles = {
    backgroundColor: type === 'primary' ? colors.primary : 'white',
    borderColor: type === 'primary' ? 'transparent' : colors.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.size10,
    borderRadius: spacing.sm,
  };

  const baseTextStyles = {
    color: type === 'primary' ? colors.light : colors.primary,
    fontSize: typography.body,
  };

  return (
    <TouchableOpacity onPress={onPress} style={[baseButtonStyles, style]}>
      <Text style={baseTextStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;


