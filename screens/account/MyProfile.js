import React, { useState, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import ProfileImageWithEditIcon from '../../components/ProfileImageWithEditIcon';
import { getUser, updateUser } from '../../api/UserService';
import { getUserProfile, updateUserProfile } from '../../api/UserProfileService';
import { AuthContext } from '../../AuthContext';
import * as SecureStore from 'expo-secure-store';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { useTheme } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_IMAGE_URI } from '../../constants/AppConstants'
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';
import { useFocusEffect } from '@react-navigation/native'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const MyProfile = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { user, setUser, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmailEditable, setIsEmailEditable] = useState(false); 
  const [isAboutMeEditable, setIsAboutMeEditable] = useState(false); 
  const [userAuthDetails, setUserAuthDetails] = useState({
    emailAddress: '',
    displayName: '',
  });
  const [userProfileDetails, setUserProfileDetails] = useState({
    profilePicture: '',
    aboutMe: '',
  });
  const [isUserAuthDetailsChanged, setIsUserAuthDetailsChanged] = useState(false);
  const [isUserProfileDetailsChanged, setIsUserProfileDetailsChanged] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', year: 'numeric' };
    return date.toLocaleString('en-US', options);
  };

  useHideBottomTab(navigation, true);

  useFocusEffect(
    useCallback(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        console.error('User is null, cannot fetchUserProfile');
        return; // Exit the function if there's no user
      }

      setIsLoading(true);
      try {
        const userAuthProfile = await getUser(user._id);
        let userProfile = await getUserProfile(user._id);

        setUserAuthDetails({
          emailAddress: userAuthProfile.emailAddress,
          displayName: userAuthProfile.displayName,
          date: userAuthProfile.date,
        });
       
        if (userProfile) {
          let profilePictureUrl = userProfile.profilePicture || DEFAULT_IMAGE_URI;

          // Check if the URL is external before applying cache busting
          if (typeof profilePictureUrl === 'string' && (profilePictureUrl.startsWith('http://') || profilePictureUrl.startsWith('https://'))) {
              // Add cache busting only if it's an external URL
              profilePictureUrl += `?v=${new Date().getTime()}`;
          }

          setUserProfileDetails({
            aboutMe: userProfile.aboutMe || '', 
            profilePicture: profilePictureUrl,
          })
        } else {
          setUserProfileDetails({
            aboutMe : '',
            profilePicture : DEFAULT_IMAGE_URI,
          })
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching profile for user ${user._id}`, error);
        if (error.message.includes('RefreshTokenExpired')) {
          await logout();
        } else {
          Alert.alert('Error', 'Error fetching profile, please try again later');
        }
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    setIsUserAuthDetailsChanged(false);
    setIsUserProfileDetailsChanged(false);
  }, [user])
  );

  const handleUpdateProfile = async () => {
    if (!user) {
      console.error('User is null, cannot handleUpdateProfile');
      return; // Exit the function if there's no user
    }
    setIsLoading(true);
    setError('');
    try {
      if (isUserAuthDetailsChanged) {
        const updatedAuthProfile = await updateUser(user._id, userAuthDetails);
        setUser(updatedAuthProfile); // Update the user state in AuthContext
        await SecureStore.setItemAsync('user', JSON.stringify(updatedAuthProfile));
      }
  
      // Update User Profile Details if they have been changed. The server will make sure of creating the Profile is it doesnt exist.
      if (isUserProfileDetailsChanged) {
        // Create a new object with only the "aboutMe" field. B'coz profilePicture is never edited from this page.
        const updatedUserProfileDetails = {
          aboutMe: userProfileDetails.aboutMe
        };
        
        await updateUserProfile(user._id, updatedUserProfileDetails);
      }
  
      setIsLoading(false);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      console.error(`Error updating profile for user ${user._id}`, error);
      if (error.message.includes('RefreshTokenExpired')) {
        await logout();
      } 
      setIsLoading(false);
      setError(error.message);
      Alert.alert('Error', 'Update failed, please try again later');
    }
  
    // Reset change trackers
    setIsUserAuthDetailsChanged(false);
    setIsUserProfileDetailsChanged(false);
  };

  const onChangeAboutMe = React.useCallback((text) => {
    setUserProfileDetails({ ...userProfileDetails, aboutMe: text });
    setIsUserProfileDetailsChanged(true);
  }, [userProfileDetails]); 
  
  const onChangeEmail = React.useCallback((text) => {
    setUserAuthDetails({ ...userAuthDetails, emailAddress: text });
    setIsUserAuthDetailsChanged(true);
  }, [userAuthDetails]);
  
  const handleEditProfilePicture =  React.useCallback(() => {
    navigation.navigate('ChangeProfilePicture', {
      profilePicture: userProfileDetails.profilePicture,
    });
  }, [navigation, userProfileDetails]);

  const handleUpdatePasswordScreen = React.useCallback(() => {
    navigation.navigate('UpdatePasswordScreen');
  }, [navigation]);


  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
         <ActivityIndicator size="large" color={colors.primary} />
    ) : error ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ) : (
      <>
      <View style={styles.imageSection}>
        <ProfileImageWithEditIcon
        imageUri={userProfileDetails.profilePicture}
        onEditPress={handleEditProfilePicture} 
        />
        <View style={styles.profileSection}>
          <Text style={styles.subText}>Member since {formatDate(userAuthDetails.date)}</Text>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.text}>About Me</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="Telling about yourself lets the other users know more a bit more about who you are and why you are here."
            multiline
            value={userProfileDetails.aboutMe}
            editable={isAboutMeEditable}
            onChangeText={onChangeAboutMe}          
            style={styles.input}
            textAlignVertical="top"
          />
          <TouchableOpacity onPress={() => setIsAboutMeEditable(true)} style={styles.iconContainer}>
          <Ionicons name="pencil-outline" size={typography.iconSize} color={colors.iconColor} />
          </TouchableOpacity>
         </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.text}>Display Name</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="Display Name"
            value={userAuthDetails.displayName}          
            editable={false}
            style={styles.input}
          />
          <TouchableOpacity
              onPress={() => Alert.alert('Information', 'Display name cannot be edited. Contact us if you really need to change it.')}
              style={styles.iconContainer}
            >
            <Ionicons name="help-outline" size={typography.iconSize} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.text}>Email Address</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="Email"
            keyboardType="email-address"
            value={userAuthDetails.emailAddress}          
            onChangeText={onChangeEmail}
            editable={isEmailEditable} // Control the editable state
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsEmailEditable(true)} style={styles.iconContainer}>
            <Ionicons name="pencil" size={typography.iconSize} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.text}>Password</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="#########"
            editable={false} 
            style={styles.input}
          />
          <TouchableOpacity onPress={handleUpdatePasswordScreen} style={styles.iconContainer}>
            <Ionicons name="pencil" size={typography.iconSize} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.aboutSection}>
      <ButtonComponent title="Update Profile" type="primary" 
        onPress={handleUpdateProfile}
        style={{ width: '100%', flexDirection: 'row' }}/>
      </View>
      </>
    )}
    </KeyboardAwareScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
// Define the size of the profile picture as a percentage of the screen width
const profilePictureSize = screenWidth * 0.3; // for example, 30% of the screen width

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
     //flex: 1,
      padding: spacing.size10Horizontal,
    },
    errorContainer: {
      alignItems: 'center',
      marginTop: spacing.size20Vertical,
    },
    errorText: {
      fontSize: typography.subHeading,
      color: colors.secondaryText,
      marginTop: spacing.size10Vertical,
      textAlign: 'center',
      paddingHorizontal: spacing.size20Horizontal,
    },
    imageSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.size10Horizontal,
    },
    profileSection: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: spacing.size20Horizontal,
        flex: 1, // This section will take available space within imageSection
    },
    profilePicture: {
      width: profilePictureSize,
      height: profilePictureSize,
      borderRadius: profilePictureSize / 2, 
    },
    aboutSection: {
      marginTop: spacing.size20Vertical,
    },
    input: {
      flex: 1,
      paddingLeft: spacing.size10Horizontal,
      paddingRight: spacing.size10Horizontal,
      borderWidth: 0,
    },
    text: {
      fontSize: typography.heading,
      fontWeight: 'bold',
      color: colors.headingColor, 
      padding: spacing.xs,
    },
    subText: {
      fontSize: typography.body,
      fontWeight: 'bold',
      color: colors.secondaryText,
      padding: spacing.xs,
      flexWrap: 'wrap',
      textAlign: 'center', 
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: colors.inputBorder,
      borderWidth: 1,
      borderRadius: 5,
      paddingRight: spacing.size10Horizontal,
    },
    iconContainer: {
      // Additional styling if needed, such as padding
    },
  });
  
export default MyProfile;
