import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pet, UserStackParamList } from '../../types';

// Define navigation prop type
type SavedPetsScreenNavigationProp = NativeStackNavigationProp<UserStackParamList, 'Home'>;

const SavedPetsScreen = () => {
  const [savedPets, setSavedPets] = useState<Pet[]>([]);
  const navigation = useNavigation<SavedPetsScreenNavigationProp>();

  useEffect(() => {
    const loadSavedPets = async () => {
      try {
        const savedPetsData = await AsyncStorage.getItem('savedPets');
        if (savedPetsData) {
          const parsedPets = JSON.parse(savedPetsData) as Pet[];
          setSavedPets(parsedPets);
        }
      } catch (error) {
        console.error('Error loading saved pets:', error);
      }
    };

    loadSavedPets();
  }, []);

  const removePet = async (petId: string) => {
    try {
      const updatedPets = savedPets.filter(pet => pet.id !== petId);
      setSavedPets(updatedPets);
      await AsyncStorage.setItem('savedPets', JSON.stringify(updatedPets));
    } catch (error) {
      console.error('Error removing pet:', error);
    }
  };

  return (
    <View style={styles.container}>
      {savedPets.length > 0 ? (
        <FlatList
          data={savedPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.petItem}
              onPress={() => navigation.navigate('PetDetail', { pet: item })}
            >
              <Image source={item.imageUrl} style={styles.petImage} />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>{item.breed} • {item.age}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removePet(item.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved pets yet</Text>
          <Text style={styles.emptySubText}>Swipe right on pets to save them</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    padding: 15,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  petInfo: {
    flex: 1,
    marginLeft: 15,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  petDetails: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 5,
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 24,
    color: theme.danger,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: 'center',
  },
});

export default SavedPetsScreen;