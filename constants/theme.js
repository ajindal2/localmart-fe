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
    // more colors...
  },
  typography: {
    // fontSizes
    authTitle: 32 ,
    pageTitle: 20 , // Absolute unit
    body: 16 ,  // Absolute unit
    price: 14,
    caption: 12 ,  // Absolute unit
    // more text styles...
  },
  spacing: {
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
