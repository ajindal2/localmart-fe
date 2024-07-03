import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Us</Text>

      <Text style={styles.paragraph}>
        Hello! My name is Aanchal - a mom, a software engineer, and a passionate locavore. One of my favorite activities is taking walks with my family around our neighborhood. During these walks, I often notice many fruit trees with ripe fruits that sadly go to waste, rotting on the ground.
      </Text>

      <Text style={styles.paragraph}>
        This repeated sight sparked an idea in me. I believe we can create a solution together that not only prevents this waste but also strengthens our community bonds.
      </Text>

      <Text style={styles.paragraph}>
        This belief led to the creation of FarmVox to connect neighbors and create a platform where we can share our local produce.
      </Text>

      <Text style={styles.paragraph}>
        I would love to know your ideas and feedback. Please contact me anytime at <Text style={styles.email}>support@farmvox.com</Text>.
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
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  email: {
    color: 'blue',
  },
});

export default AboutScreen;
