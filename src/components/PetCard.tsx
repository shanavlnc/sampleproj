import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { useTheme } from '../context/ThemeContext'; // This import should now work

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onPress }) => {
  const theme = useTheme(); // Now properly imported

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <Image 
        source={typeof pet.image === 'string' ? { uri: pet.image } : pet.image}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.primary }]}>{pet.name}</Text>
        <Text style={[styles.text, { color: theme.colors.text }]}>{pet.breed}, {pet.age}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default PetCard;