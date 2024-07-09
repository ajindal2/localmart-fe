import React, { useState} from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import { CheckBox } from 'react-native-elements';
import InputComponent from '../components/InputComponent';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { BASE_URL } from '../constants/AppConstants';
import {APP_NAME_IMAGE} from '../constants/AppConstants';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const RegisterScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Clear the errors state when the screen is focused
      setErrors({}); 
      // clear the form fields 
       setEmailAddress('');
       setPassword('');
       setDisplayName('');
    }, [])
  );

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    if (!agreeToTerms) {
      isValid = false;
      newErrors.agreeToTerms = 'You must agree to the privacy policy and terms of service.';
    }

    if (password !== confirmPassword) {
      isValid = false;
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Email validation (use a more robust regex in production)
    if (!emailAddress || !/\S+@\S+\.\S+/.test(emailAddress)) {
      isValid = false;
      newErrors.emailAddress = 'Please enter a valid email address.';
    }
  
    // Password validation
    if (!password || password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/(?=.*[!@#$%^&*])/.test(password)) {
      isValid = false;
      newErrors.password = 'Password must be at least 6 characters, contain an uppercase letter, a number, and a special character.';
    }    

    // DisplayName validation
    if (!displayName || displayName.length < 2 || displayName.length > 30) {
      isValid = false;
      newErrors.displayName = 'Display Name must be between 2 and 30 characters.';
    } else if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(displayName)) {
      isValid = false;
      newErrors.displayName = 'Display name must start with a letter and can only contain letters, numbers, and spaces.';
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    setIsCreating(true); 
    if (!validateInput()) {
      // Input validation failed
      setIsCreating(false); 
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({displayName, emailAddress, password }),
    });

    // Check if the response is as expected
    if (response.ok) {
      // Handle success
      const data = await response.json(); // Parsing the response as JSON
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('LoginScreen');     
    } else {
      // Handle server-side validation errors
      const errorData = await response.json();
      if (errorData.errors) {
        setErrors(errorData.errors);
      } else {
        // Handle other types of errors (e.g., not related to validation)
        Alert.alert('Error', errorData.message || 'An error occurred during registration');
      }
    }
  } catch (error) {
    // Handle network errors or errors returned from the server
    console.error('Error in registration:', error);
    Alert.alert('Registration Error', 'An error occurred during registration. Please try again in sometime.');
    } finally {
      setIsCreating(false); 
    }
  };

  const handleLoginScreen = React.useCallback(() => {
    navigation.navigate('LoginScreen');
  }, [navigation]);

  const openPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicyScreen');
  };

  const openTermsOfService = () => {
    navigation.navigate('TermsScreen');
  };

  // Dynamically set the button title
  let buttonTitle = isCreating ? "Processing..." : "Register";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null; // Or a loading indicator if you prefer
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
      <Image source={APP_NAME_IMAGE} style={styles.logo} />
      <Text style={styles.title}>Join FarmVox</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={typography.iconSize} color={colors.iconColor} />
        <InputComponent
          placeholder="Display Name"
          value={displayName}
          editable={true}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => Alert.alert("Display Name Info", "Your display name is how others will see you in the app. It can be a nickname or the name of your business.")}>
          <Ionicons name="help-outline" size={typography.iconSize} color={colors.iconColor} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}

      <View style={styles.inputContainer}>
      <Ionicons name="mail-outline" size={typography.iconSize} color={colors.iconColor} />
        <InputComponent
          placeholder="Email Address"
          value={emailAddress}
          editable={true}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={typography.iconSize} color={colors.iconColor} />
        <InputComponent
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          editable={true}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={typography.iconSize} color={colors.iconColor} />
        <InputComponent
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
          secureTextEntry={!confirmPasswordVisible}
          editable={true}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Ionicons name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
    
      <View style={styles.checkboxContainer}>
        <CheckBox
          title={
            <Text>
              I agree to the{' '}
              <Text style={styles.linkText} onPress={openPrivacyPolicy}>Privacy Policy</Text>
              {' '}and{' '}
              <Text style={styles.linkText} onPress={openTermsOfService}>Terms of Service</Text>
            </Text>
          }
          checked={agreeToTerms}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
          containerStyle={styles.checkbox}
          checkedColor={colors.primary} 
          uncheckedColor="#888888" 
        />
      </View>
      {errors.agreeToTerms && <Text style={styles.errorText}>{errors.agreeToTerms}</Text>}
  
      <ButtonComponent 
        title={buttonTitle} 
        disabled={isCreating}
        loading={isCreating} 
        type="primary" 
        onPress={handleRegister}           
        style={{ width: '100%', flexDirection: 'row',  marginTop: spacing.size10Vertical }}
      />
  
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
  
      <ButtonComponent title="Login" type="secondary" 
        onPress={handleLoginScreen} 
       style={{ width: '100%', flexDirection: 'row' }}/>
    </KeyboardAwareScrollView>
    );
  };

  const { width } = Dimensions.get('window');
  const logoSize = width * 0.5; 

  const getStyles = (colors, typography, spacing) => StyleSheet.create({
    mainContainer: {
      //flex: 1,
      padding: spacing.size20Horizontal,
      alignItems: 'center',
    },
    logo: {
      width: logoSize,
      height: 0.25 * logoSize,
      marginTop: spacing.sizeExtraLarge,
      marginBottom: spacing.sizeLarge
    },
    title: {
      fontSize: typography.pageTitle,
      fontFamily: 'Montserrat', // Use Montserrat font for the title
      color: colors.titleColor, // Use dark color for the text
      textAlign: 'center',
      marginBottom: spacing.size10Vertical,
    },
    description: {
      fontSize: typography.body,
      color: colors.secondaryText,
      fontFamily: 'Montserrat',
      textAlign: 'center',
      marginBottom: spacing.size20Vertical,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingLeft: spacing.size10Horizontal,
      paddingRight: spacing.size10Horizontal,
      marginBottom: spacing.size10Vertical,
      marginTop: spacing.size10Vertical,
      borderRadius: spacing.sm,
    },
    input: {
      flex: 1,
      borderWidth: 0
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.size20Vertical,
    },
    forgotPasswordText: {
      color: 'blue',
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginVertical: spacing.size20Vertical,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.inputBorder,
    },
    orText: {
      width: spacing.sizeExtraLarge,
      textAlign: 'center',
      color: colors.secondaryText,
    },
    errorText: {
      color: 'red',
      fontSize: typography.caption,
      width: '100%',
      textAlign: 'left',
      marginBottom: spacing.size20Vertical,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginVertical: spacing.size5Vertical,
    },
    checkbox: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    linkText: {
      color: colors.linkColor,
      textDecorationLine: 'underline',
    },
  });
  
  export default RegisterScreen;