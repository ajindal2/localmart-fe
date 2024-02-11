import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../components/LocationProvider';
import { useTheme } from '../components/ThemeContext';

const LocationInfoDisplay = ({ onPress }) => {
    const { location } = useContext(LocationContext); 
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
  
    // Determine what text to display based on the available data
    let locationText = 'Searching in: ';
    if (location) {
      if (location.city && location.state) {
        locationText += `${location.city}, ${location.state}`;
      } else if (location.city) {
        locationText += location.city;
      } else if (location.postalCode) {
        locationText += location.postalCode;
      }
    } 
  
    // Return null to render nothing if neither city nor postalCode is available
    if (locationText === 'Searching in: ') {
       locationText = 'Set your search location';
    }
  
    return (
      <TouchableOpacity style={styles.locationContainer} onPress={onPress}>
         <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.locationText}>{locationText}</Text>
      </TouchableOpacity>
    );
  };

  const getStyles = (colors, typography, spacing) => StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingBottom: 10,
      },
      locationText: {
        marginLeft: 5,
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
      },
 });

export default LocationInfoDisplay;
  