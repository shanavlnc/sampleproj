import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { theme } from '../constants/colors';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <View style={styles.container}>
      <Image source={pet.imageUrl} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>{pet.breed} • {pet.age} • {pet.gender}</Text>
        <Text style={styles.description}>{pet.description}</Text>
        <Text style={styles.status}>
          {pet.status === 'available' ? '🟢 Available' : '🔴 Adopted'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: theme.textLight,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.textLight,
  },
});

export default PetCard;