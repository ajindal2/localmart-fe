import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Welcome to FarmVox, provided by Farmvox, LLC., a California corporation located at 20289 Stevens Creek Blvd #1115, Cupertino, CA 95014 USA. This agreement outlines the terms and conditions (“Terms”) governing your use of our website at www.farmvox.com (“Site”) and/or our mobile application (“App”). 
        BY DOWNLOADING, INSTALLING, OR OTHERWISE ACCESSING OR USING THE PLATFORM, YOU AGREE THAT YOU HAVE READ, UNDERSTOOD AND TO BE BOUND BY THESE TERMS AND ACKNOWLEDGE AND AGREE TO THE COLLECTION, USE AND DISCLOSURE OF YOUR PERSONAL INFORMATION IN ACCORDANCE WITH FARMVOX PRIVACY POLICY. IF YOU DO NOT AGREE, YOU MAY NOT USE THE PLATFORM.
        By accessing or using our Site or App, you agree to comply with the latest version of these Terms. Please review them carefully.
      </Text>

      <Text style={styles.sectionTitle}>2. Overview of FarmVox Services</Text>
      <Text style={styles.paragraph}>
        FarmVox is a marketplace facilitating the buying and selling of goods such as homegrown produce, plants, animal products like eggs and honey from various geographic locations. The FarmVox services allow you to post these items for sale or for free by uploading pictures and providing item descriptions. When a buyer and seller agree on a price for an item posted for sale, they can message each other and the transactions are arranged directly between buyers and sellers via our App, The details of such a transaction and their payments are made directly between the buyer and the seller when they complete their transaction, pursuant to terms they determine. FarmVox is not a party to such transactions in any way, does not facilitate such transactions, and cannot assist with refunds or returns related to such transactions in any manner. Since FarmVox is not a party or involved in transactions of this nature, you acknowledge we cannot be held liable for any claims that arise out of it.
        FarmVox does not have control over and cannot guarantee the following: the existence, quality, safety, or legality of items listed; the truthfulness or accuracy of users' content or listings; the sellers' ability to sell items; the buyers' ability to pay for items; or the likelihood that a buyer or seller will complete a transaction or process a return. We may assist in resolving disputes but are not responsible for ensuring transactions are completed or returned. 
      </Text>
      
      <Text style={styles.sectionTitle}>3. User Accounts</Text>
      <Text style={styles.bulletPoint}>• Eligibility:</Text>
      <Text style={styles.paragraph}>
      To use certain services, you must create an account with FarmVox. You must be at least eighteen (18) years old to use the Platform.By agreeing to these Terms, you represent and warrant to us: (1)That you are at least eighteen (18) years old; (2) That you have not previously been suspended, banned, or removed from the Platform; and (3) That your registration and your use of the Platform is in compliance with any and all applicable laws and regulations.
      </Text>
      <Text style={styles.bulletPoint}>• Account Registration:</Text>
      <Text style={styles.paragraph}>You must register for an account to use our Platform.</Text>
      <Text style={styles.subBulletPoint}>
        - Provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
      </Text>
      <Text style={styles.subBulletPoint}>
        - Choose an appropriate name that does not use offensive or infringing language.      
      </Text>
      <Text style={styles.subBulletPoint}>
        - Your account is non-transferable.
      </Text>
      <Text style={styles.subBulletPoint}>
        - These Terms don't create any agency, partnership, joint venture, employment, or franchisee relationship between you and FarmVox.
      </Text>

      <Text style={styles.bulletPoint}>• Account Security:</Text>
      <Text style={styles.paragraph}>
      You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
      </Text>

      <Text style={styles.sectionTitle}>4. User Obligations</Text>
      <Text style={styles.paragraph}>

      The FarmVox App is designed solely for personal use. You are required to adhere to all relevant laws and any third-party agreements, such as your wireless data service contract, when using the App. FarmVox retains all ownership rights to the App and its contents.

      You may not download, export, or re-export the App or its underlying technology to or in: (a) any country that is under a U.S. embargo; (b) any entity or individual on the U.S. Department of the Treasury's Specially Designated Nationals List, or the U.S. Department of Commerce’s Denied Party or Entity List; and (c) any other country, person, end-user, or entity specified by U.S. export laws as prohibited. It is your responsibility to ensure compliance with all U.S. and international trade regulations and laws, ensuring that you are not located in a country under U.S. embargo or designated as supporting terrorism, and that you are not named on any U.S. government list of banned or restricted parties.

      When using FarmVox, you agree to:
      </Text>
      <Text style={styles.bulletPoint}>• Compliance:</Text>
      <Text style={styles.paragraph}>Adhere to these Terms, all applicable laws, and our policies.</Text>
      <Text style={styles.bulletPoint}>• Prohibited Conduct:</Text>
      <Text style={styles.paragraph}>Not engage in any of the following activities: </Text>
      <Text style={styles.subBulletPoint}> - Violate any laws, regulations, third-party rights, or our systems and policies.</Text>
      <Text style={styles.subBulletPoint}> - Visit our website or use our Services with the intention, in whole or in part, of establishing a basis for asserting a lawsuit or claim in arbitration against us.</Text>
      <Text style={styles.subBulletPoint}> - Use our services if you are unable to form legally binding contracts, are under 18, or are prohibited from using our services by law.</Text>
      <Text style={styles.subBulletPoint}> - Manipulate item prices or interfere with other users' listings.</Text>
      <Text style={styles.subBulletPoint}> - Transfer your FarmVox account without our consent or sharing your login credentials.</Text>
      <Text style={styles.subBulletPoint}> - Post inappropriate, false, misleading, or defamatory content.</Text>
      <Text style={styles.subBulletPoint}> - Distribute spam, viruses, or harmful technologies.</Text>
      <Text style={styles.subBulletPoint}> - Use automated tools to utilize the FarmVox Services or to collect or extract data from FarmVox, such as a harvesting bot, robot, spider, script, crawler, or scraper, not provided by FarmVox. </Text>
      <Text style={styles.subBulletPoint}> - Harvest or use information about users without their consent.</Text>
      <Text style={styles.subBulletPoint}> - Use our Services other than for their intended purpose and in any manner that could interfere with, disrupt, negatively affect or inhibit other users from fully enjoying our Services or that could damage, disable, overburden or impair the functioning of our Services or any infrastructure of our Services in any manner.</Text>
      <Text style={styles.subBulletPoint}> - Engage in any harassing, threatening, intimidating, predatory or stalking conduct.</Text>
      <Text style={styles.subBulletPoint}> - Copy, reproduce, distribute, publicly perform or publicly display all or portions of our Services, including our underlying content and source code.</Text>
      <Text style={styles.subBulletPoint}> - Use the FarmVox Services to infringe or violate the intellectual property rights or any other rights of anyone else (including FarmVox).</Text>
      <Text style={styles.subBulletPoint}> - Modify, adapt, translate, decompile, or reverse-engineer the App, nor remove any proprietary notices.</Text>


      <Text style={styles.sectionTitle}>5. User Content</Text>
      <Text style={styles.bulletPoint}>• Ownership:</Text>
      <Text style={styles.paragraph}> You retain ownership of any content you post, upload, or otherwise make available through the Platform ("User Content"). By posting User Content, you grant FarmVox a non-exclusive, worldwide, royalty-free, transferable, sublicensable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the operation and promotion of the Platform.</Text>

      <Text style={styles.bulletPoint}>• Responsibility:</Text>
      <Text style={styles.paragraph}>You are solely responsible for your User Content. You represent and warrant that you have all rights necessary to grant the licenses granted herein and that your User Content does not infringe or violate the rights of any third party.</Text>
      
      <Text style={styles.bulletPoint}>• Prohibited Content:</Text>
      <Text style={styles.paragraph}>You agree not to post any User Content that:</Text>
      <Text style={styles.subBulletPoint}> - Is illegal, fraudulent, defamatory, obscene, pornographic, violent, or otherwise inappropriate.</Text>
      <Text style={styles.subBulletPoint}> - Infringes any patent, trademark, trade secret, copyright, or other intellectual property rights.</Text>
      <Text style={styles.subBulletPoint}> - Is fraudulent, misleading or false, may encourage deceptive activity, or would otherwise constitute as duplicitous behavior.</Text>
      <Text style={styles.subBulletPoint}> - Is, in FarmVox’s judgment, disrespectful, inappropriate, or may expose FarmVox, our users or others to harm or liability.</Text>
      <Text style={styles.subBulletPoint}> - Includes any statements or claims that do not reflect your honest views and experiences.</Text>
      <Text style={styles.subBulletPoint}> - Contains any unsolicited marketing promotions, political campaigning, advertising, or solicitations.</Text>
      <Text style={styles.subBulletPoint}> - Contains any private information of any third parties, including addresses, phone numbers and payment card information.</Text>
      <Text style={styles.subBulletPoint}> - Violates the privacy or publicity rights of others.</Text>
      <Text style={styles.subBulletPoint}> - Contains harmful or malicious code, viruses, or other harmful software.</Text>


      <Text style={styles.bulletPoint}>• Monitoring and Removal:</Text>
      <Text style={styles.paragraph}>FarmVox reserves the right to monitor, review, and remove any User Content at our discretion and without notice, for any reason or no reason, including content that we believe violates these Terms or is otherwise harmful to the Platform or our users.</Text>


      <Text style={styles.sectionTitle}>6. User Ratings</Text>
      <Text style={styles.bulletPoint}>• Seller Ratings:</Text>
      <Text style={styles.paragraph}>Users have the ability to rate sellers. These ratings are public and can be viewed by all users of the Platform. Seller ratings are intended to help other users make informed decisions.</Text>

      <Text style={styles.bulletPoint}>• Buyer Ratings:</Text>
      <Text style={styles.paragraph}>Users can also rate buyers. These ratings are stored within the system and are not made public. Buyer ratings are used internally to improve the quality and safety of the marketplace.</Text>

      <Text style={styles.bulletPoint}>• Rating Guidelines:</Text>
      <Text style={styles.paragraph}>When leaving ratings, users must provide truthful and accurate feedback. Any misuse of the rating system, including posting false or defamatory ratings, is a violation of these Terms and may result in account limitations or termination.</Text>


      <Text style={styles.sectionTitle}>7. Seller Obligations</Text>
      <Text style={styles.paragraph}> By listing and selling on our Site or App, you agree to the following while operating as a seller: </Text>
      <Text style={styles.bulletPoint}>• Listings:</Text>
      <Text style={styles.paragraph}>Sellers must ensure that all listings are accurate, complete, and not misleading and are solely responsible for all applicable legal and regulatory disclosure requirements that pertain to your product.</Text>
      
      <Text style={styles.bulletPoint}>• Compliance:</Text>
      <Text style={styles.paragraph}>Sellers must comply with all applicable laws, including those related to the sale of food and agricultural products.</Text>
      
      <Text style={styles.bulletPoint}>• Transaction Completion:</Text>
      <Text style={styles.paragraph}>Sellers are responsible for fulfilling the transactions agreed upon with buyers, including arranging for the pickup and receiving payment.</Text>
      <Text style={styles.paragraph}>Further, you agree that, unless otherwise expressly provided, FarmVox has no control over and does not guarantee: the ability of buyers to pay for items or that a buyer will actually complete a transaction or return an item.</Text>

      <Text style={styles.sectionTitle}>8. Buyer Obligations</Text>
      <Text style={styles.bulletPoint}>• Due Diligence:</Text>
      <Text style={styles.paragraph}>Buyers must conduct their own due diligence regarding the quality, safety, and legality of the items listed.</Text>

      <Text style={styles.bulletPoint}>• Transaction Completion:</Text>
      <Text style={styles.paragraph}>Buyers are responsible for completing transactions as agreed upon with sellers, including arranging for the pickup and making payments.</Text>

      <Text style={styles.paragraph}>Further, you agree that, unless otherwise expressly provided, FarmVox has no control over and does not guarantee: the existence, quality, safety, or legality of items advertised; the truth or accuracy of users' content or listings; the ability of sellers to sell items; or that a seller will actually complete a transaction or return an item.</Text>


      <Text style={styles.sectionTitle}>9. Listing Policy</Text>
      <Text style={styles.paragraph}>When you list an item for sale through our Services, you must adhere to all of FarmVox's Terms. Additionally, you agree to the following conditions: </Text>
      
      <Text style={styles.subBulletPoint}> - You must create your own listing using your original images, text, and videos. The content of your listing must not infringe on the rights of third parties. You must not use any third-party content in your listings without explicit written permission from the rights holder. Using content from other websites or search engines without permission could lead to copyright or trademark infringement, for which you will be held solely responsible.</Text>
      <Text style={styles.subBulletPoint}> - You assume full responsibility for the item offered and accurately describing the item for sale. It must also comply with all relevant regulations, which could include rules about animal or food products, packaging, labeling, or disclosures.</Text>
      <Text style={styles.subBulletPoint}> - Some items may be prohibited or restricted for sale due to legal or regulatory reasons. You are solely responsible for ensuring that your listings comply with all legal restrictions and local, state, or federal laws, and for any liabilities that arise from non-compliance.</Text>
      <Text style={styles.subBulletPoint}> - If any product you list is recalled by a manufacturer or a governmental agency, you agree to promptly remove the listing if the sale is prohibited by law or if the product poses a health or safety risk as identified by any authority.</Text>
      <Text style={styles.subBulletPoint}> - FarmVox is not responsible for the safety, quality, or legality of any product you list or sell on our platform. This includes any non-conformity or defects in, or any public or private recalls of, the products you sell.</Text>

      <Text style={styles.paragraph}>FarmVox reserves the right to manage, modify, or remove any listings at its sole discretion for any reason. Violating these terms may result in various actions, including, but not limited to, ending or canceling listings, hiding or demoting listings in search results, lowering your seller rating, imposing buying or selling restrictions, or suspending your account.</Text>


      <Text style={styles.sectionTitle}>10. Privacy and Data Protection</Text>
      <Text style={styles.paragraph}>Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.</Text>


      <Text style={styles.sectionTitle}>11. Suspension;Termination</Text>
      <Text style={styles.paragraph}>You may terminate your account with FarmVox at any time by contacting us. Termination will not immediately remove all your content or listings. We may terminate or suspend your account if you violate our Terms. If terminated, you may lose access to your account information and content.</Text>
      <Text style={styles.paragraph}>FarmVox reserves the right to change, suspend, or discontinue any services for you or any user at any time without liability.</Text>
      <Text style={styles.paragraph}>All Terms remain in effect during the use of the Site, App, or services. Some Terms will remain in effect even after your access to the service is terminated or your use of the service ends.</Text>


      <Text style={styles.sectionTitle}>12. Policy Enforcement</Text>
      <Text style={styles.paragraph}>Farmvox reserves the right to control access to our services at our sole discretion, including but not limited to blocking, filtering, re-categorizing, re-ranking, deleting, delaying, holding, omitting, verifying, or terminating your access, listings, or account. You agree not to circumvent any such controls. We are not liable for regulating or choosing not to regulate our services, and no statements or actions from us should be seen as waiving this right.</Text>
      <Text style={styles.paragraph}>If it appears that you are misusing FarmVox or our services in any way, we retain the right to, without limiting other remedies, restrict, suspend, or terminate your user accounts and access to our services, delay or remove hosted content, revoke any special account status, remove or hide listings, reduce or remove discounts, and take both technical and legal measures to prevent you from using our services. </Text>
      <Text style={styles.paragraph}>In instances involving buyer or seller disputes, we may take into account the user’s performance history and the specifics of the situation when applying our policies. We may opt for leniency in enforcing policies to fairly address both buyers and sellers. However, this does not restrict our right to refuse, alter, or terminate any or all parts of our services to anyone at any time, for any reason, according to our judgment. </Text>
      <Text style={styles.paragraph}>FarmVox is not obligated, but holds the right to conduct investigations into you, your business, its owners, officers, directors, managers, and other principals, your websites, and the materials on those sites whenever we choose. These investigations are for our benefit alone. If our investigation uncovers any action or omission that we believe violates any local, state, federal, or international law or regulation, or this Agreement, or is detrimental to the service, we may immediately terminate your access. Additionally, in cases of unlawful activities, we may notify relevant authorities. You waive any claims against FarmVox related to such actions, including disruptions to your business. We also reserve the right to disclose any relevant information about your servers to copyright holders or other legitimate complainants. </Text>


      <Text style={styles.sectionTitle}>13. Taxes</Text>
      <Text style={styles.paragraph}>You are responsible for any sales, use, duty, or other governmental taxes or fees due with respect to your purchase or sale through the Services.</Text>


      <Text style={styles.sectionTitle}>14. Assumption of Risk</Text>
      <Text style={styles.subBulletPoint}> - By using an internet-based marketplace like ours, you acknowledge the inherent risks of online interactions and meeting other users in person. We do not check or confirm any user's background, reputation, behavior, moral character, or the accuracy of the information they provide to the services. You are fully responsible for taking precautions during interactions with other users, especially when meeting a stranger for the first time. Be aware that other users might try to harm you, deceive you, or steal information from you for fraudulent purposes. All risks associated with buying and selling on Farmvox, including your interactions both online and offline with other users, are your responsibility.</Text>
      <Text style={styles.subBulletPoint}> - Community meetup spots are designated locations endorsed by third parties, like police departments or local stores, where they have agreed to display a community meetup sign. While we encourage these spots to be in well-lit, surveilled, and busy areas, Farmvox does not check the conditions of these spots, does not oversee them, and cannot guarantee their safety or standards. Your use of community meetup spots and any issues arising from their use, including disputes with any third party providing a community meetup spot, are governed strictly by the terms set out here.</Text>


      <Text style={styles.sectionTitle}>15. Disclaimer of Warranties; Limitation of Liability</Text>
      <Text style={styles.paragraph}>Our sites and services, along with all content, software, functions, materials, and information provided through them, are offered "as is" and "as available," without any form of warranty, either express or implied, to the fullest extent permitted by law. This includes, but is not limited to, implied warranties of non-infringement, merchantability, or fitness for a particular purpose. </Text>
      <Text style={styles.paragraph}>We function purely as an intermediary platform, facilitating content delivery and communication between buyers and sellers, without selling any items listed ourselves. </Text>
      <Text style={styles.paragraph}>We do not provide any assurances or warranties regarding the accuracy, completeness, timeliness, uninterrupted availability, or error-free operation of our site or services, nor do we guarantee that defects will be corrected or that our services or the servers that make them available are free from viruses or other harmful elements. You should be aware that transmissions to and from our sites and services are not confidential, and your communications may be accessible to others. By using our services and submitting or posting content, you understand that no confidential, fiduciary, implied, or other relationship is created with us other than what is expressed in these terms. </Text>
      <Text style={styles.paragraph}>You also agree not to hold us accountable for any content provided by users or for any transactions or interactions between users, acknowledging our role as a non-participating third party without control over the safety or accuracy of transactions, items, or content on our site and services. </Text>
      <Text style={styles.paragraph}>FarmVox, to the fullest extent allowed by law, will not be held liable for any consequential, indirect, special, or incidental damages or losses, including but not limited to loss of money, goodwill, reputation, profits, or other intangible losses, regardless of whether these were foreseeable or whether FarmVox had been notified of the potential for such damages. This exclusion applies to any claims brought under any theory of liability, including contract, tort, negligence, or warranty. Accordingly, all such damages and losses are expressly excluded from this agreement, whether they were anticipated or not. Even if FarmVox or associated parties were aware of the possibility, they will not be liable for any such damages under any circumstances. </Text>
      <Text style={styles.paragraph}>The limitations on warranties and damages outlined here may not apply if prohibited by law. However, should we be found liable despite these terms, our liability to you or any third party shall not exceed $100. </Text>


      <Text style={styles.sectionTitle}>16. Release from Liability</Text>
      <Text style={styles.paragraph}>If you have a dispute with one or more users, you release us from claims, demands, and damages of every kind and nature, known and unknown, arising out of or in any way connected with such disputes. In entering into this release, you expressly waive any protections (whether statutory or otherwise) that would otherwise limit the coverage of this release to include only those claims which you may know or suspect to exist in your favor at the time of agreeing to this release.</Text>


      <Text style={styles.sectionTitle}>17. Return and Cancellation Policies</Text>
      <Text style={styles.paragraph}>All terms related to the sale, payment, or return/refund of items are between the seller and buyer. FarmVox is not a party to any of those terms or contracts. </Text>


      <Text style={styles.sectionTitle}>18. Compliance with Laws and Regulations</Text>
      <Text style={styles.paragraph}>Every buyer, seller, or user using FarmVox Services must ensure that their use of these services for direct sales is lawful under the laws of their jurisdiction. You are responsible for complying with all applicable local, state, federal, and international laws, regulations, and rules related to your use of our App, Site, and Services, and any transactions you engage in through these platforms. You also agree to indemnify and hold FarmVox harmless if your use of our Service breaches any law. Furthermore, you are required to display all legally mandated disclosures related to your products, goods, or items. You must also indemnify and defend FarmVox against any claims arising from your non-compliance with laws, including those related to tax obligations or any failure to adhere to required disclosure obligations or privacy policies.</Text>
      <Text style={styles.paragraph}>Items listed on our platform may be subject to export and import restrictions, prohibitions, or costs. You are solely responsible for understanding and adhering to all export and import regulations, licensing requirements, and customs duties that may apply to your listed items and any associated transactions. Should any listed items be confiscated or destroyed by customs or returned, FarmVox will not be liable for any resulting losses, refunds for the item, or shipping costs.</Text>


      <Text style={styles.sectionTitle}>19. Indemnification</Text>
      <Text style={styles.paragraph}>You agree to indemnify and hold harmless FarmVox and its subsidiaries, affiliates, officers, agents, partners, and employees from any claims, demands, or legal fees resulting from your use of the Service or any third-party services accessed via FarmVox. This includes liabilities arising from your connection to the Service, any breach of the Terms, your tax obligations in any jurisdiction, your responsibilities for payment processing and transaction fees including refunds, credits, discounts, or canceled orders, and your compliance with regulatory requirements related to food handling, distribution, delivery, packaging, labeling, and disclosures. Additionally, you are responsible for any claims of death, illness, or other issues allegedly caused by the purchase or consumption of your products, or any violation of another's rights.</Text>

      <Text style={styles.sectionTitle}>20. Legal Disputes</Text>
      <Text style={styles.paragraph}>Please read this section carefully. it affects your rights and will have a substantial impact on how claims you and farmvox have against each other are resolved. In this Legal Disputes Section, the term “related third parties” includes your and FarmVox's respective affiliates, subsidiaries, parent companies, predecessors, successors, assigns, as well as your, FarmVox's, and these entities' respective employees and agents.</Text>
      <Text style={styles.paragraph}>You and FarmVox agree that any claim or dispute at law or equity that has arisen, or may arise, between you and FarmVox (or any related third parties) that relates in any way to or arises out of this or previous versions of this User Agreement, your use of or access to the Services, the actions of FarmVox or its agents, or any products/goods/items or services sold or purchased through the Services, will be resolved in accordance with the provisions set forth in this Legal Disputes Section.</Text>
      <Text style={styles.bulletPoint}>Governing Law and Venue</Text>
      <Text style={styles.paragraph}>You agree that, except to the extent inconsistent with or preempted by federal law, the laws of the State of California, without regard to principles of conflict of laws, will govern this User Agreement and any claim or dispute that has arisen or may arise between you and FarmVox, except as otherwise stated in this User Agreement.</Text>
      <Text style={styles.paragraph}>Any disputes arising out of or relating to these Terms, the Platform, or your use of the Platform shall be resolved exclusively in the state or federal courts located in Santa Clara County, California. You and FarmVox agree to submit to the personal jurisdiction of such courts.</Text>


      <Text style={styles.sectionTitle}>21. Miscellaneous</Text>
      <Text style={styles.paragraph}>Except as specified in this User Agreement, if any part of this agreement is found to be invalid, void, or unenforceable for any reason, that part will be struck out without affecting the validity and enforceability of the remaining provisions. We reserve the right to assign this User Agreement at our discretion and will provide notice of such an assignment.</Text>
      <Text style={styles.paragraph}>The headings in this agreement serve only for reference and do not restrict the scope or extent of each section. Our failure to address a breach by you or others does not waive our right to address subsequent or similar breaches. We do not commit to taking action against all breaches of this User Agreement.</Text>
      <Text style={styles.paragraph}>We may revise this User Agreement at any time by posting the updated terms on our Site and/or App. Changes may include modifications, additions, or the removal of terms. Your continued use of our Services after changes have been posted constitutes your acceptance of the revised terms. Apart from these methods, this User Agreement can only be amended by an authorized FarmVox representative who is expressly committed to making such changes.</Text>
      <Text style={styles.paragraph}>FarmVox retains the right to refuse, alter, or terminate all or any part of our Services and may terminate this User Agreement with any party at any time, for any reason, at our sole discretion, without prior notice.</Text>
      <Text style={styles.paragraph}>If you are using or creating an account on behalf of a business entity, you confirm that you are authorized to act for and bind that entity to this User Agreement. The account is owned and controlled by that business entity. This User Agreement does not create any agency, partnership, joint venture, or employer-employee or franchiser-franchisee relationship.</Text>
      <Text style={styles.paragraph}>This User Agreement, along with all terms and policies posted through our Services, constitutes the full agreement and understanding between you and FarmVox, superseding all prior agreements and understandings.</Text>
      <Text style={styles.paragraph}>The sections titled Content, Disclaimer of Warranties; Limitation of Liability; Release, Indemnification, Legal Disputes, and General will continue to apply even after this User Agreement is terminated.</Text>
      <Text style={styles.paragraph}>Should any part of these Terms be deemed unlawful, void, or unenforceable, that part is severable and does not impact the validity and enforceability of the remaining provisions.</Text>
      
      <Text style={styles.bulletPoint}>California Residents</Text>
      <Text style={styles.paragraph}>In accordance with Cal. Civ. Code §1789.3, California residents may report complaints to the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs by contacting them in writing at 400 R Street, Sacramento, CA 95814, or by telephone at (800) 952-5210.</Text>


      <Text style={styles.sectionTitle}>22. Changes to Terms</Text>
      <Text style={styles.paragraph}>FarmVox reserves the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the Site and App. You are advised to review these Terms periodically.</Text>


      <Text style={styles.sectionTitle}>23. Contact Information</Text>
      <Text style={styles.paragraph}>
        If you have any questions about these Terms, please contact us at support@farmvox.com.
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

export default TermsScreen;
