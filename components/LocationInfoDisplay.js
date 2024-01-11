import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../components/LocationProvider';

const LocationInfoDisplay = ({ onPress }) => {
    const { location } = useContext(LocationContext); 
  
    // Determine what text to display based on the available data
    let locationText = null;
    if (location && location.city) {
      locationText = location.city;
    } else if (location && location.postalCode) {
      locationText = location.postalCode;
    }
  
    // Return null to render nothing if neither city nor postalCode is available
    if (!locationText) {
      return null;
    }
  
    return (
      <TouchableOpacity style={styles.locationContainer} onPress={onPress}>
          <Ionicons name="location" size={24} color="black" />
          <Text style={styles.locationText}>{locationText}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      locationText: {
        marginLeft: 8,
        fontSize: 16,
      },
 });

export default LocationInfoDisplay;
  