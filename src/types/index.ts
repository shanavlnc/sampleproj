import { ReactNode } from 'react'; // Added ReactNode import

// Pet and Application types
export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: any; // Can be require(local) or {uri: remote}
  status: 'available' | 'adopted';
  createdAt: Date;
}

export interface Application {
  fullName: ReactNode;
  id: string;
  petId: string;
  petName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
  reviewedDate?: Date;
  address?: string;
  occupation?: string;
  hasExperience?: boolean;
  homeType?: string;
  createdAt: Date;
}

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  UserStack: undefined;
  AdminStack: undefined;
  Home: undefined;
  PetDetail: { pet: Pet };
};

export type AdminStackParamList = {
  AdminHome: undefined;
  AddPet: undefined;
  ReviewApplications: undefined;
  ApprovedApplications: undefined;
};

export type UserStackParamList = {
  Home: undefined;
  PetDetail: { pet: Pet };
  AdoptionForm: { pet: Pet };
};

export type UserTabParamList = {
  Browse: undefined;
  Saved: undefined;
  About: undefined;
};

// Context types
export interface AuthContextType {
  user: { email: string; isAdmin: boolean } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Additional utility types
export type ScreenNavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
};

export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
};