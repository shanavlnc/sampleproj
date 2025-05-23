import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/index'; // Update this import path as needed
import { placeholderPets } from '../constants/pets';

interface PetContextType {
  pets: Pet[];
  savedPets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  savePet: (pet: Pet) => Promise<void>;
  unsavePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  loading: boolean;
}

const PetContext = createContext<PetContextType>({
  pets: [],
  savedPets: [],
  addPet: async () => {},
  updatePet: async () => {},
  removePet: async () => {},
  savePet: async () => {},
  unsavePet: async () => {},
  getPetById: () => undefined,
  loading: true
});

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [savedPets, setSavedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPets = await AsyncStorage.getItem('pets');
        const storedSavedPets = await AsyncStorage.getItem('savedPets');
        
        const parsedPets = storedPets ? JSON.parse(storedPets) : placeholderPets;
        const parsedSavedPets = storedSavedPets ? JSON.parse(storedSavedPets) : [];
        
        // Convert string dates back to Date objects
        setPets(parsedPets.map((pet: any) => ({
          ...pet,
          createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date()
        })));
        
        setSavedPets(parsedSavedPets.map((pet: any) => ({
          ...pet,
          createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date()
        })));
      } catch (error) {
        console.error('Error loading pet data:', error);
        setPets(placeholderPets.map(pet => ({
          ...pet,
          createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date()
        })));
        setSavedPets([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to AsyncStorage whenever pets change
  useEffect(() => {
    if (!loading) {
      // Convert Date objects to strings for storage
      const petsToStore = pets.map(pet => ({
        ...pet,
        createdAt: pet.createdAt ? pet.createdAt.toISOString() : new Date().toISOString()
      }));
      AsyncStorage.setItem('pets', JSON.stringify(petsToStore));
    }
  }, [pets, loading]);

  // Save to AsyncStorage whenever savedPets change
  useEffect(() => {
    if (!loading) {
      // Convert Date objects to strings for storage
      const savedPetsToStore = savedPets.map(pet => ({
        ...pet,
        createdAt: pet.createdAt ? pet.createdAt.toISOString() : new Date().toISOString()
      }));
      AsyncStorage.setItem('savedPets', JSON.stringify(savedPetsToStore));
    }
  }, [savedPets, loading]);

  const addPet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...pet,
      id: Date.now().toString(),
      createdAt: new Date() // Store as Date object
    };
    setPets(prev => [...prev, newPet]);
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    setPets(prev => 
      prev.map(pet => 
        pet.id === id ? { 
          ...pet, 
          ...updates,
          createdAt: updates.createdAt || pet.createdAt // Preserve existing date if not updated
        } : pet
      )
    );
  };

  const removePet = async (id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
    setSavedPets(prev => prev.filter(pet => pet.id !== id));
  };

  const savePet = async (pet: Pet) => {
    if (!savedPets.some(p => p.id === pet.id)) {
      setSavedPets(prev => [...prev, pet]);
    }
  };

  const unsavePet = async (id: string) => {
    setSavedPets(prev => prev.filter(pet => pet.id !== id));
  };

  const getPetById = (id: string) => {
    return pets.find(pet => pet.id === id);
  };

  return (
    <PetContext.Provider value={{
      pets,
      savedPets,
      addPet,
      updatePet,
      removePet,
      savePet,
      unsavePet,
      getPetById,
      loading
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => useContext(PetContext);