import { ReactNode } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageRequireSource } from 'react-native';

// Core Data Types
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  createdAt: Date;
  status: 'available' | 'pending' | 'adopted';
  adoptedBy?: string; // ID of the user who adopted the pet
  adoptedAt?: Date;
  gender: Gender;
  size?: PetSize;
  temperament?: Temperament[];
  imageUrl: string | ImageRequireSource;
  updatedAt?: Date;
}
//
export interface Application {
  id: string;
  petId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  reviewedDate?: Date;
  petName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  address: string;
  occupation: string;
  hasExperience: boolean;
  homeType: string;
  householdMembers: string;
  hoursAlone: string;
  petExperience: string;
  whyAdopt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  UserStack: undefined;
  AdminStack: undefined;
};

export type UserStackParamList = {
  Home: undefined;
  PetDetail: { pet: Pet; fromScreen?: 'Browse' | 'Saved' };
  AdoptionForm: { pet: Pet };
  SavedPets: undefined;
  About: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  PetManagement: undefined;
  AddPet: { pet?: Pet };
  ApplicationReview: undefined;
  Settings: undefined;
};

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

export interface ApplicationContextType {
  pets: Pet[];
  applications: Application[];
  savedPets: Pet[];
  isLoading: boolean;
  error: string | null;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  submitApplication: (application: Omit<Application, 'id' | 'status' | 'applicationDate'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  toggleSavedPet: (petId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Option Types (from your pets-data.ts)
export type PetSize = 'small' | 'medium' | 'large';
export type Temperament = 
  | 'friendly' | 'shy' | 'energetic' | 'calm' 
  | 'playful' | 'independent' | 'affectionate'
  | 'good with kids' | 'good with pets' | 'house-trained'
  | 'curious' | 'vocal' | 'gentle' | 'protective' 
  | 'intelligent' | 'loyal'; 
export type Species = 'Dog' | 'Cat';
export type Gender = 'Male' | 'Female' | 'Unknown';
export type Status = 'available' | 'adopted';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type UserTabParamList = {
  Browse: undefined;
  Saved: undefined;
  About: undefined;
};

// Utility Types
export type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
};

// React Native Image Type
type ImageSourcePropType = 
  | { uri: string } 
  | number 
  | { uri: string }[] 
  | number[];