import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';

const CustomActionSheet = ({ isVisible, onClose, options }) => {
    const { colors, typography, spacing } = useTheme();
    const styles = getStyles(colors, typography, spacing);

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.actionSheetContainer}>
        <View style={styles.grabberBar}></View>
          {options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.option} onPress={option.onPress}>
                <View style={styles.iconCircle}>
                    <Ionicons name={option.icon} size={typography.iconSize} color="black" />
                </View>
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const iconSize = width * 0.1; 

const getStyles = (colors, typography, spacing) => StyleSheet.create({
    modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionSheetContainer: {
    backgroundColor: '#fff',
    paddingVertical: spacing.size10Vertical,
    paddingHorizontal: spacing.size20Horizontal,
    borderRadius: spacing.size20Horizontal, 
    overflow: 'hidden', // This ensures the inner content does not overlap the rounded corners
    // shadow related properties
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: -2, // Shadow above the action sheet
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  grabberBar: {
    width: iconSize, 
    height: 4, 
    backgroundColor: colors.darkGrey,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.size10Vertical, // Add some space at the top
    marginBottom: spacing.size10Vertical, // Space before content starts
  },
  iconCircle: {
    width: iconSize, // Diameter of the circle
    height: iconSize, // Diameter of the circle
    borderRadius: iconSize/2, // Half of the width/height to make it a perfect circle
    backgroundColor: colors.mediumGrey, // Grey background color
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.size10Vertical,
  },
  optionText: {
    marginLeft: spacing.size10Horizontal,
    fontSize: typography.body,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.size10Vertical,
    marginTop: 0, 
  },
  cancelButtonText: {
    fontSize: typography.body,
    color: colors.secondary,
  },
});

export default CustomActionSheet;
