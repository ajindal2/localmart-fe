import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import ProfileImageWithEditIcon from '../../components/ProfileImageWithEditIcon';
import { getUser, updateUser } from '../../api/UserService';
import { getUserProfile, updateUserProfile } from '../../api/UserProfileService';
import { AuthContext } from '../../AuthContext';
import * as SecureStore from 'expo-secure-store';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Or any other icon set you prefer


const MyProfile = ({ navigation }) => {
  const { user, setUser, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmailEditable, setIsEmailEditable] = useState(false); 
  const [isAboutMeEditable, setIsAboutMeEditable] = useState(false); 
  const [userAuthDetails, setUserAuthDetails] = useState({
    emailAddress: '',
    userName: ''
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        console.log('Logging user id in MyProfile: ', user._id)

        const userAuthProfile = await getUser(user._id);
        let userProfile = await getUserProfile(user._id);

        setUserAuthDetails({
          emailAddress: userAuthProfile.emailAddress,
          userName: userAuthProfile.userName,
          date: userAuthProfile.date,
        });
       
        if (userProfile) {
          setUserProfileDetails({
            aboutMe: userProfile.aboutMe || '', 
            profilePicture: userProfile.profilePicture || 'https://via.placeholder.com/150',
          })
        } else {
          setUserProfileDetails({
            aboutMe : '',
            profilePicture : 'https://via.placeholder.com/150',
          })
        }
        
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    setIsUserAuthDetailsChanged(false);
    setIsUserProfileDetailsChanged(false);
  }, [user._id]);

  const handleUpdateProfile = async () => {
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
        await updateUserProfile(user._id, userProfileDetails);
      }
  
      setIsLoading(false);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      if (error.message === 'RefreshTokenExpired') {
        logout();
      } 
      setIsLoading(false);
      setError(error.message);
      Alert.alert('Error', 'Update failed, please try again later');
    }
  
    // Reset change trackers
    setIsUserAuthDetailsChanged(false);
    setIsUserProfileDetailsChanged(false);
  };

  if (isLoading) {
    return (
      // You can use your own custom Loader component here
      <Text>Loading...</Text>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageSection}>
        <ProfileImageWithEditIcon
        imageUri={userProfileDetails.profilePicture}
        onEditPress={() => {
          //console.log('Navigating with profile picture:', userProfileDetails.profilePicture);
            navigation.navigate('ChangeProfilePicture', {
              profilePicture: userProfileDetails.profilePicture, 
            })}}
        />
        <View style={styles.profileSection}>
          <Text style={styles.subText}>Member since {formatDate(userAuthDetails.date)}</Text>
        </View>
      </View>
      <View style={styles.aboutSection}>
        <Text style={styles.text}>About Me</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="Telling about yourself lets the buyers know more about why you are here."
            multiline
            value={userProfileDetails.aboutMe}
            editable={isAboutMeEditable}
            onChangeText={(text) => {
              setUserProfileDetails({ ...userProfileDetails, aboutMe: text });
              setIsUserProfileDetailsChanged(true);
            }}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsAboutMeEditable(true)} style={styles.iconContainer}>
            <Icon name="pencil" size={20} color="#6e6e6e" />
          </TouchableOpacity>
         </View>
      </View>
      <View style={styles.aboutSection}>
        <Text style={styles.text}>User Name</Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="User Name"
            value={userAuthDetails.userName}          
            onChangeText={(text) => {
              setUserAuthDetails({ ...userAuthDetails, userName: text });
              setIsUserAuthDetailsChanged(true);
            }}
            editable={false}
            style={styles.input}
          />
          <TouchableOpacity
              onPress={() => Alert.alert('Information', 'User name cannot be edited. Contact us if you really need to change it.')}
              style={styles.iconContainer}
            >
            <Icon name="question-circle" size={20} color="#6e6e6e" />
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
            onChangeText={(text) => {
              setUserAuthDetails({ ...userAuthDetails, emailAddress: text });
              setIsUserAuthDetailsChanged(true);
            }}
            editable={isEmailEditable} // Control the editable state
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsEmailEditable(true)} style={styles.iconContainer}>
            <Icon name="pencil" size={20} color="#6e6e6e" />
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
          <TouchableOpacity onPress={() => navigation.navigate('UpdatePasswordScreen')} style={styles.iconContainer}>
            <Icon name="pencil" size={20} color="#6e6e6e" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.aboutSection}>
      <ButtonComponent title="Update Profile" type="primary" 
        onPress={handleUpdateProfile}
        style={{ width: '100%', flexDirection: 'row' }}/>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
// Define the size of the profile picture as a percentage of the screen width
const profilePictureSize = screenWidth * 0.3; // for example, 30% of the screen width

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
      padding: spacing.size10,
    },
    imageSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.size10,
    },
    profileSection: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: spacing.size20,
    },
    profilePicture: {
      width: profilePictureSize,
      height: profilePictureSize,
      borderRadius: profilePictureSize / 2, 
    },
    aboutSection: {
      marginTop: spacing.size20,
    },
    input: {
      flex: 1,
      paddingHorizontal: 10,
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
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingRight: 10,
    },
    editButton: {
      marginLeft: 10,
      // Additional styles for the edit button
    },
    iconContainer: {
      // Additional styling if needed, such as padding
    },
  });
  
export default MyProfile;
