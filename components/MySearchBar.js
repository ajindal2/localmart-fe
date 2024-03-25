import React from 'react';
import { SearchBar } from 'react-native-elements';
import { useTheme } from './ThemeContext';
import { useFonts } from 'expo-font';


const MySearchBar =  ({ value, onUpdate, navigation }) => {
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SearchBar
      placeholder="Search Localmart"
      placeholderTextColor={colors.secondaryText}
      containerStyle={{
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        width: '100%',
        alignSelf: 'center', // Centers the SearchBar in its parent container
        paddingTop: 0, // Reduces padding at the top of the container
        marginTop: 0,  // Reduces margin at the top of the container
      }}
      inputContainerStyle={{
        borderWidth: 1, // Define border width
        borderColor: colors.inputBorder, // Use border color from theme
        borderRadius: 15,
        backgroundColor: colors.white,
        paddingBottom: 0,
      }}
      inputStyle={{
        color: 'black', // Changes the text color
        fontFamily: 'Montserrat', // Set the font family
        fontSize: typography.body, //17,
      }}
      clearIcon={{ size: typography.iconSize, color: colors.iconColor }} // Customizes the clear icon
      searchIcon={{ color: colors.iconColor, size: typography.iconSize }} // Customizes the search icon
      onChangeText={onUpdate}
      value={value}
    />
  );
};

export default MySearchBar;