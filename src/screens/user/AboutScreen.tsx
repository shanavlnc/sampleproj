import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/colors';

const AboutScreen = () => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Our Shelter</Text>
      
      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.text}>
        We are dedicated to rescuing abandoned and abused animals, providing them with medical care,
        rehabilitation, and finding them loving forever homes.
      </Text>
      
      <Text style={styles.sectionTitle}>Adoption Process</Text>
      <Text style={styles.text}>
        1. Browse available pets on our app or visit our shelter{"\n"}
        2. Submit an adoption application{"\n"}
        3. Meet with our adoption counselor{"\n"}
        4. Home visit (if required){"\n"}
        5. Finalize adoption and take your new pet home!
      </Text>
      
      <Text style={styles.sectionTitle}>FAQs</Text>
      <Text style={styles.subSectionTitle}>Can you adopt my pet?</Text>
      <Text style={styles.text}>
        We do NOT adopt owned pets. We already have 300+ shelter animals rescued from cruelty and 
        neglect that are waiting to be adopted.
      </Text>
      
      <Text style={styles.subSectionTitle}>I live abroad. Can I still adopt?</Text>
      <Text style={styles.text}>
        Yes, but special arrangements need to be made for the meet-and-greet. Please contact us to 
        discuss your options.
      </Text>
      
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <TouchableOpacity onPress={() => openLink('mailto:adopt@shelter.org')}>
        <Text style={[styles.text, styles.link]}>Email: adopt@shelter.org</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('tel:+1234567890')}>
        <Text style={[styles.text, styles.link]}>Phone: (123) 456-7890</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://maps.google.com/?q=Shelter+Address')}>
        <Text style={[styles.text, styles.link]}>Address: 123 Rescue St, Pet City</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: theme.primary,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: theme.text,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
    marginBottom: 10,
  },
  link: {
    color: theme.info,
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
});

export default AboutScreen;