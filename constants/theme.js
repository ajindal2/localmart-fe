import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    primary: '#f77979', // light orange
    secondary: '#ff9191', // dark orange
    secondaryText: '#666', // eg subtitles
    inputBorder: '#d7d7d7', // light gray
    titleColor: '#000',
    iconColor: '#666',
    mediumGrey: '#d9d9d9',
    darkGrey: '#808080',
    white: '#fff',
    error: 'red',
    disabledBox: '#e0e0e0',
    separatorColor: '#e0e0e0',
    headingColor: '#000'
  },
  typography: {
    // fontSizes
    authTitle: 32 ,
    pageTitle: 20 ,
    heading: 18,
    body: 16 ,  
    price: 14,
    subHeading: 14,
    caption: 12 ,  
    iconSize: 20.
  },
  spacing: {
    xxs: 2, 
    xs: 4, // Absolute unit
    sm: 8, // Absolute unit
    //md: 0.02 * width, 
    size10: Math.max(10, Math.min(10, width * 0.02)),
    size20: Math.max(10, Math.min(20, width * 0.05)),
    xl: 32, // Absolute unit
    // more spacings...
  },
  borders: {
    radius: { sm: 4, md: 0.01 * width, lg: 16 }, // Mixing absolute and relative units
    width: { thin: 1, thick: 2 }, // Absolute units
    // more borders...
  },
  // other tokens...
};
