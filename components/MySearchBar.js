import React from 'react';
import { SearchBar } from 'react-native-elements';
import colors from '../constants/colors';
import { Dimensions } from 'react-native';

const MySearchBar =  ({ value, onUpdate }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <SearchBar
      placeholder="Search Localmart..."
      placeholderTextColor="gray"
      containerStyle={{
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        width: screenWidth - 80,
        alignSelf: 'center', // Centers the SearchBar in its parent container
        //marginHorizontal: 20, // Adds equal horizontal margin to both sides
        paddingTop: 0, // Reduces padding at the top of the container
        marginTop: 0,  // Reduces margin at the top of the container
      }}
      inputContainerStyle={{
        backgroundColor: colors.inputBackground, // Changes the background color of the input field
        paddingTop: 0,
        borderRadius: 15,
      }}
      inputStyle={{
        color: 'black', // Changes the text color
        fontSize: 17

      }}
      clearIcon={{ color: 'red', size: 20 }} // Customizes the clear icon
      searchIcon={{ color: 'green', size: 25 }} // Customizes the search icon
      onChangeText={onUpdate}
      value={value}
    />
  );
};

export default MySearchBar;