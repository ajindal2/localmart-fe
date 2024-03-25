import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { forgotUserName} from '../api/AuthService'; 
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import { useTheme } from '../components/ThemeContext';

const ForgotUserNameScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const handleForgotUserName = async () => {
    try {
      await forgotUserName(email);
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
        onPress={handleForgotUserName} 
        style={{ width: '100%', flexDirection: 'row' }}
      />

      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={handleForgotUserName}>
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
});

export default ForgotUserNameScreen;
