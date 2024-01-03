import React, { useState, useContext} from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Import AuthContext


const RegisterScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
     /* const response = await axios.post('http://localhost:3000/auth/register', { //'${BASE_URL}/auth/register', {
        userName,
        emailAddress,
        password,*/
        const response = await fetch('http://192.168.86.24:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, emailAddress, password }),
      });

      /*if (response.status === 201) {
        //const data = await response.json();
        // Assuming the response includes the user data and a token
        //await AsyncStorage.setItem('access_token', data.access_token);
        //setUser({ userName, token: data.access_token });
        Alert.alert('Success', 'Registration successful');
        navigation.navigate('LoginScreen'); // Navigate to login screen upon successful registration
      } else {
        Alert.alert('Registration Failed', response.data.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Registration Error', error.response.data.message || 'An error occurred during registration');
    }*/

    // Check if the response is as expected
    if (response.ok) {
      // Handle success
      if (response.status === 201) {
        const data = await response.json(); // Parsing the response as JSON
        console.log(data); // Handle or display the data as needed
        Alert.alert('Success', 'Registration successful');
        navigation.navigate('LoginScreen');
        // Additional logic
      } else {
        Alert.alert('Registration Failed', response.data.message || 'An error occurred');
      }
    } else {
      // Handle unexpected response structure
      console.error('Unexpected response from server:', response);
      Alert.alert('Error', 'Unexpected response from server');
    }
  } catch (error) {
    // Handle network errors or errors returned from the server
    console.error('Error in registration:', error);
    Alert.alert('Registration Error', error.response?.data?.message || 'An error occurred during registration');
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
        placeholder="Email Address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
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
  
  export default RegisterScreen;