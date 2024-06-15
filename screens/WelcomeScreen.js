import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import { useTheme } from '../components/ThemeContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import {APP_NAME_IMAGE, BASKET_IMAGE} from '../constants/AppConstants';


const WelcomeScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();

  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  if (!fontsLoaded) {
    return null; // Or a loading indicator if you prefer
  }

  const buttonWidth = (Dimensions.get('window').width / 2) - 30 ;

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={APP_NAME_IMAGE} style={styles.logo} />
      <Image source={BASKET_IMAGE} style={styles.basket} />
      
        <Text style={styles.title}>Connecting Local Farms to Local Tables!</Text>
        <Text style={styles.description}>Your marketplace for everything local - backyard produce, eggs, honey, produce, plants and much more.</Text>
      
      <View style={styles.buttonContainer}>
        <ButtonComponent 
          title="Login" 
          type="secondary" 
          onPress={() => navigation.navigate('LoginScreen')}
          style={{ width: buttonWidth, marginRight: spacing.size10Horizontal }}
        />
        <ButtonComponent 
          title="Signup" 
          type="primary" 
          onPress={() => navigation.navigate('RegisterScreen')}
          style={{ width: buttonWidth, marginLeft: spacing.size10Horizontal }}
        />
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const logoSize = width * 0.5; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size20Horizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: logoSize,
    height: 0.25 * logoSize,
  },
  basket: {
    width: 1.1 * logoSize,
    height: 1.1 * logoSize,
  },
  title: {
    fontSize: typography.authTitle,
    fontFamily: 'Montserrat', 
    color: colors.titleColor, 
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body,
    fontFamily: 'Montserrat', 
    color: colors.secondaryText, 
    textAlign: 'center',
    marginTop: spacing.size10Vertical,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust to 'space-between' for even spacing
    width: '100%',
    paddingTop: spacing.size20Horizontal,
    //padding: spacing.size20Horizontal, // Only apply padding to the sides
  },
  // Button styles are moved to ButtonComponent
});

export default WelcomeScreen;
