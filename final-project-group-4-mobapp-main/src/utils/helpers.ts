import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Application } from '../types';

// Storage Keys
const PETS_KEY = 'pets';
const APPLICATIONS_KEY = 'applications';
const SAVED_PETS_KEY = 'savedPets';

// Pet Helpers
export const savePets = async (pets: Pet[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
  } catch (error) {
    console.error('Error saving pets:', error);
    throw error;
  }
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const pets = await AsyncStorage.getItem(PETS_KEY);
    return pets ? JSON.parse(pets) : [];
  } catch (error) {
    console.error('Error getting pets:', error);
    return [];
  }
};

// Application Helpers
export const saveApplications = async (apps: Application[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (error) {
    console.error('Error saving applications:', error);
    throw error;
  }
};

export const getApplications = async (): Promise<Application[]> => {
  try {
    const apps = await AsyncStorage.getItem(APPLICATIONS_KEY);
    return apps ? JSON.parse(apps) : [];
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
};

// Saved Pets Helpers
export const savePetIds = async (petIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SAVED_PETS_KEY, JSON.stringify(petIds));
  } catch (error) {
    console.error('Error saving pet IDs:', error);
    throw error;
  }
};

export const getSavedPetIds = async (): Promise<string[]> => {
  try {
    const petIds = await AsyncStorage.getItem(SAVED_PETS_KEY);
    return petIds ? JSON.parse(petIds) : [];
  } catch (error) {
    console.error('Error getting saved pet IDs:', error);
    return [];
  }
};

// Form Validation
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
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Data Migration (for future updates)
export const migrateData = async (): Promise<void> => {
  try {
    // Example migration logic
    const oldPets = await AsyncStorage.getItem('old_pets_key');
    if (oldPets) {
      const parsed = JSON.parse(oldPets);
      // Transform data if needed
      await savePets(parsed);
      await AsyncStorage.removeItem('old_pets_key');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } //
};