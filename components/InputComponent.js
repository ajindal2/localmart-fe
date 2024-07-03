import React from 'react';
import { TextInput, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

const InputComponent = ({ placeholder, value, onChangeText, secureTextEntry, multiline, keyboardType, editable, style, textAlignVertical }) => {
  const { colors, typography, spacing } = useTheme();

  // Move the styles inside the component to access the theme
  const inputStyles = StyleSheet.create({
    input: {
      width: '100%', // Use full width of the container
      padding: 5, // Adjust padding
      marginVertical: 5, // Add some vertical margin for spacing
      borderWidth: 1, // Define border width
      borderColor: colors.inputBorder, // Use border color from theme
      borderRadius: 5, // Round the corners
      // You can also use other theme values like `typography` and `spacing` here
    },
  });

  return (
    <TextInput
      style={[inputStyles.input, style]} 
      color={editable ? colors.secondaryText : '#c3c3c3'}
      placeholder={placeholder}
      placeholderTextColor={editable ? colors.secondaryText : '#c3c3c3'} 
      cursorColor={colors.primary}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      editable={editable}
      textAlignVertical={textAlignVertical}
      selectionColor={colors.primary}
    />
  );
};

export default InputComponent;
