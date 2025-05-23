import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Pet } from '../types';
import { theme } from '../constants/colors';

const { width } = Dimensions.get('window');

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <View style={styles.card}>
      <Image source={pet.imageUrl} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.status}>{pet.status === 'available' ? '🟢 Available' : '🔴 Adopted'}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>{pet.breed}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.age}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.gender}</Text>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {pet.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  infoContainer: {
    padding: 15,
    height: '30%'
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text
  },
  status: {
    fontSize: 14,
    color: theme.textLight
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center'
  },
  detail: {
    marginRight: 5,
    color: theme.textLight,
    fontSize: 14
  },
  separator: {
    marginRight: 5,
    color: theme.textLight
  },
  description: {
    color: theme.text,
    fontSize: 14,
    lineHeight: 20
  }
});

export default PetCard;