import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/colors';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/welcome.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Find Your Perfect Pet Companion</Text>
      <Text style={styles.subtitle}>Adopt, don't shop. Give a shelter pet a loving home.</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('UserStack')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.adminButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.adminButtonText}>Shelter Admin Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: theme.textLight,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  adminButtonText: {
    color: theme.primary,
    fontSize: 16,
  },
});

export default WelcomeScreen;