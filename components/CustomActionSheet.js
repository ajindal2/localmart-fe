import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
                    <Ionicons name={option.icon} size={20} color="black" />
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

const getStyles = (colors, typography, spacing) => StyleSheet.create({
    modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionSheetContainer: {
    backgroundColor: '#fff',
    paddingVertical: spacing.size10,
    paddingHorizontal: spacing.size20,
    borderRadius: spacing.size20, 
    overflow: 'hidden', // This ensures the inner content does not overlap the rounded corners
    // shadow related properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2, // Shadow above the action sheet
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  grabberBar: {
    width: 40, // Adjust width as needed
    height: 4, // Adjust height as needed
    backgroundColor: 'grey',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8, // Add some space at the top
    marginBottom: 16, // Space before content starts
  },
  iconCircle: {
    width: 40, // Diameter of the circle
    height: 40, // Diameter of the circle
    borderRadius: 20, // Half of the width/height to make it a perfect circle
    backgroundColor: colors.mediumGrey, // Grey background color
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.size10,
  },
  optionText: {
    marginLeft: spacing.size10,
    fontSize: typography.body,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.size10,
    marginTop: 0, 
  },
  cancelButtonText: {
    fontSize: typography.body,
    color: colors.secondary,
  },
});

export default CustomActionSheet;
