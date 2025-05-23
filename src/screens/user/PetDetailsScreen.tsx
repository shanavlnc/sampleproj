import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { RouteProp } from '@react-navigation/native';

// Define route params type
type PetDetailRouteProp = RouteProp<RootStackParamList, 'PetDetail'>;

// Define navigation prop type
type PetDetailNavigationProp = StackNavigationProp<RootStackParamList, 'PetDetail'>;

const PetDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<PetDetailRouteProp>();
  const { pet } = route.params;
  const navigation = useNavigation<PetDetailNavigationProp>();
  const { user } = useAuth();

  const handleAdopt = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to login to adopt this pet',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('ApplicationForm', { petId: pet.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image 
        source={typeof pet.image === 'string' ? { uri: pet.image } : pet.image} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.primary }]}>{pet.name}</Text>
        <Text style={[styles.text, { color: theme.colors.text }]}>{pet.breed}</Text>
        <Text style={[styles.text, { color: theme.colors.text }]}>{pet.age}</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {pet.description || 'No description available'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleAdopt}
      >
        <Text style={styles.buttonText}>Adopt Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  details: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginTop: 16,
    lineHeight: 24,
  },
  button: {
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PetDetailScreen;