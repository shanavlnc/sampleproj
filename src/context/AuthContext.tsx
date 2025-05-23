// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalUser {
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: LocalUser | null;
  isLoading: boolean;
  signIn: (email: string, isAdmin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved user on startup
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email: string, isAdmin = false) => {
    const newUser = { email, isAdmin };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);