import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

const useHideBottomTab = (navigation, shouldHide) => {
  console.log('shouldHide: ', shouldHide);
  const findTabNavigator = (navigation) => {
    const parent = navigation.getParent();
    if (!parent) {
      return null; // Reached the top of the navigation tree
    }
  
    if (parent.getState().type === 'tab') {
      return parent; // Found the bottom tab navigator
    }
  
    return findTabNavigator(parent); // Recurse up the tree
  };

  useFocusEffect(
    React.useCallback(() => {
      const tabNavigator = findTabNavigator(navigation);
      if (tabNavigator && shouldHide) {
        // Hide the tab bar
        setTimeout(() => {
          tabNavigator.setOptions({ tabBarStyle: { display: 'none' } });
        }, 50);
      }

      return () => {
        // Show the tab bar when leaving the screen
        if (tabNavigator && shouldHide) {
          tabNavigator.setOptions({ tabBarStyle: undefined });
        }
      };
    }, [navigation, shouldHide]) // Add shouldHide to the dependency array
  );
};

export default useHideBottomTab;

