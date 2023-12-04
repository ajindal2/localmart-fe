import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../AuthContext';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.86.49:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      if (data && data.access_token) {
        await SecureStore.setItemAsync('token', data.access_token);
        setToken(data.access_token);

      if (data.user) {
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      } else {
        console.error('Error in data:', data);
        Alert.alert('Login failed', 'Invalid userName or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login error', 'An error occurred while trying to log in');
    }
  };

  return (
    <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Username"
      value={userName}
      onChangeText={setUserName}
      autoCapitalize="none"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    <Button title="Login" onPress={handleLogin} />
    <Button
        title="Register"
        onPress={() => navigation.navigate('RegisterScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;