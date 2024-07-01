import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
      This policy explains our privacy practices for Farmvox.com (which we'll refer to as the “Site”), Farmvox's mobile application (the “App”), and any other services provided by Farmvox, LLC. , located at 20289 Stevens Creek Blvd #1115, Cupertino, CA 95014 USA, referred to as “Farmvox,” “we,” “us” or “our.” We’ll refer to the Site, the App, and our other services as the “Services.” This policy does not apply to the practices of third parties (including other users who sell using the Services) who may also collect or receive data in connection with your use of the Services.
      </Text>


      <Text style={styles.sectionTitle}>2. Information Collected or Received</Text>
      <Text style={styles.sectionSubTitle}>Information Provided by You</Text>
      <Text style={styles.paragraph}>
        FarmVox collects information that you provide directly to us when you sign up and use the FarmVox service including:
      </Text>
      <Text style={styles.paragraph}>
        Information when you register or update the details of your account, communicate with other users, provide reviews or other comments, purchase services from FarmVox, request customer support, or otherwise communicate with us, post items for sale.
      </Text>
      <Text style={styles.paragraph}>
        The types of information we may collect include:
      </Text>
      <Text style={styles.paragraph}>
        - Username{'\n'}
        - Email address{'\n'}
        - Password{'\n'}
        - Postal address including city, state, and zip code{'\n'}
        - Photographs you upload of items you post for sale{'\n'}
        - Written descriptions of your posted items{'\n'}
        - Reviews or comments you make on the FarmVox Service{'\n'}
        - All messages with other users or with us sent through the FarmVox messaging service or to FarmVox directly{'\n'}
        - Any other information you choose to provide
      </Text>

      <Text style={styles.sectionSubTitle}>Sensitive Information</Text>
      <Text style={styles.paragraph}>We do not process sensitive information.</Text>

      <Text style={styles.sectionSubTitle}>Geolocation Information</Text>
      <Text style={styles.paragraph}>
        We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services like showing you nearby listings or letting the users know the location of your listing. If you wish to change our access or permissions, you may do so in your device's settings.
      </Text>

      <Text style={styles.sectionSubTitle}>Images, Photos, and Videos</Text>
      <Text style={styles.paragraph}>
        You may choose to give permission for our Services to collect images, photos, and other information from your device’s camera and photo library. For example, when you choose to include images or photos in your listings these files may include metadata indicating how, when, where and by whom the files were created and how they are formatted. Metadata may be accessible to other Members or anyone else who can access the files. If you wish to change our access or permissions, you may do so in your device's settings.
      </Text>

      <Text style={styles.sectionSubTitle}>Mobile Device Data</Text>
      <Text style={styles.paragraph}>
        We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our application(s), we may also collect information about the phone network associated with your mobile device, your mobile device’s operating system or platform, the type of mobile device you use, your mobile device’s unique device ID, and information about the features of our application(s) you accessed. We also collect server and device logs that may include information like device IP address, access dates and times, app features or pages viewed, pages that you navigate to and links that you click, app crashes and other system activity, type of browser and other ways you interact with the Platform.
      </Text>

      <Text style={styles.sectionSubTitle}>Push Notifications</Text>
      <Text style={styles.paragraph}>
        We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.
      </Text>

      <Text style={styles.sectionSubTitle}>Data Accuracy</Text>
      <Text style={styles.paragraph}>
        All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
      </Text>


      <Text style={styles.sectionTitle}>3. How do we use your information</Text>
      <Text style={styles.paragraph}>
        We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
      </Text>
      <Text style={styles.paragraph}>
      <Text style={styles.paragraphBold}>• To facilitate account creation and authentication and otherwise manage user accounts. </Text> 
        We may process your information so you can create and log in to your account, as well as keep your account in working order.
      </Text>
      <Text style={styles.paragraph}>
      <Text style={styles.paragraphBold}>• To deliver and facilitate delivery of services to the user </Text> 
        We may process your information to provide you with the requested service.
      </Text>
      <Text style={styles.paragraph}>
      <Text style={styles.paragraphBold}>• To respond to user inquiries/offer support to users. </Text>
        We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>•  To send administrative information to you. </Text>
        We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• To enable user-to-user communications. </Text>
        We may process your information if you choose to use any of our offerings that allow for communication with another user.
        </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• To request feedback.</Text>
         We may process your information when necessary to request feedback and to contact you about your use of our Services.
      </Text>
      <Text style={styles.paragraph}>
      <Text style={styles.paragraphBold}>• To protect our Services. </Text>
       We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention, conduct investigations and to respond to disputes between users, error resolution, and other similar customer support service.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• To evaluate and improve our Services, products, marketing, and your experience. </Text>
          We may process your information when we believe it is necessary to identify usage trends, and to evaluate and improve our Services, products, and your experience.
        </Text>
      <Text style={styles.paragraph}>
      <Text style={styles.paragraphBold}>•  To comply with our legal obligations or requests from law enforcement agencies. </Text> 
        To resolve any disputes that we may have with any of our users, and enforce our agreements with third parties.
      </Text>


      <Text style={styles.sectionTitle}>4. FarmVox is based in the United States.</Text>
      <Text style={styles.paragraph}>
        FarmVox is based in the United States and the information we collect is governed by U.S. law. By accessing or using the FarmVox Service or otherwise providing information to us, you consent to the processing and transfer of information in and to the U.S. and other countries, where you may not have the same rights and protections as you do under local law.      
      </Text>


      <Text style={styles.sectionTitle}>5. How Is My Personal Information Shared with Others?</Text>
      <Text style={styles.paragraph}>
        We may share your data with third-party vendors, service providers, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organization apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct. The categories of third parties we may share personal information with are as follows - Data Storage Service Providers, Performance Monitoring Tools, Cloud Hosting Services.
        For legal purposes - We may share your information when we believe that the disclosure is reasonably necessary to (a) comply with applicable laws, regulations, legal process, or requests from law enforcement or regulatory authorities, (b) prevent, detect, or otherwise handle fraud, security, or technical issues, and (c) protect the safety, rights, or property of any person, the public, or FarmVox
        We also may need to share your personal information in the following situations:
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• Other Users. </Text> 
        FarmVox is a platform for neighbors to share their produce with others. To that end, the content you share on FarmVox, such as listings, profile image, reviews, your profile information like user name, may be visible to other members, businesses, governments and agencies, or the public.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• Business Transfers. </Text> 
        We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.paragraphBold}>• When we use Google Maps Platform APIs. </Text> 
        We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API). We use certain Google Maps Platform APIs to retrieve certain information when you make location-specific requests. This includes: Location information; and other similar information. A full list of what we use information for can be found in the section “How do we use your information”. We obtain and store on your device ("cache") your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document. The Google Maps Platform APIs that we use store and access cookies and other information on your devices. 
      </Text>


      <Text style={styles.sectionTitle}>6. How long do we keep your information?</Text>
      <Text style={styles.paragraph}>
        We retain personal information in our server logs, our databases, and our records for as long as necessary to provide our Services. We may need to retain some of your information for a longer period, such as in order to comply with our legal or regulatory obligations, to resolve disputes or defend against legal claims.
      </Text>


      <Text style={styles.sectionTitle}>7. How do we keep your information safe? </Text>
      <Text style={styles.paragraph}>
      We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
      We will make any legally required notifications of any breach of the security, confidentiality, or integrity of your personally identifiable information (as breaches are defined under applicable state or federal statutes on security breach notification). To the extent permitted by applicable laws, we will make such notifications to you without unreasonable delay, as consistent with (i) the legitimate needs of law enforcement or (ii) any measures necessary to determine the scope of the breach and restore the reasonable integrity of the data system.      
      </Text>


      <Text style={styles.sectionTitle}>8. Do we collect information from minors? </Text>
      <Text style={styles.paragraph}>
        We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at support@farmvox.com.
      </Text>


      <Text style={styles.sectionTitle}>9. Changes to this Policy</Text>
      <Text style={styles.paragraph}>
      We may amend or update this policy from time to time. If we believe that the changes are material, we'll let you know by doing one (or more) of the following: (i) posting the changes on or through the Services, (ii) sending you an email or message about the changes, or (iii) posting an update in the version notes on the App's platform. We encourage you to check back regularly and review any updates.       
      </Text>


      <Text style={styles.sectionTitle}>10. What are my choices?</Text>
      <Text style={styles.paragraph}>
        FarmVox provides you with options to access, edit, or remove certain information, as well as choices regarding how we contact you. You may change or correct your FarmVox account information through your account settings. You can also remove certain optional information that you no longer wish to be publicly visible through the Services. Additionally, you can request to permanently close your account and delete your personal information by contacting us. Depending on your location, you may benefit from a number of rights with respect to your information. While some of these rights apply generally, certain rights apply in limited cases.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Access & Portability</Text>
      <Text style={styles.subBulletPoint}>
        - You can access certain personal information associated with your account by visiting your user dashboard.
      </Text>
      <Text style={styles.subBulletPoint}>
        - You can request a copy of your personal information in an easily accessible format and information explaining how that information is used by emailing support@farmvox.com with "Data Request" in the subject line.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Correction</Text>
      <Text style={styles.subBulletPoint}>
        - You have the right to request that we rectify inaccurate information about you.
      </Text>
      <Text style={styles.subBulletPoint}>
        - By visiting your user dashboard, you can correct and change certain personal information associated with your account.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Restrict Processing</Text>
      <Text style={styles.subBulletPoint}>
        - In certain cases where we process your information, you may also have the right to restrict or limit the ways in which we use your personal information.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Deletion</Text>
      <Text style={styles.subBulletPoint}>
        - In certain circumstances, you have the right to request the deletion of your personal information, except information we are required to retain by law, regulation, or to protect the safety, security, and integrity of FarmVox.
      </Text>
      <Text style={styles.subBulletPoint}>
        - You can request deletion by emailing support@farmvox.com with "Data Deletion Request" in the subject line.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Object</Text>
      <Text style={styles.subBulletPoint}>
        - If we process your information based on our legitimate interests as explained above, or in the public interest, you can object to this processing in certain circumstances.
      </Text>
      <Text style={styles.subBulletPoint}>
        - In such cases, we will cease processing your information unless we have compelling legitimate grounds to continue processing or where it is needed for legal reasons.
      </Text>
      <Text style={styles.bulletPoint}>• Right to Withdraw Consent</Text>
      <Text style={styles.subBulletPoint}>
        - Where we rely on consent, you can choose to withdraw your consent to our processing of your information by contacting us.
      </Text>
      <Text style={styles.subBulletPoint}>
        - If you have consented to share your precise device location details but would no longer like to continue sharing that information with us, you can revoke your consent to the sharing of that information through the settings on your mobile device.
      </Text>
      <Text style={styles.subBulletPoint}>
        - This is without prejudice to your right to generally permanently close your account and delete your personal information.
      </Text>
      <Text style={styles.sectionSubTitle}>Additional Rights for California Residents</Text>
      <Text style={styles.bulletPoint}>• Right to Know</Text>
      <Text style={styles.subBulletPoint}>
        California residents may request disclosure of the specific pieces and/or categories of personal information that the business has collected about them, the categories of sources for that personal information, the business or commercial purposes for collecting the information, the categories of personal information that we have disclosed, and the categories of third parties with which the information was shared.
      </Text>
      <Text style={styles.paragraph}>
      If you would like to manage, change, limit, or delete your personal information, you can do so by visiting your user dashboard. Alternatively, you can exercise any of the rights above by contacting us via email at support@farmvox.com. Once you contact us to exercise any of your rights, we will confirm receipt of your request.
      Limiting use of, or deleting, your personal information may impact features and uses that rely on that information. However, we will not discriminate against you for exercising any of your rights, including denying you goods or services, providing you with a different level or quality of services, or charging you different prices or rates for services. If you need further assistance, you can contact FarmVox through one of the channels listed below under “Contact.” We will respond to your request within a reasonable timeframe.
      Please note that we may verify your identity before we are able to process any of the requests described in this section, and at our discretion, deny your request if we are unable to verify your identity. As a part of this process, government or other identification may be required. You may designate an authorized agent to make a request on your behalf. To designate an authorized agent to make a request on your behalf, you must provide a valid power of attorney, the requester’s valid government-issued identification, and the authorized agent’s valid government-issued identification, and we may verify the authenticity of the request directly with you.
      </Text>


      <Text style={styles.sectionTitle}>11. Disclosures for Residents of California</Text>
      <Text style={styles.paragraph}>
        California law permits residents of California to request certain details about how their information is shared with third parties for direct marketing purposes. FarmVox does not share your personally identifiable information with third parties for the third parties' direct marketing purposes unless you provide us with consent to do so.
      </Text>


      <Text style={styles.sectionTitle}>12. Contact Information</Text>
      <Text style={styles.paragraph}>
        Questions or comments about our Privacy Policy? Contact us at support@farmvox.com
      </Text>

      <Text style={styles.paragraph}>

        
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
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  paragraphBold: {
    fontWeight: 'bold',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subBulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 20,
  },
});

export default PrivacyPolicyScreen;
