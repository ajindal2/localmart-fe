import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from './ThemeContext';


const TagsSummary = ({ tagsSummary }) => {
    if (!tagsSummary) {
        return null; 
    }
    const tagsEntries = Object.entries(tagsSummary); // Convert object to array of entries [tag, count]
  
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);

    return (
      <View style={styles.tagsSummaryContainer}>
        {tagsEntries.map(([tag, count], index) => (
          <View key={index} style={styles.tagContainer}>
            <Text style={styles.tagName}>{tag}</Text>
            <Text style={styles.tagCount}>{count}</Text>
          </View>
        ))}
      </View>
    );
  };

const getStyles = (colors, typography, spacing) => StyleSheet.create({
    tagsSummaryContainer: {
      marginTop: spacing.size10Vertical,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.lightPrimary, // Light grey background
      borderRadius: 15, // Rounded corners for tags
      paddingHorizontal: spacing.size10Horizontal,
      paddingVertical: spacing.size5Vertical,
      marginRight: spacing.size10Horizontal, // Space between tags
      marginBottom: spacing.size10Vertical, // Space between tag rows
    },
    tagName: {
      fontSize: typography.subHeading,
      marginRight: spacing.size5Horizontal,
    },
    tagCount: {
      fontSize: typography.subHeading,
      color: colors.darkGrey, // Darker grey for the count
    },
  });

  export default TagsSummary;

  