import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';

// Date formatting
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Storage operations for saved pets
export const savePetToStorage = async (pet: Pet): Promise<void> => {
  try {
    const savedPets = await getSavedPetsFromStorage();
    if (!savedPets.some((p) => p.id === pet.id)) {
      savedPets.push(pet);
      await AsyncStorage.setItem('savedPets', JSON.stringify(savedPets));
    }
  } catch (error) {
    console.error('Error saving pet:', error);
    throw error;
  }
};

export const removePetFromStorage = async (petId: string): Promise<void> => {
  try {
    const savedPets = await getSavedPetsFromStorage();
    const updatedPets = savedPets.filter((p) => p.id !== petId);
    await AsyncStorage.setItem('savedPets', JSON.stringify(updatedPets));
  } catch (error) {
    console.error('Error removing pet:', error);
    throw error;
  }
};

export const getSavedPetsFromStorage = async (): Promise<Pet[]> => {
  try {
    const savedPets = await AsyncStorage.getItem('savedPets');
    return savedPets ? JSON.parse(savedPets) : [];
  } catch (error) {
    console.error('Error getting saved pets:', error);
    throw error;
  }
};

// Form validation helpers
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

// String formatting
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? '(' + match[1] + ') ' + match[2] + '-' + match[3] : phone;
};

// Age calculation
export const calculateAge = (birthdate: string): number => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Image handling
export const getImageSize = async (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    Image.getSize(uri, (width, height) => {
      resolve({ width, height });
    }, (error) => {
      console.error('Error getting image size:', error);
      resolve({ width: 0, height: 0 });
    });
  });
};