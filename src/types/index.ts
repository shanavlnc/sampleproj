export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'adopted' | 'pending' | 'removed';
  createdAt?: Date;
}

export interface Application {
  id: string;
  petId: string;
  petName: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  birthdate: string;
  occupation: string;
  company?: string;
  socialMedia?: string;
  maritalStatus: string;
  alternateContactName?: string;
  alternateContactRelationship?: string;
  alternateContactPhone?: string;
  alternateContactEmail?: string;
  hasAdoptedBefore: boolean;
  householdMembers: string;
  childrenAges?: string;
  homeType: string;
  hasYard: boolean;
  yardFenced?: boolean;
  hoursAlone: string;
  hasOtherPets: boolean;
  otherPetsInfo?: string;
  hasVet: boolean;
  vetInfo?: string;
  petExperience: string;
  petActivities: string;
  whyAdopt: string;
  agreement: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}