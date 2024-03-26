import React, { useState, useContext } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import { updatePassword } from '../../api/UserService';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import ButtonComponent from '../../components/ButtonComponent';
import { useTheme } from '../../components/ThemeContext';
import InputComponent from '../../components/InputComponent';
import { Ionicons } from '@expo/vector-icons';
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';


const UpdatePasswordScreen = ({navigation}) => {
  const isConnected = useNetworkConnectivity();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);
  const [errors, setErrors] = useState({});
  const { user, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press

  useHideBottomTab(navigation, true);

  useFocusEffect(
    React.useCallback(() => {
      // Clear the errors state when the screen is focused
      setErrors({}); 
      // clear the form fields 
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }, [])
  );

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};
  
    if (!currentPassword) {
      isValid = false;
      newErrors.currentPassword = 'Current password is required.';
    }
  
    // Password validation
    if (!newPassword || newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      isValid = false;
      newErrors.newPassword = 'Password must be at least 6 characters, contain an uppercase letter and a number.';
    }

    if (newPassword !== confirmNewPassword) {
      isValid = false;
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async () => {
    if (!user) {
      console.error('User is null, cannot handleUpdatePassword');
      return; // Exit the function if there's no user
    }
    setIsCreating(true); 
    if (!validateInput()) {
      // Input validation failed
      setIsCreating(false); 
      return;
    }
    try {
      const response = await updatePassword(user._id, currentPassword, newPassword, confirmNewPassword);
      if (!response.ok) {
        // Handle server-side validation errors, e.g., incorrect current password
        setIsCreating(false); 
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          // Handle other types of errors (e.g., not related to validation)
          console.log(errorData.message || 'Failed to update password');
          Alert.alert('Error', errorData.message || 'Failed to update password');
        }
      } else {
        Alert.alert('Password updated successfully!');
      }
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } 
      Alert.alert('Error', error.message || 'Update failed, please try again later');
    } finally {
      setIsCreating(false); 
    }
  };

  let buttonTitle = isCreating ? "Processing..." : "Update Password";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Password</Text>
      <View style={styles.inputContainer}>
      <InputComponent
          secureTextEntry={hideCurrentPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setHideCurrentPassword(!hideCurrentPassword)}>
          <Ionicons name={hideCurrentPassword ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
      {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}

      <Text style={styles.label}>New Password</Text>
      <View style={styles.inputContainer}>
      <InputComponent
          secureTextEntry={hideNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setHideNewPassword(!hideNewPassword)}>
          <Ionicons name={hideNewPassword ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      <Text style={styles.label}>Confirm New Password</Text>
      <View style={styles.inputContainer}>
      <InputComponent
          secureTextEntry={hideConfirmNewPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setHideConfirmNewPassword(!hideConfirmNewPassword)}>
          <Ionicons name={hideConfirmNewPassword ? 'eye' : 'eye-off'} size={typography.iconSize} color={colors.iconColor} />
        </TouchableOpacity>
      </View>
      {errors.confirmNewPassword && <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>}

      <View style={styles.bottomButtonContainer}>
        <ButtonComponent 
          title={buttonTitle} 
          disabled={isCreating}
          loading={isCreating} 
          type="primary"  
          onPress={handleUpdatePassword} 
          style={{ width: '100%', flexDirection: 'row' }} />
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height; // Get the screen height
const marginBottom = screenHeight * 0.04; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.size10Horizontal,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingLeft: spacing.size10Horizontal,
    paddingRight: spacing.size10Horizontal,
    marginBottom: spacing.size10Vertical,
    borderRadius: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 0
  },
  label: {
    fontSize: typography.body,
    marginBottom: spacing.size5Vertical,
    marginTop: spacing.size10Vertical,
    textAlign: 'left',
    width: '100%',

  },
  errorText: {
    color: 'red',
    fontSize: typography.error,
    width: '100%',
    textAlign: 'left',
    marginBottom: spacing.size20Vertical,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: marginBottom,
    width: '100%',
  },
});

export default UpdatePasswordScreen;
