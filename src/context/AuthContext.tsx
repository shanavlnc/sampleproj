import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication with proper role typing
    const mockUser: User = {
      id: Math.random().toString(),
      email,
      name: email.split('@')[0],
      role: email === 'admin@adoptpaw.com' ? 'admin' : 'user' // Explicitly typed
    };
    await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    const newUser: User = {
      id: Math.random().toString(),
      email: data.email,
      name: data.name,
      role: 'user' // All new registrations are regular users
    };
    await AsyncStorage.setItem('@user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);