import React, { useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login error', 'An error occurred while trying to log in');
    }
  };

  return (
  <View style={styles.container}>
    <Image source={require('../assets/app_icon.png')} style={styles.logo} />
    <Text style={styles.title}>Welcome Back</Text>
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

    <TouchableOpacity style={styles.forgotPassword}>
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
    </TouchableOpacity>

    <ButtonComponent title="Login" type="primary" 
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

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    borderWidth: 0 // to hide the border of the inner InputComponent since we are using another component to inlcude icon
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
});

export default LoginScreen;