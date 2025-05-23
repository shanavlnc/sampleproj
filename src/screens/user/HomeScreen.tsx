import React from 'react';
import { View, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/PetCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

// Define the navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const theme = useTheme();
  const { pets } = usePets();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={pets.filter(pet => pet.status === 'available')}
        renderItem={({ item }) => (
          <PetCard 
            pet={item} 
            onPress={() => navigation.navigate('PetDetail', { pet: item })}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default HomeScreen;