import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CameraButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      // Style your button as needed, this is just an example
      width: 45,
      height: 45,
      borderRadius: 22,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      //position: 'absolute', // Position absolutely within the parent view
      //bottom: -22, // Half the height to center it vertically
      borderWidth: 2, // Width of the border to create the white ring
      borderColor: 'white', // Color of the border
      elevation: 5, // Add elevation to lift the button up (for Android)
      // TODO for iOS: The elevation property is used to add a shadow effect on Android, which can make the button appear to be floating above the tab bar. If you're targeting iOS, you might need to add a shadow to the button as well, which uses different styling properties like shadowColor, shadowOffset, shadowOpacity, and shadowRadius.
    }}
  >
    <Ionicons name="camera" size={35} color="#fff" />
  </TouchableOpacity>
);

export default CameraButton;