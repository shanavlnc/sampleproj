import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pet, UserStackParamList } from '../../types';

// Define navigation prop type
type PetDetailScreenNavigationProp = NativeStackNavigationProp<UserStackParamList, 'PetDetail'>;

const PetDetailScreen = () => {
  const navigation = useNavigation<PetDetailScreenNavigationProp>();
  const route = useRoute();
  const { pet } = route.params as { pet: Pet }; // Use your Pet interface type

  const handleAdoptPress = async () => {
    try {
      const savedPets = await AsyncStorage.getItem('savedPets');
      let updatedSavedPets = savedPets ? JSON.parse(savedPets) : [];
      
      if (!updatedSavedPets.some((p: Pet) => p.id === pet.id)) {
        updatedSavedPets.push(pet);
        await AsyncStorage.setItem('savedPets', JSON.stringify(updatedSavedPets));
      }
      navigation.navigate('AdoptionForm', { pet });
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Error', 'Failed to save pet. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={pet.imageUrl} style={styles.image} resizeMode="cover" />
      
      <View style={styles.detailsContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.status}>
            {pet.status === 'available' ? '🟢 Available' : '🔴 Adopted'}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>{pet.breed}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.age}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.gender}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>About {pet.name}</Text>
        <Text style={styles.description}>{pet.description}</Text>
        
        {pet.status === 'available' && (
          <TouchableOpacity 
            style={styles.adoptButton}
            onPress={handleAdoptPress}
          >
            <Text style={styles.adoptButtonText}>Adopt {pet.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 350,
  },
  detailsContainer: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  status: {
    fontSize: 16,
    color: theme.textLight,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  detail: {
    marginRight: 8,
    color: theme.textLight,
    fontSize: 16,
  },
  separator: {
    marginRight: 8,
    color: theme.textLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: theme.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
    marginBottom: 30,
  },
  adoptButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  adoptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PetDetailScreen;