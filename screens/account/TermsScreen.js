import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Welcome to [App Name] ("we", "our", "us"). These Terms and Conditions ("Terms") govern your use of our e-commerce app for buying and selling local produce, including but not limited to vegetables, fruits, eggs, and plants ("Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our Services.
      </Text>

      <Text style={styles.sectionTitle}>2. User Accounts</Text>
      <Text style={styles.subSectionTitle}>2.1 Registration</Text>
      <Text style={styles.paragraph}>
        To use certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. Registration requires providing your email, name, and password.
      </Text>
      <Text style={styles.subSectionTitle}>2.2 Account Security</Text>
      <Text style={styles.paragraph}>
        You are responsible for safeguarding your password and any other credentials used to access your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
      </Text>

      <Text style={styles.sectionTitle}>3. Permissions</Text>
      <Text style={styles.subSectionTitle}>3.1 Location and Notifications</Text>
      <Text style={styles.paragraph}>
        Our app requests permission to access your location and send notifications. Granting these permissions enhances your user experience by enabling features such as showing nearby listings and providing important updates.
      </Text>

      <Text style={styles.sectionTitle}>4. Use of Services</Text>
      <Text style={styles.subSectionTitle}>4.1 Eligibility</Text>
      <Text style={styles.paragraph}>
        You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this requirement.
      </Text>
      <Text style={styles.subSectionTitle}>4.2 User Conduct</Text>
      <Text style={styles.paragraph}>
        You agree not to engage in any of the following prohibited activities:
        - Violating any applicable law or regulation.
        - Posting or transmitting any fraudulent, deceptive, or misleading content.
        - Posting or transmitting any content that is unlawful, defamatory, obscene, or otherwise objectionable.
        - Using the Services for any illegal purpose or in violation of any local, state, national, or international law.
        - Interfering with or disrupting the integrity or performance of the Services.
      </Text>

      <Text style={styles.sectionTitle}>5. Listings and Transactions</Text>
      <Text style={styles.subSectionTitle}>5.1 Creating Listings</Text>
      <Text style={styles.paragraph}>
        Sellers can create listings by providing details about the produce, uploading photos, and giving a location for the listings. You are responsible for ensuring that all information in your listings is accurate and lawful.
      </Text>
      <Text style={styles.subSectionTitle}>5.2 Messaging and Arrangements</Text>
      <Text style={styles.paragraph}>
        Buyers can message sellers using the app to arrange payment and pickup. All transactions and arrangements are made directly between buyers and sellers. We do not facilitate in-app payments.
      </Text>

      <Text style={styles.sectionTitle}>6. Profiles and Ratings</Text>
      <Text style={styles.subSectionTitle}>6.1 User Profiles</Text>
      <Text style={styles.paragraph}>
        Users can create a profile, upload a profile picture, and manage their personal information. You agree to provide accurate and up-to-date information on your profile.
      </Text>
      <Text style={styles.subSectionTitle}>6.2 Ratings</Text>
      <Text style={styles.paragraph}>
        After a transaction, users can rate each other. Ratings help build trust within the community. You agree to provide fair and honest ratings based on your experience.
      </Text>

      <Text style={styles.sectionTitle}>7. Logging and Debugging</Text>
      <Text style={styles.paragraph}>
        We log certain information to debug issues and improve the Services. By using our Services, you consent to this logging activity.
      </Text>

      <Text style={styles.sectionTitle}>8. Content</Text>
      <Text style={styles.subSectionTitle}>8.1 User Content</Text>
      <Text style={styles.paragraph}>
        You retain ownership of the content you post on the Services. By posting content, you grant us a non-exclusive, worldwide, royalty-free, transferable, sublicensable license to use, copy, modify, create derivative works based on, distribute, publicly display, and otherwise exploit in any manner such content in connection with the operation and promotion of the Services.
      </Text>
      <Text style={styles.subSectionTitle}>8.2 Intellectual Property</Text>
      <Text style={styles.paragraph}>
        We respect intellectual property rights and expect our users to do the same. If you believe that your intellectual property rights have been infringed, please contact us at [Contact Information].
      </Text>

      <Text style={styles.sectionTitle}>9. Disclaimers and Limitation of Liability</Text>
      <Text style={styles.subSectionTitle}>9.1 Disclaimers</Text>
      <Text style={styles.paragraph}>
        The Services are provided "as is" and "as available," without warranty of any kind, either express or implied. We make no warranty that the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis.
      </Text>
      <Text style={styles.subSectionTitle}>9.2 Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        To the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the Services; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of transmission to or from the Services.
      </Text>

      <Text style={styles.sectionTitle}>10. Indemnification</Text>
      <Text style={styles.paragraph}>
        You agree to indemnify and hold harmless [App Name] and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with (a) your access to or use of the Services; (b) your violation of these Terms; or (c) your violation of any rights of another party.
      </Text>

      <Text style={styles.sectionTitle}>11. Changes to the Terms</Text>
      <Text style={styles.paragraph}>
        We may modify these Terms at any time. When we do, we will post the updated Terms on this page and change the "Last Updated" date at the top. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
      </Text>

      <Text style={styles.sectionTitle}>12. Governing Law and Dispute Resolution</Text>
      <Text style={styles.paragraph}>
        These Terms are governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association].
      </Text>

      <Text style={styles.sectionTitle}>13. Contact Information</Text>
      <Text style={styles.paragraph}>
        If you have any questions about these Terms, please contact us at [Contact Information].
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
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TermsScreen;
