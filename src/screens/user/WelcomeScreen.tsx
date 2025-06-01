import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/welcome.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Find Your Perfect Companion</Text>
        <Text style={styles.subtitle}>
          Adopt a loving pet and give them a forever home
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('UserStack')}
        >
          <Text style={styles.primaryButtonText}>Browse Pets</Text>
          <Ionicons name="paw" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Shelter Login</Text>
          <Ionicons name="log-in" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
}); //
 
export default WelcomeScreen;