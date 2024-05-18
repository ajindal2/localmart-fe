import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { sendContactUsForm } from '../../api/AuthService';
import { AuthContext } from '../../AuthContext';
import NoInternetComponent from '../../components/NoInternetComponent';
import useNetworkConnectivity from '../../components/useNetworkConnectivity';
import useHideBottomTab from '../../utils/HideBottomTab'; 
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { useTheme } from '../../components/ThemeContext';


const ContactUs = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const isConnected = useNetworkConnectivity();
  const { colors, typography, spacing } = useTheme();
  const styles = getStyles(colors, typography, spacing);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] =useState(user.email);
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // to disable button after single press

  useHideBottomTab(navigation, true);

  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Assuming only one file is picked, we take the first one
        const file = result.assets[0];
        setAttachment(file);
      }
    } catch (error) {
      console.error('Error picking a document:', error);
      Alert.alert('Error', 'Error attaching document');
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const sendMessage = async () => {
    if (!user) {
      console.error('User is null, cannot sendMessage');
      return; // Exit the function if there's no user
    }

    // Check if all required fields are filled
    if (!email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Required', 'Please fill in all required fields.');
      setIsSubmitting(false); 
      return; // Stop the function if validation fails
    }

    setIsSubmitting(true); 

    try {
      const contactData = {
        subject: subject,
        message: message,
        email: email
      };
      await sendContactUsForm(contactData, attachment);
      Alert.alert('Thank you for your message. Please allow us 24-48 hours to respond.');
    } catch (error) {
      console.error(`Error sending contact us email for email ${email}, message ${message}, subject ${subject}`, error);
      if (error.message.includes('RefreshTokenExpired')) {
        logout();
      } else {
        Alert.alert('Error', 'Error sending email, please try again later');
      }
    } finally {
      setIsSubmitting(false); 
      //setShouldCreateListing(false);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <NoInternetComponent/>
      </View>
    );
  }

  let buttonTitle = isSubmitting ? "Processing..." : "Send Message";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.description}>Feel free to ask us anything, feature requests or provide feedback!</Text>

      <View style={styles.section}>
        <Text style={styles.text}>
          Your Email <Text style={styles.requiredText}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <InputComponent
            value={email}          
            style={styles.input}
            onChangeText={setEmail}  
          />
        </View>
      </View>

      <View style={styles.section}>
      <Text style={styles.text}>
          Subject <Text style={styles.requiredText}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <InputComponent
            placeholder="Subject"
            value={subject}   
            onChangeText={setSubject}     
            style={styles.input}
          />
        </View>
      </View>
    
      <View style={styles.section}>
      <Text style={styles.text}>
          Message <Text style={styles.requiredText}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <InputComponent
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Your message"
            multiline
          />
        </View>
      </View>

      <View style={styles.section}>
        {attachment ? (
          <View style={styles.attachmentContainer}>
            <Text style={styles.attachmentText} >
              {attachment.name}  
            </Text>
            <ButtonComponent title="Remove" type="secondary" 
            onPress={removeAttachment}
            style={ styles.removeButton }
            />
           
          </View>
        ) : (
          <View style={styles.attachmentContainer}>
            <Text style={styles.text}>Attach File</Text>
            <ButtonComponent title="Upload" type="secondary" 
            onPress={handleAttachment}
            style={ styles.removeButton }
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <ButtonComponent 
          title={buttonTitle}  
          type="primary" 
          onPress={sendMessage}
          disabled={isSubmitting}
          style={{ width: '100%', flexDirection: 'row' }}/>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors, typography, spacing) => StyleSheet.create({
  container: {
    padding: spacing.size10Horizontal,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    //marginBottom: spacing.sizeLarge,
    fontSize: typography.body,
    //textAlign: 'center',
  },
  label: {
    fontSize: typography.body,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.size10Horizontal,
    fontSize: typography.body,
    marginBottom: spacing.size20Vertical,
  },
  text: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.headingColor, 
    padding: spacing.xs,
    paddingRight: spacing.size10Horizontal
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: spacing.size10Horizontal,
  },
  requiredText: {
    color: 'red', // Color the asterisk red
  },
  input: {
    flex: 1,
    paddingLeft: spacing.size10Horizontal,
    paddingRight: spacing.size10Horizontal,
    borderWidth: 0,
  },
  section: {
    marginTop: spacing.size20Vertical,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.size10Vertical,
  },
  attachmentText: {
    flex: 1,
    fontSize: typography.body,
  },
  removeButton: {
    padding: spacing.size10Horizontal,
  },
});

export default ContactUs;
