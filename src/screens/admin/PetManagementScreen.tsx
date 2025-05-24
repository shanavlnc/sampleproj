import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePets } from '../../context/PetContext';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/colors';

const PetManagementScreen = () => {
  const { pets, removePet } = usePets(); // Changed from deletePet to removePet if that's what your context uses
  const [filter, setFilter] = useState<'all' | 'available' | 'adopted'>('all');

  const filteredPets = pets.filter(pet => {
    if (filter === 'all') return true;
    return pet.status === filter;
  });

  const confirmDelete = (petId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this pet?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removePet(petId), // Make sure this matches your context method name
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text>All Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'available' && styles.activeFilter]}
          onPress={() => setFilter('available')}
        >
          <Text>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'adopted' && styles.activeFilter]}
          onPress={() => setFilter('adopted')}
        >
          <Text>Adopted</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petCard}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text>{item.breed} • {item.age} • {item.gender}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Added: {new Date(item.createdAt).toLocaleDateString()}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Ionicons name="trash" size={20} color={theme.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeFilter: {
    backgroundColor: '#FFB6B6', // Updated color
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  petCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteButton: {
    padding: 5,
  },
});

export default PetManagementScreen;