import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocation } from '../components/LocationProvider';
import Slider from '@react-native-community/slider';
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; 
import ButtonComponent from '../components/ButtonComponent';
import { updateSearchDistance } from '../api/UserPreferencesService'
import { AuthContext } from '../AuthContext';
import NoInternetComponent from '../components/NoInternetComponent';
import useNetworkConnectivity from '../components/useNetworkConnectivity';
import { useSearchPreferences } from '../components/SearchPreferencesContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const UserSearchPreferencesScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { location } = useLocation();
  const { searchDistance, setSearchDistance } = useSearchPreferences();
  const [distance, setDistance] = useState(searchDistance);  const { user } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [isCreating, setIsCreating] = useState(false); // to disable 'update location' button after single press

  const handleSubmit = async () => {
    setIsCreating(true); 
    try {
      await updateSearchDistance(user._id, distance);
      setSearchDistance(distance);
      navigation.goBack();
    } catch (error) {
      console.error(`Error occured when updating user location for ${user._id} `, error);
      Alert.alert('An unknown error ocurred, please try again later');
    } finally {
      setIsCreating(false); 
    }
  };

  let buttonTitle = isCreating ? "Processing..." : "Save Changes";

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Update Location Section */}
      <TouchableOpacity onPress={() => navigation.navigate('SearchLocationPreferenceScreen')}>
      <View style={styles.clickableSection}>
          <View style={styles.textContainer}>
            <Text style={styles.preferenceTitle}>Search Location</Text>
            <Text style={styles.preferenceSubtitle}>{location ? `${location.city}, ${location.state}` : 'Not Set'}</Text>
            </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* Update Distance Section */}
      <View style={styles.section}>
        <Text style={styles.preferenceTitle}>Search Distance</Text>
        <Text style={styles.preferenceSubtitle}>Current distance: {distance} miles</Text>
        <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={5}
            maximumValue={50}
            step={1} // The minimum change between values
            onValueChange={setDistance}
            value={distance}
            minimumTrackTintColor={colors.secondary}
            maximumTrackTintColor={colors.mediumGrey}
            thumbTintColor={colors.primary}
        />
      </View>

       {/* Submit Button */}
       <View style={styles.bottomButtonContainer}>
        <ButtonComponent  title={buttonTitle}  
          type="primary" 
          onPress={handleSubmit}
          disabled={isCreating}
          loading={isCreating} 
          style={{ width: '100%', flexDirection: 'row' }}
        />
      </View>
    </KeyboardAwareScrollView>
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
    fontSize: typography.heading,
    fontWeight: 'bold',
  },
  preferenceSubtitle: {
    fontSize: typography.subHeading,
    color: colors.secondaryText,
    marginTop: spacing.xs
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
  clickableSection: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space out items evenly
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
  textContainer: {
    flexDirection: 'column',
  },
});

export default UserSearchPreferencesScreen;
