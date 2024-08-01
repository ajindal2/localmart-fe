import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from './LocationProvider';
import { useSearchPreferences } from './SearchPreferencesContext';
import { useTheme } from '../components/ThemeContext';

const LocationInfoDisplay = React.memo(({ onPress }) => {
    const { location } = useLocation();
    const { searchDistance } = useSearchPreferences();
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);
  
    // Determine what text to display based on the available data
    let locationText = '';
    if (location) {
      if (location.city && location.state) {
        locationText += `${location.city}, ${location.state}`;
      } else if (location.city) {
        locationText += location.city;
      } else if (location.postalCode) {
        locationText += location.postalCode;
      }
      if (searchDistance) {
        locationText += ' - ' + searchDistance + ' mi';
      }
    } 
  
    // Return null to render nothing if neither city nor postalCode is available
    if (locationText === '') {
       locationText = 'Set your search preferences';
    }
  
    return (
      <TouchableOpacity style={styles.locationContainer} onPress={onPress}>
         <Ionicons name="location" size={typography.iconSize} color={colors.primary} />
          <Text style={styles.locationText}>{locationText}</Text>
      </TouchableOpacity>
    );
  });

  const getStyles = (colors, typography, spacing) => StyleSheet.create({
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacing.size10Horizontal,
        paddingBottom: spacing.size10Vertical,
      },
      locationText: {
        marginLeft: spacing.size5Horizontal,
        fontSize: typography.body,
        color: colors.primary,
        fontWeight: 'bold',
      },
 });

export default LocationInfoDisplay;
  