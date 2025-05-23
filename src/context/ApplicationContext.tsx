import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Application } from '../types';

interface ApplicationContextType {
  pets: Pet[];
  applications: Application[];
  savedPets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  submitApplication: (application: Omit<Application, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  savePet: (pet: Pet) => Promise<void>;
  removeSavedPet: (id: string) => Promise<void>;
  loadData: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType>({
  pets: [],
  applications: [],
  savedPets: [],
  addPet: async () => {},
  updatePet: async () => {},
  deletePet: async () => {},
  submitApplication: async () => {},
  updateApplicationStatus: async () => {},
  savePet: async () => {},
  removeSavedPet: async () => {},
  loadData: async () => {},
});

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedPets, setSavedPets] = useState<Pet[]>([]);

  // Load initial data
  const loadData = async () => {
    try {
      const [petsData, appsData, savedData] = await Promise.all([
        AsyncStorage.getItem('pets'),
        AsyncStorage.getItem('applications'),
        AsyncStorage.getItem('savedPets'),
      ]);

      // Parse pets and convert string dates to Date objects
      const parsedPets = petsData ? JSON.parse(petsData) : [];
      const validatedPets = parsedPets.map((pet: any) => ({
        ...pet,
        createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date(),
        status: ['available', 'adopted'].includes(pet.status) 
          ? pet.status as 'available' | 'adopted'
          : 'available'
      }));
      setPets(validatedPets);
      
      // Parse applications
      const parsedApps = appsData ? JSON.parse(appsData) : [];
      const validatedApps = parsedApps.map((app: any) => ({
        ...app,
        status: ['approved', 'rejected', 'pending'].includes(app.status) 
          ? app.status as 'approved' | 'rejected' | 'pending'
          : 'pending',
        applicationDate: new Date(app.applicationDate),
        reviewedDate: app.reviewedDate ? new Date(app.reviewedDate) : undefined,
        createdAt: app.createdAt ? new Date(app.createdAt) : new Date()
      }));
      setApplications(validatedApps);

      // Parse saved pets
      const parsedSavedPets = savedData ? JSON.parse(savedData) : [];
      const validatedSavedPets = parsedSavedPets.map((pet: any) => ({
        ...pet,
        createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date()
      }));
      setSavedPets(validatedSavedPets);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pet operations
  const addPet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = { 
      ...pet, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))));
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    const updatedPets = pets.map(pet => 
      pet.id === id ? { 
        ...pet, 
        ...updates,
        createdAt: updates.createdAt || pet.createdAt
      } : pet
    );
    setPets(updatedPets);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))));
  };

  const deletePet = async (id: string) => {
    const updatedPets = pets.filter(pet => pet.id !== id);
    setPets(updatedPets);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))));
  };

  // Application operations
  const submitApplication = async (application: Omit<Application, 'id' | 'status' | 'createdAt'>) => {
    const newApp: Application = {
        ...application,
        id: Date.now().toString(),
        status: 'pending',
        applicationDate: new Date(),
        createdAt: new Date(),
        petId: '',
        petName: '',
        applicantName: '',
        applicantEmail: '',
        applicantPhone: ''
    };
    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    await AsyncStorage.setItem('applications', JSON.stringify(updatedApps.map(a => ({
      ...a,
      applicationDate: a.applicationDate.toISOString(),
      reviewedDate: a.reviewedDate?.toISOString(),
      createdAt: a.createdAt.toISOString()
    }))));
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    const updatedApps = applications.map(app => 
      app.id === id ? { 
        ...app, 
        status, 
        reviewedDate: new Date() 
      } : app
    );
    setApplications(updatedApps);
    await AsyncStorage.setItem('applications', JSON.stringify(updatedApps.map(a => ({
      ...a,
      applicationDate: a.applicationDate.toISOString(),
      reviewedDate: a.reviewedDate?.toISOString(),
      createdAt: a.createdAt.toISOString()
    }))));
  };

  // Saved pets operations
  const savePet = async (pet: Pet) => {
    if (!savedPets.some(p => p.id === pet.id)) {
      const updatedSaved = [...savedPets, pet];
      setSavedPets(updatedSaved);
      await AsyncStorage.setItem('savedPets', JSON.stringify(updatedSaved.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString()
      }))));
    }
  };

  const removeSavedPet = async (id: string) => {
    const updatedSaved = savedPets.filter(pet => pet.id !== id);
    setSavedPets(updatedSaved);
    await AsyncStorage.setItem('savedPets', JSON.stringify(updatedSaved.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))));
  };

  return (
    <ApplicationContext.Provider value={{
      pets,
      applications,
      savedPets,
      addPet,
      updatePet,
      deletePet,
      submitApplication,
      updateApplicationStatus,
      savePet,
      removeSavedPet,
      loadData
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => useContext(ApplicationContext);