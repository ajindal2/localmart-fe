import React, { useContext, useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sections from '../../constants/AccountSections';
import { getUserRatings } from '../../api/RatingsService';
import { AuthContext } from '../../AuthContext';
import { useTheme } from '../../components/ThemeContext';
import { Dimensions } from 'react-native';
import { Share } from 'react-native';
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';


const AccountScreen = ({ navigation }) => {
  const isConnected = useNetworkConnectivity();
  const { user, logout } = useContext(AuthContext);
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);

  const resetToWelcomeScreen = () => {
    let rootNavigator = navigation;
    while (rootNavigator.getParent()) {
      rootNavigator = rootNavigator.getParent();
    }
  
    rootNavigator.reset({
      index: 0,
      routes: [{ name: 'WelcomeScreen' }],
    });
  };
  
  const handleLogout = async () => {
    //resetToWelcomeScreen();
    await logout();
  };

  const handleAllReviews = async () => {
    if (!user) {
      console.error('User is null, cannot handleAllReviews');
      return; // Exit the function if there's no user
    }

    try {
      const { averageRating, ratingsWithProfile } = await getUserRatings(user._id);
      navigation.navigate('AllReviewsScreen', {ratingsWithProfile, averageRating });     
    } catch (error) {
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        Alert.alert('Error', 'Error occurred when fetching ratings. Please try again later.');
        console.error(`Error fetching seller ratings for userId ${user._id}`, error);
      }
    }
  }

  const handleShareApp = async () => {
    const title = 'Check out FarmVox, the marketplace for local produce!';
    const url = 'https://farmvox.com/home';
    try {
      await Share.share({
        message: `${title}\n\n ${url}`,
      });
    } catch (error) {
      console.error('Error during sharing', error);
    }
  }

  // renderItem expects an object with { item, index, separators, section }
  const renderItem = ({ item, index, separators, section }) => {
    const { width, height } = Dimensions.get('window');
  
    const onItemPress = async () => {
      try {
        if (item.key === 'logout') {
          await handleLogout();
        } else if (item.key === 'SavedListingStackNavigator') {
          navigation.navigate('SavedListingStackNavigator', { screen: 'SavedItem', params: { fromAccount: true } });
        } else if (item.key === 'user_reviews') {
          await handleAllReviews();
        } else if (item.key === 'invite_people') {
          await handleShareApp();
        } else {
          navigation.navigate(item.key);
        }
      } catch (error) {
        console.error('Error handling item press:', error);
      }
    };
  
    return (
      <View>
        <TouchableOpacity
          style={styles.item}
          onPress={onItemPress}
        >
          <Text style={styles.itemText}>{item.text}</Text>
        </TouchableOpacity>
        {/* Only render separator if not the last item */}
        {index < section.data.length - 1 && <View style={styles.separator} />}
      </View>
    );
  };
  

  // renderSection expects an object with { section }
  const renderSection = ({ section }) => {
    return (
      <View style={styles.sectionContainer}>
        <FlatList
          data={section.data}
          renderItem={(props) => renderItem({ ...props, section })}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
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
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          {renderSection({ section })}
        </React.Fragment>
      ))}
      {/* Footer Component */}
    </View>
  );
};
  
const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
      flex: 1,
      padding: spacing.size10Horizontal,
    },
    sectionContainer: {
      backgroundColor: colors.white,
      flexDirection: 'row',
      borderRadius: 8, // Rounded corners for the card
      padding: spacing.size10Horizontal,
      paddingTop: spacing.size5Vertical, 
      paddingBottom: spacing.size5Vertical, 
      alignItems: 'center',
      shadowColor: colors.shadowColor, 
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 1.41, // Shadow blur radius
      elevation: 2, // Elevation for Android
      marginBottom: spacing.size10Vertical, // Space between cards
    },
    item: {
      backgroundColor: '#fff',
      paddingVertical: spacing.size10Vertical,
      paddingHorizontal: spacing.size10Horizontal,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      fontSize: typography.body,
    },
    separator: {
      height: 1,
      backgroundColor: '#e0e0e0',
    },
  });

export default AccountScreen;