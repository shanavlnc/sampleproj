import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, Linking, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/colors';

const AboutScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }; //

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.title}>About Our Shelter</Text>

        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.text}>
          We are dedicated to rescuing abandoned and abused animals, providing them with medical care,
          rehabilitation, and finding them loving forever homes through responsible adoption practices.
        </Text> 

        <Text style={styles.sectionTitle}>Adoption Process</Text>
        <Text style={styles.listItem}>1. Browse available pets</Text>
        <Text style={styles.listItem}>2. Submit an application</Text>
        <Text style={styles.listItem}>3. Meet with an adoption counselor</Text>
        <Text style={styles.listItem}>4. Home visit (if required)</Text>
        <Text style={styles.listItem}>5. Finalize adoption</Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Email: </Text>
          <TouchableOpacity onPress={() => openLink('mailto:pawsorgph@gmail.com')}>
            <Text style={styles.link}>pawsorgph@gmail.com</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Phone: </Text>
          <TouchableOpacity onPress={() => openLink('tel:(02) 425-1839')}>
            <Text style={styles.link}>(02) 425-1839</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Address: </Text>
          <TouchableOpacity onPress={() => openLink('https://maps.app.goo.gl/wM6sQq84C9E2GozA9')}>
            <Text style={styles.link}>Aurora Blvd., Quezon City.</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 0,
  },
  content: {
    padding: 20,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 5,
    marginLeft: 15,
  },
  link: {
    fontSize: 16,
    color: theme.info,
    textDecorationLine: 'underline',
    flex: 1,
  },
  footer: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 20,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 16,
    color: theme.text,
  },
});

export default AboutScreen;