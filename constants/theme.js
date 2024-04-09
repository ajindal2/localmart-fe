import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    primary: '#f77979', // light orange
    secondary: '#ff9191', // dark orange
    lightPrimary: '#fdd6d6',
    secondaryText: '#666', // eg subtitles
    inputBorder: '#d7d7d7', // light gray
    titleColor: '#000',
    iconColor: '#666',
    mediumGrey: '#d9d9d9',
    darkGrey: '#808080',
    white: '#fff',
    lightWhite: '#f4f3f4',
    error: 'red',
    disabledBox: '#e0e0e0',
    separatorColor: '#e0e0e0',
    headingColor: '#000',
    shadowColor: '#000'
  },
  typography: {
    // fontSizes
    authTitle: 32 ,
    iconLarge: 24,
    sectionTitle: 22,
    pageTitle: 20 ,
    iconSize: 20,
    heading: 18,
    body: 16 ,  
    iconSmall: 16,
    price: 14,
    subHeading: 14,
    caption: 12 ,  
    error: 12,
    small: 10,
  },
  spacing: {
    xxs: 2, 
    xs: 4, // Absolute unit
    sm: 8, // Absolute unit
    size5Horizontal: width * 0.01, 
    size10Horizontal: width * 0.02, 
    size20Horizontal: width * 0.05, 
    
    size20Vertical: height * 0.020,
    size10Vertical: height * 0.012,
    size5Vertical: height * 0.010,

    sizeLarge: width * 0.1, //30
    sizeExtraLarge: width * 0.2, //50
    sizeXXL: width * 0.3,
  },
  borders: {
    radius: { sm: 4, md: 0.01 * width, lg: 16 }, // Mixing absolute and relative units
    width: { thin: 1, thick: 2 }, // Absolute units
    // more borders...
  },
  // other tokens...
};
