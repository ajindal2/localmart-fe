import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage} from '../../api/UserProfileService';
import { AuthContext } from '../../AuthContext';
import { DEFAULT_IMAGE_URI } from '../../constants/AppConstants';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import ButtonComponent from '../../components/ButtonComponent';
import { useTheme } from '../../components/ThemeContext';
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';


const ChangeProfilePicture = ({ route, navigation }) => {
  const isConnected = useNetworkConnectivity();
  const [image, setImage] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false); // to disable button after single press
  const userProfilePicture = route.params?.profilePicture;
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useHideBottomTab(navigation, true);

  const handleTakePhoto = async () => {
    try {
        // Request camera permissions
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access the camera is required to take a photo!');
            return;
        }

        // Launch the camera with additional options
        const pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: false, // Allow basic editing, adjust as needed
            aspect: [4, 3],      // Aspect ratio, adjust as needed
            quality: 0.5,        // Adjust for quality vs file size
        });

        // Handle the case where the camera is used but no photo is taken
        if (pickerResult.canceled === true) {
            return;
        }

        // Check for 'assets' array for SDK 48 and later
        if (pickerResult.assets && pickerResult.assets.length > 0) {
            setImage(pickerResult.assets[0].uri);
        } else {
            // Fallback for older SDK versions
            setImage(pickerResult.uri);
        }

    } catch (error) {
        console.error("Error taking photo: ", error);
        Alert.alert('Error', 'An error occurred while taking the photo.');
    }
};

const handleChoosePhoto = async () => {
  try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Permission to access the media library is required!');
          return;
      }

      // Launch the image library with additional options
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false, // Allow basic editing, adjust as needed
          aspect: [4, 3],      // Aspect ratio, adjust as needed
          quality: 0.5,        // Adjust for quality vs file size
      });

      // Handle the case where the picker is used but no photo is selected
      if (pickerResult.canceled === true) {
          return;
      }

      // Check for 'assets' array for SDK 48 and later
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        // Use the new URI with cache-busting query parameter
        setImage(`${pickerResult.assets[0].uri}?${Date.now()}`);
      } else {
        // Fallback for older SDK versions
        // Use the new URI with cache-busting query parameter
        setImage(`${pickerResult.uri}?${Date.now()}`);
      }

  } catch (error) {
      console.error("Error selecting photo: ", error);
      Alert.alert('Error', 'An error occurred while selecting the photo.');
  }
};

  const handleConfirmPhoto = async () => {
    if (!user) {
      console.error('User is null, cannot handleConfirmPhoto');
      return; // Exit the function if there's no user
    }
    setIsCreating(true); 
    try {
      const result = await uploadProfileImage(user._id, image);
      Alert.alert('Profile Image Updated', 'Your profile image has been updated successfully.');
      // Navigate back or refresh the profile view if necessary
      navigation.navigate('MyProfile');
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        Alert.alert('Error', 'Could not update profile image. Please try again later.');
      }
    } finally {
      setIsCreating(false); 
    }
  };

  // Dynamically set the button title
  let buttonTitle = isCreating ? "Processing..." : "Use photo";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <Image source={image ? { uri: image } : userProfilePicture ? { uri: userProfilePicture } : DEFAULT_IMAGE_URI} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonComponent title="Take photo" type="secondary" iconName="camera"
          onPress={handleTakePhoto}
          style={[styles.button, styles.firstButton]}
        />
        <ButtonComponent title="Select photo" type="secondary" iconName="images"
          onPress={handleChoosePhoto}
          style={[styles.button]}
        />
      </View>
      {image && (
         <View style={styles.bottomButtonContainer}>
          <ButtonComponent title={buttonTitle} 
          disabled={isCreating}
          loading={isCreating}  type="primary" 
          onPress={handleConfirmPhoto}
          />
         </View>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width; // Get the screen width
const imageSize = screenWidth * 0.6; // 50% of screen width

const screenHeight = Dimensions.get('window').height; // Get the screen height
const marginBottom = screenHeight * 0.05; // 5% of screen height for bottom margin
const marginTop = screenHeight * 0.05; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Aligns horizontally center
    padding: spacing.size10Horizontal,
  },
  imageContainer: {
    marginBottom: marginBottom, // Adds spacing between the image and the buttons
    marginTop: marginTop,
  },
  image: {
    width: imageSize, // Diameter of the profile image
    height: imageSize, // Diameter of the profile image
    borderRadius: imageSize / 2, // Half the width/height to make it circular
    backgroundColor: colors.white, // Assuming a white background for the image
    justifyContent: 'center', // Center the image icon/text inside the circle
    alignItems: 'center',
    borderWidth: spacing.xxs, // This sets the width of the border
    borderColor: colors.darkGrey, // This sets the color of the border to grey
  },
  buttonContainer: {
    width: '100%', // Use a percentage of the screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: marginBottom,
    width: '100%',
  },
  firstButton: {
    marginBottom: spacing.size20Vertical, 
  },
  button: {
    width: '75%', 
    flexDirection: 'row'
  }
});

export default ChangeProfilePicture;