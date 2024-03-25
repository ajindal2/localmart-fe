import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import { useTheme } from '../components/ThemeContext';

const WelcomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  if (!fontsLoaded) {
    return null; // Or a loading indicator if you prefer
  }

  const buttonWidth = (Dimensions.get('window').width / 2) - 30 ;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/bckgrnd.png')} 
        resizeMode="cover" 
        style={styles.imageBackground}
      >
        <Text style={styles.title}>Welcome to LocalMart!</Text>
        <Text style={styles.description}>Your local marketplace for everything you need.</Text>
      </ImageBackground>
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

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '50%',
    justifyContent: 'flex-end',
    padding: spacing.size20Horizontal,
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
    padding: spacing.size20Horizontal, // Only apply padding to the sides
  },
  // Button styles are moved to ButtonComponent
});

export default WelcomeScreen;
