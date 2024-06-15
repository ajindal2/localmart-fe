import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Welcome to [App Name] ("we", "our", "us"). This Privacy Policy describes how we collect, use, and disclose information when you use our e-commerce app for buying and selling local produce, including but not limited to vegetables, fruits, eggs, and plants ("Services"). By accessing or using the Services, you agree to this Privacy Policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We collect information that you provide directly to us, such as when you register for an account, create or update your profile, post listings, communicate with others, and provide other user content. This may include your name, email address, profile picture, location, and any other information you choose to provide.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Information</Text>
      <Text style={styles.paragraph}>
        We use the information we collect to:
        - Provide, maintain, and improve our Services;
        - Personalize the Services to you;
        - Facilitate transactions and communications between users;
        - Send you technical notices, updates, security alerts, and support messages;
        - Monitor and analyze trends, usage, and activities in connection with our Services;
        - Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of [App Name] and others.
      </Text>

      <Text style={styles.sectionTitle}>4. Sharing of Information</Text>
      <Text style={styles.paragraph}>
        We may share information about you as follows:
        - With other users when you post listings or interact with them;
        - With third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf;
        - In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process;
        - If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of [App Name] or others.
      </Text>

      <Text style={styles.sectionTitle}>5. Security</Text>
      <Text style={styles.paragraph}>
        We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Choices</Text>
      <Text style={styles.paragraph}>
        Account Information: You may update, correct, or delete information about you at any time by logging into your account or contacting us. If you wish to delete or deactivate your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.
      </Text>

      <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
      <Text style={styles.paragraph}>
        We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice. We encourage you to review the Privacy Policy whenever you access or use our Services to stay informed about our information practices and the ways you can help protect your privacy.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us at [Contact Information].
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PrivacyPolicyScreen;
