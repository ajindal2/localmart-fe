import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../components/LocationProvider';

const LocationInfoDisplay = ({ onPress }) => {
    const { location } = useContext(LocationContext); 
  
    // Determine what text to display based on the available data
    let locationText = 'Searching in: ';
    if (location && location.city) {
      locationText += location.city;
    } else if (location && location.postalCode) {
      locationText += location.postalCode;
    }
  
    // Return null to render nothing if neither city nor postalCode is available
    if (locationText === 'Searching in: ') {
       locationText = 'Set your search location';
  }
  
    return (
      <TouchableOpacity style={styles.locationContainer} onPress={onPress}>
         <Ionicons name="location" size={20} color="blue" />
          <Text style={styles.locationText}>{locationText}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingBottom: 10,
      },
      locationText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'blue',
      },
 });

export default LocationInfoDisplay;
  