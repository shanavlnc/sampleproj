import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// User and Data Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  image: string | { uri: string };
  status: 'available' | 'pending' | 'adopted';
  description?: string;
  isSaved: boolean;
}

export interface Application {
  id: string;
  petId: string;
  applicantName: string;
  contactInfo: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  error: string;
  success: string;
}

// Navigation Types
export type RootStackParamList = {
  // Auth Screens
  Login: undefined;
  Register: undefined;
  
  // User Screens
  Welcome: undefined;
  Home: undefined;
  PetDetail: { pet: Pet };
  Saved: undefined;
  ApplicationForm: { petId: string };
  
  // Admin Screens
  AdminDashboard: undefined;
  ManagePets: undefined;
  Applications: undefined;
  PetForm: { pet?: Pet }; // Optional pet for add/edit
};

// Screen-specific navigation props
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type PetDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PetDetail'>;
export type PetDetailScreenRouteProp = RouteProp<RootStackParamList, 'PetDetail'>;
export type AdminDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;
export type ManagePetsNavigationProp = StackNavigationProp<RootStackParamList, 'ManagePets'>;
export type ApplicationsNavigationProp = StackNavigationProp<RootStackParamList, 'Applications'>;
export type PetFormNavigationProp = StackNavigationProp<RootStackParamList, 'PetForm'>;
export type PetFormRouteProp = RouteProp<RootStackParamList, 'PetForm'>;

// If you need a default export for backward compatibility, you can do:
// export default {}; // Empty object or whatever makes sense for your use case