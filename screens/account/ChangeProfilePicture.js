import React, { useState, useContext } from 'react';
import { View, Button, Image, StyleSheet, Alert, Platform, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage} from '../../api/UserProfileService';
import { AuthContext } from '../../AuthContext';
import DEFAULT_IMAGE_URI from '../../constants/AppConstants';
import { Ionicons } from '@expo/vector-icons';

const ChangeProfilePicture = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);

  console.log('Route Params:', route.params);
  const userProfilePicture = route.params?.profilePicture ?? 'https://via.placeholder.com/150';
  console.log('userProfilePicture inside ChangeProfilePicture: ', userProfilePicture);

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
          setImage(pickerResult.assets[0].uri);
      } else {
          // Fallback for older SDK versions
          setImage(pickerResult.uri);
      }

  } catch (error) {
      console.error("Error selecting photo: ", error);
      Alert.alert('Error', 'An error occurred while selecting the photo.');
  }
};

  const handleConfirmPhoto = async () => {
    try {
      const result = await uploadProfileImage(user._id, image);
      //console.log();
      Alert.alert('Profile Image Updated', 'Your profile image has been updated successfully.');
      // Navigate back or refresh the profile view if necessary
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not update profile image: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image ? { uri: image } : { uri: userProfilePicture }} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
        <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
        <Ionicons name="images" size={20} color="#fff" />
          <Text style={styles.buttonText}>Select Photo</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <TouchableOpacity style={styles.usePhotoButton} onPress={handleConfirmPhoto}>
          <Text style={styles.usePhotoButtonText}>Use photo</Text>
        </TouchableOpacity>      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Aligns vertically center
    alignItems: 'center', // Aligns horizontally center
  },
  imageContainer: {
    marginBottom: 20, // Adds spacing between the image and the buttons
  },
  image: {
    width: 220, // Diameter of the profile image
    height: 230, // Diameter of the profile image
    borderRadius: 110, // Half the width/height to make it circular
    backgroundColor: '#fff', // Assuming a white background for the image
    justifyContent: 'center', // Center the image icon/text inside the circle
    alignItems: 'center',
    borderWidth: 2, // This sets the width of the border
    borderColor: '#808080', // This sets the color of the border to grey
  },
  buttonContainer: {
    width: '100%', // Use a percentage of the screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#34A853', // Button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold text
    marginLeft: 15, // Increase this value to add more space
  },
  usePhotoButton: {
    backgroundColor: '#4285F4', // Button color for 'Use photo'
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    width: '70%',
  },
  usePhotoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChangeProfilePicture;