import React, { useState} from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Image, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import InputComponent from '../components/InputComponent';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useFocusEffect(
    React.useCallback(() => {
      // Clear the errors state when the screen is focused
      setErrors({}); 
      // clear the form fields 
       setUserName('');
       setEmailAddress('');
       setPassword('');
    }, [])
  );

  if (!fontsLoaded) {
    return null; // Or a loading indicator if you prefer
  }

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};
  
    if (!userName || userName.length < 4) {
      isValid = false;
      newErrors.userName = 'Username must be at least 4 characters long.';
    }
  
    // Email validation (use a more robust regex in production)
    if (!emailAddress || !/\S+@\S+\.\S+/.test(emailAddress)) {
      isValid = false;
      newErrors.emailAddress = 'Please enter a valid email address.';
    }
  
    // Password validation
    if (!password || password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      isValid = false;
      newErrors.password = 'Password must be at least 6 characters, contain an uppercase letter and a number.';
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInput()) {
      // Input validation failed
      return;
    }

    try {
      const response = await fetch('http://192.168.86.24:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, emailAddress, password }),
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
    Alert.alert('Registration Error', 'An error occurred during registration');
  }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/app_icon.png')} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.description}>Your local marketplace for everything you need.</Text>
  
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" />
        <InputComponent
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />
      </View>
      {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}

      <View style={styles.inputContainer}>
      <Ionicons name="mail-outline" size={20} color="#666" />
        <InputComponent
          placeholder="Email Address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" />
        <InputComponent
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

  
      <ButtonComponent title="Register" type="primary" 
        onPress={handleRegister}           
        style={{ width: '100%', flexDirection: 'row' }}
      />
  
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
  
      <ButtonComponent title="Login" type="secondary" 
        onPress={() => navigation.navigate('LoginScreen')} 
       style={{ width: '100%', flexDirection: 'row' }}/>
    </View>
    );
  };

  const getStyles = (colors, typography, spacing) => StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.size20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: spacing.size20,
    },
    title: {
      fontSize: typography.authTitle,
      fontFamily: 'Montserrat', // Use Montserrat font for the title
      color: colors.titleColor, // Use dark color for the text
      textAlign: 'center',
      marginBottom: spacing.size10,
    },
    description: {
      fontSize: typography.body,
      color: colors.secondaryText,
      fontFamily: 'Montserrat',
      textAlign: 'center',
      marginBottom: spacing.size20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingLeft: spacing.size10,
      paddingRight: spacing.size10,
      marginBottom: spacing.size10,
      borderRadius: spacing.sm,
    },
    input: {
      flex: 1,
      borderWidth: 0
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.size20,
    },
    forgotPasswordText: {
      color: 'blue',
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginVertical: spacing.size20,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.inputBorder,
    },
    orText: {
      width: 50,
      textAlign: 'center',
      color: colors.secondaryText,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      width: '100%',
      textAlign: 'left',
      //marginTop: 5,
      marginBottom: 20,
    }
  });
  
  export default RegisterScreen;