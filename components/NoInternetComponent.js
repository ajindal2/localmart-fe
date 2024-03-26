import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeContext';


const NoInternetComponent = () => {
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  return (
    <View style={styles.container}>
    <Icon name="signal-wifi-off" size={typography.iconLarge} color={colors.iconColor} />
    <Text style={styles.title}>Whoops</Text>
    <Text style={styles.message}>No Internet Connection found.</Text>
    <Text style={styles.message}>Please check you internet connection before proceeding.</Text>
  </View>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.size20Vertical,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  message: {
    fontSize: typography.subHeading,
    color: colors.secondaryText,
    marginTop: spacing.size10Vertical,
    textAlign: 'center',
    paddingHorizontal: spacing.size20Horizontal,
  },
  text: {
    color: '#ffffff',
    marginLeft: 10,
  },
});

export default NoInternetComponent;
