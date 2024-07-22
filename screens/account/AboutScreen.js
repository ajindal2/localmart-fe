import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hi, I'm Aanchal <Text style={styles.wave}>👋</Text></Text>

      <Text style={styles.description}>
        I'm a mom, a software engineer, and a passionate locavore. One of my favorite activities is taking walks with my family around our neighborhood. During these walks, I often notice many fruit trees with ripe fruits that sadly go to waste, rotting on the ground.
      </Text>
      <Text style={styles.description}>
        This repeated sight sparked an idea in me. I believe we can create a solution together that not only prevents this waste but also strengthens our community bonds and promotes healthy eating.
      </Text>
      <Text style={styles.description}>
        This belief led to the creation of FarmVox to connect neighbors and create a platform where we can share our local produce.
      </Text>
      <Text style={styles.contact}>
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
    color: '#f77979',
    marginBottom: 10,
  },
  wave: {
    fontSize: 24,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    lineHeight: 24,
  },
  contact: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  email: {
    color: '#f77979',
  },
});

export default AboutScreen;
