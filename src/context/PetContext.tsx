import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
}

const PetContext = createContext<PetContextType>(null!);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      const storedPets = await AsyncStorage.getItem('@pets');
      setPets(storedPets ? JSON.parse(storedPets) : []);
      setLoading(false);
    };
    loadPets();
  }, []);

  const savePets = async (newPets: Pet[]) => {
    await AsyncStorage.setItem('@pets', JSON.stringify(newPets));
    setPets(newPets);
  };

  const addPet = async (pet: Omit<Pet, 'id'>) => {
    const newPet = { ...pet, id: Math.random().toString() };
    await savePets([...pets, newPet]);
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    const updatedPets = pets.map(pet => 
      pet.id === id ? { ...pet, ...updates } : pet
    );
    await savePets(updatedPets);
  };

  const deletePet = async (id: string) => {
    await savePets(pets.filter(pet => pet.id !== id));
  };

  return (
    <PetContext.Provider value={{ pets, loading, addPet, updatePet, deletePet }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => useContext(PetContext);