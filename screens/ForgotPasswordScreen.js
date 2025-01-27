import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { forgotPassword} from '../api/AuthService'; 
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import { useTheme } from '../components/ThemeContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const ForgotPasswordScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const [email, setEmail] = useState('');
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'If your email address is registered with us, you will receive an email with further instructions.');
    } catch (error) {
      Alert.alert('Error', error.message || 'There was an error processing your request. Please try again later.');
    }
  };


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }
  
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Text style={styles.instructions}>
        Please enter the email you used to sign up at FarmVox.
      </Text>
      <View style={styles.inputContainer}>
        <InputComponent
            placeholder="Enter your email"
            editable={true}
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
        <Text style={styles.helpText}>
          Havent received email? <Text style={styles.emailText}>Resend email</Text>
        </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>Need help? Reach out to us at support@farmvox.com</Text>
      </View>

    </KeyboardAwareScrollView>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.size20Horizontal,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingLeft: spacing.size10Horizontal,
    paddingRight: spacing.size10Horizontal,
    marginBottom: spacing.sizeLarge,
    borderRadius: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 0
  },
  instructions: {
    marginBottom: spacing.sizeLarge,
    fontSize: typography.body,
    textAlign: 'center',
  },
  optionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: 'blue', 
    textDecorationLine: 'underline',
    marginTop: spacing.size10Vertical,
  },
  helpText: {
    marginTop: spacing.size20Vertical,
    fontSize: typography.subHeading,
    color: 'blue',
    textAlign: 'center',
  },
  emailText: {
    color: 'blue', // Color for the email text
    textDecorationLine: 'underline', // Underline the email text
  },
});

export default ForgotPasswordScreen;
