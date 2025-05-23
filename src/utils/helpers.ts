import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Application } from '../types';

// Pet Storage Helpers
export const savePet = async (pet: Pet): Promise<void> => {
  try {
    const pets = await getPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
    
    if (existingIndex >= 0) {
      pets[existingIndex] = pet; // Update existing
    } else {
      pets.push(pet); // Add new
    }

    await AsyncStorage.setItem('pets', JSON.stringify(pets));
  } catch (error) {
    console.error('Error saving pet:', error);
    throw error;
  }
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const petsJson = await AsyncStorage.getItem('pets');
    return petsJson ? JSON.parse(petsJson) : [];
  } catch (error) {
    console.error('Error getting pets:', error);
    return [];
  }
};

export const deletePet = async (id: string): Promise<void> => {
  try {
    const pets = await getPets();
    const updatedPets = pets.filter(pet => pet.id !== id);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};

// Application Storage Helpers
export const saveApplication = async (app: Application): Promise<void> => {
  try {
    const apps = await getApplications();
    apps.push(app);
    await AsyncStorage.setItem('applications', JSON.stringify(apps));
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const getApplications = async (): Promise<Application[]> => {
  try {
    const appsJson = await AsyncStorage.getItem('applications');
    return appsJson ? JSON.parse(appsJson) : [];
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
};

export const updateApplicationStatus = async (
  id: string, 
  status: 'approved' | 'rejected'
): Promise<void> => {
  try {
    const apps = await getApplications();
    const appIndex = apps.findIndex(app => app.id === id);
    
    if (appIndex >= 0) {
      apps[appIndex].status = status;
      apps[appIndex].reviewedDate = new Date();
      await AsyncStorage.setItem('applications', JSON.stringify(apps));
    }
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

// Saved Pets Helpers
export const savePetToFavorites = async (petId: string): Promise<void> => {
  try {
    const favorites = await getFavoritePets();
    if (!favorites.includes(petId)) {
      favorites.push(petId);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removePetFromFavorites = async (petId: string): Promise<void> => {
  try {
    const favorites = await getFavoritePets();
    const updated = favorites.filter(id => id !== petId);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getFavoritePets = async (): Promise<string[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Form Validation Helpers
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

// Date Formatting
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};