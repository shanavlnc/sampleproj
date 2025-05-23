import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/PetCard';

const SavedScreen = () => {
  const theme = useTheme();
  const { pets } = usePets();
  const savedPets = pets.filter(pet => pet.isSaved);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {savedPets.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text }}>No saved pets yet</Text>
        </View>
      ) : (
        <FlatList
          data={savedPets}
          renderItem={({ item }) => <PetCard pet={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

export default SavedScreen;