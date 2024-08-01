import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, Alert } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import { useTheme } from '../components/ThemeContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import {APP_NAME_IMAGE, BASKET_IMAGE} from '../constants/AppConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WelcomeScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();

  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useEffect(() => {
    const checkAndShowAlert = async () => {
      try {
        const hasShownAlert = await AsyncStorage.getItem('hasShownAlert');
        if (hasShownAlert === null) {
          // Show the alert
          Alert.alert(
            "Welcome",
            "This app is currently limited to the Bay Area, California. If you're outside this area, please sign up for our waitlist at https://farmvox.com, and we'll notify you when we expand to your location.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );

          // Set the flag so the alert won't be shown again
          await AsyncStorage.setItem('hasShownAlert', 'true');
        }
      } catch (error) {
        console.error("Error checking or setting AsyncStorage", error);
      }
    };

    checkAndShowAlert();
  }, []);
  
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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
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
