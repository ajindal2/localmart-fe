import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { forgotPassword} from '../api/AuthService'; 
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import { useTheme } from '../components/ThemeContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'If your email address is registered with us, you will receive an email with further instructions.');
    } catch (error) {
      Alert.alert('Error', 'There was an error processing your request. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Please enter the email you used to sign up at Localmart.
      </Text>
      <View style={styles.inputContainer}>
        <InputComponent
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
        />
      </View>
      <ButtonComponent title="Submit" type="primary" 
        onPress={handleForgotPassword} 
        style={{ width: '100%', flexDirection: 'row' }}
      />

      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.optionText}>Resend Email</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {/* Logic to contact support */}}>
            <Text style={styles.optionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingLeft: spacing.size10,
    paddingRight: spacing.size10,
    marginBottom: 30, //spacing.size10,
    borderRadius: spacing.sm,
    
  },
  input: {
    flex: 1,
    borderWidth: 0
  },
  instructions: {
    marginBottom: 50,
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    //marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: '#007BFF', // Example color for the text
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
