import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Platform, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage} from '../../api/UserProfileService';
import DEFAULT_IMAGE_URI from '../../constants/AppConstants';

const ChangePhotoScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    setImage(pickerResult.uri);
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    setImage(pickerResult.uri);
  };


  const handleConfirmPhoto = async () => {
    try {
      const result = await uploadProfileImage(user._id, image);
      Alert.alert('Profile Image Updated', 'Your profile image has been updated successfully.');
      // Navigate back or refresh the profile view if necessary
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not update profile image: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        <Image source={image ? { uri: image } : require('../path-to-your-default-image.png')} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Select Photo</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <Button title="Use Photo" onPress={handleConfirmPhoto} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 400,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ChangePhotoScreen;