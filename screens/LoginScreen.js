import React, { useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../AuthContext';
import * as SecureStore from 'expo-secure-store';
import ButtonComponent from '../components/ButtonComponent';
import { useFonts } from 'expo-font';
import InputComponent from '../components/InputComponent';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { BASE_URL } from '../constants/AppConstants';

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press
  const { setUser, setToken } = useContext(AuthContext);
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'), 
  });
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  if (!fontsLoaded) {
    return null; // Or a loading indicator if you prefer
  }

  const handleLogin = async () => {
    setIsCreating(true); 
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      if (data && data.access_token && data.refresh_token) {
        await SecureStore.setItemAsync('token', data.access_token);
        setToken(data.access_token);

        await SecureStore.setItemAsync('refreshToken', data.refresh_token);

      if (data.user) {
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      } else {
        console.error('Error in login data:', data);
        Alert.alert('Login failed', 'Invalid Username or Password');
        setIsCreating(false); 
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login error', 'An error occurred while trying to log in. Please try again in sometime');
    } finally {
      setIsCreating(false); 
    }
  };

  let buttonTitle = isCreating ? "Processing..." : "Login";

  return (
  <View style={styles.container}>
    <Image source={require('../assets/app_icon.png')} style={styles.logo} />
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.description}>Your local marketplace for groceries.</Text>

    <View style={styles.inputContainer}>
      <Ionicons name="person-outline" size={typography.iconSize} color={colors.iconColor} />
      <InputComponent
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
    </View>

    <TouchableOpacity
      style={styles.forgotUsername}
      onPress={() => navigation.navigate('ForgotUserNameScreen')} >
      <Text style={styles.forgotPasswordText}>Forgot User Name?</Text>
    </TouchableOpacity>

    <View style={styles.inputContainer}>
      <Ionicons name="lock-closed-outline" size={typography.iconSize} color={colors.iconColor} />
      <InputComponent
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
        <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={styles.forgotPassword}
      onPress={() => navigation.navigate('ForgotPasswordScreen')} >
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
    </TouchableOpacity>

    <ButtonComponent  
      title={buttonTitle} 
      disabled={isCreating}
      loading={isCreating}  
      type="primary" 
      onPress={handleLogin}           
      style={{ width: '100%', flexDirection: 'row' }}
    />

    <View style={styles.orContainer}>
      <View style={styles.line} />
      <Text style={styles.orText}>or</Text>
      <View style={styles.line} />
    </View>

    <ButtonComponent title="Register" type="secondary" 
      onPress={() => navigation.navigate('RegisterScreen')} 
     style={{ width: '100%', flexDirection: 'row' }}/>

  </View>
  );
};

const { width } = Dimensions.get('window');
const logoSize = width * 0.4; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.size20Horizontal,
  },
  logo: {
    width: logoSize,
    height: logoSize,
    marginBottom: spacing.size20Vertical,
  },
  title: {
    fontSize: typography.authTitle,
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
    marginTop: spacing.size10Vertical,
    borderRadius: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 0 // to hide the border of the inner InputComponent since we are using another component to inlcude icon
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.size20Vertical,
  },
  forgotUsername: {
   alignSelf: 'flex-end',
    marginBottom: spacing.size10Vertical,
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
});

export default LoginScreen;