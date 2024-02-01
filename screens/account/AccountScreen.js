import React, { useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import sections from '../../constants/AccountSections';
import { AuthContext } from '../../AuthContext';


const AccountScreen = ({ navigation }) => {

  const {logout} = useContext(AuthContext);
  
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
  
  const handleLogout = () => {
    //resetToWelcomeScreen();
    logout();
  };

  // renderItem expects an object with { item, index, separators, section }
  const renderItem = ({ item, index, separators, section }) => {

    const onItemPress = () => {
      if (item.key === 'logout') {
        handleLogout();
      } else if (item.key === 'SavedListingStackNavigator') {
        navigation.navigate('SavedListingStackNavigator', { screen: 'SavedItem', params: { fromAccount: true } });
      } else {
        navigation.navigate(item.key);
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
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0', // Set the background color for the entire screen
    },
    sectionContainer: {
      backgroundColor: '#fff',
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 1 }, // Shadow offset
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 1.41, // Shadow radius
      elevation: 2, // Elevation for Android
    },
    item: {
      backgroundColor: '#fff',
      paddingVertical: 15,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: '#e0e0e0',
      //marginLeft: 15,
    },
    // ... Add styles for other components if needed
  });

export default AccountScreen;