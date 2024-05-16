import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LocationContext } from '../components/LocationProvider';
import Slider from '@react-native-community/slider';
import { useTheme } from '../components/ThemeContext';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSearchDistance } from '../api/UserPreferencesService'
import { AuthContext } from '../AuthContext';
import { DEFAULT_SEARCH_DISTANCE } from '../constants/AppConstants';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';


const UserLocationPreferencesScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { location } = useContext(LocationContext); 
  const { user } = useContext(AuthContext);
  const [initialDistance, setInitialDistance] = useState(DEFAULT_SEARCH_DISTANCE); // TODO Default distance
  const [editedDistance, setEditedDistance] = useState(initialDistance); 
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  useEffect(() => {
    const getSearchDistance = async () => {
      try {
        const storedDistance = await AsyncStorage.getItem('searchLocationDistance');
        if (storedDistance !== null) {
          // If a distance is stored, update the state with this value
          setInitialDistance(parseInt(storedDistance, DEFAULT_SEARCH_DISTANCE));
          setEditedDistance(parseInt(storedDistance, DEFAULT_SEARCH_DISTANCE)); // Ensure editedDistance is also updated
        }
      } catch (error) {
        console.error('Error fetching search distance from storage:', error);
      }
    };

    getSearchDistance();
  }, []);

  const handleSubmit = async () => {
    try {
      // Only update distance if it has been changed
      if (initialDistance !== editedDistance) {
          await updateSearchDistance(user._id, editedDistance);
          setInitialDistance(editedDistance); // Update the initial distance to reflect the new value
          await AsyncStorage.setItem('searchLocationDistance', `${editedDistance}`);
      }
      navigation.goBack();
    } catch (error) {
      console.error(`Error occured when updating user location for ${user._id} `, error);
      Alert.alert('An unknown error ocurred, please try again later');
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
    <View style={styles.container}>
      {/* Update Location Section */}
      <TouchableOpacity onPress={() => navigation.navigate('SearchLocationPreferenceScreen')}>
        <View style={styles.section}>
             <Text style={styles.preferenceTitle}>Search Location</Text>
            <Text style={styles.preferenceSubtitle}>{location ? `${location.city}, ${location.state}` : 'Not Set'}</Text>
        </View>
      </TouchableOpacity>

      {/* Update Distance Section */}
      <View style={styles.section}>
        <Text style={styles.preferenceTitle}>Search Distance</Text>
        <Text style={styles.currentDistanceText}>Current distance: {editedDistance} miles</Text>
        <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={5}
            maximumValue={50}
            step={1} // The minimum change between values
            onValueChange={setEditedDistance}
            value={editedDistance}
            minimumTrackTintColor="#ff9191"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#f77979"
        />
      </View>

       {/* Submit Button */}
       <View style={styles.bottomButtonContainer}>
        <ButtonComponent title="Save Changes" type="primary" 
          onPress={handleSubmit}
          style={{ width: '100%', flexDirection: 'row' }}
        />
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;
const marginBottom = screenHeight * 0.04; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.size10Horizontal,
  },
  preferenceItem: {
    padding: spacing.size20Horizontal,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  preferenceTitle: {
    fontSize: 18,
  },
  preferenceSubtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm, // Rounded corners for the card
    padding: spacing.size10Horizontal,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.41, // Shadow blur radius
    elevation: 2, // Elevation for Android
    marginBottom: spacing.size20Vertical, // Space between cards
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: marginBottom,
    width: '100%',
    alignItems: 'center', 
    paddingLeft: spacing.size20Horizontal,
  },
});

export default UserLocationPreferencesScreen;
