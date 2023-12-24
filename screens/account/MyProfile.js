import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ChangeProfilePicture from './ChangeProfilePicture';
/*import StarRating from 'react-native-star-rating'; 
commenting this and using a custom 
StarRating instead since this is giving a warning that ViewPropTypes will be removed from React Native, 
along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. 
Looks like the RN's StarRating uses ViewProps.*/
import StarRating from '../../components/StarRating';
import ProfileImageWithEditIcon from '../../components/ProfileImageWithEditIcon';
import { getUser, updateUser } from '../../api/UserService';
import { getUserProfile, updateUserProfile, createUserProfile } from '../../api/UserProfileService';
import { AuthContext } from '../../AuthContext';
import * as SecureStore from 'expo-secure-store';
import DEFAULT_IMAGE_URI from '../../constants/AppConstants';

const MyProfile = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [starCount, setStarCount] = useState(3.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        console.log('Logging user id in MyProfile: ', user._id)

        const userAuthProfile = await getUser(user._id);
        let userProfile = await getUserProfile(user._id);

        setUserAuthDetails({
          emailAddress: userAuthProfile.emailAddress,
          userName: userAuthProfile.userName
        });
       
        if (userProfile) {
          setUserProfileDetails({
            aboutMe: userProfile.aboutMe || '', 
            profilePicture: userProfile.profilePicture || 'https://via.placeholder.com/150'
          })
        } else {
          setUserProfileDetails({
            aboutMe : '',
            profilePicture : 'https://via.placeholder.com/150'
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
        console.log("Auth updated");
        const updatedAuthProfile = await updateUser(user._id, userAuthDetails);
        setUser(updatedAuthProfile); // Update the user state in AuthContext
        await SecureStore.setItemAsync('user', JSON.stringify(updatedAuthProfile));
      }
  
      // Update User Profile Details if they have been changed. The server will make sure of creating the Profile is it doesnt exist.
      if (isUserProfileDetailsChanged) {
        console.log("Profile updated");
        await updateUserProfile(user._id, userProfileDetails);
      }
  
      setIsLoading(false);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      Alert.alert('Update Failed', error.message);
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
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <ProfileImageWithEditIcon
        imageUri={userProfileDetails.profilePicture}
        onEditPress={() => {
          console.log('Navigating with profile picture:', userProfileDetails.profilePicture);
            navigation.navigate('ChangeProfilePicture', {
              profilePicture: userProfileDetails.profilePicture, // Add a key here
            })}}
        />
        <View style={styles.profileSection}>
            <Text>Member since April 2003</Text>
            <StarRating
            rating={starCount}
            onRatingChange={onStarRatingPress}
            />
        </View>
      </View>
      <View style={styles.aboutSection}>
        <Text>About Me</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setUserProfileDetails({ ...userProfileDetails, aboutMe: text });
            setIsUserProfileDetailsChanged(true);
          }}
          value={userProfileDetails.aboutMe}
          multiline
          placeholder="Telling about yourself lets the buyers know more about why you are here."
        />
      </View>
      <View style={styles.aboutSection}>
        <Text>User Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setUserAuthDetails({ ...userAuthDetails, userName: text });
            setIsUserAuthDetailsChanged(true);
          }}
          value={userAuthDetails.userName}
          placeholder="User Name"
        />
      </View>
      <View style={styles.aboutSection}>
        <Text>Email Address</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setUserAuthDetails({ ...userAuthDetails, emailAddress: text });
            setIsUserAuthDetailsChanged(true);
          }}
          value={userAuthDetails.emailAddress}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.aboutSection}>
      <Button
        title="Update Profile"
        backgroundColor="#FF5757"
        onPress={handleUpdateProfile}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    imageSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    profileSection: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75, // Makes it round
    },
    aboutSection: {
      marginTop: 20,
    },
    input: {
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      textAlignVertical: 'top', // Aligns text to the top on Android
      backgroundColor: '#d9d9d9',
      margin: '50'

    },
  });
  
export default MyProfile;
