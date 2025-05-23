import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApplication } from './ApplicationContext';

interface AuthContextType {
  user: { email: string; isAdmin: boolean } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loadData } = useApplication();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Simple admin check - in real app, use proper authentication
    const isAdmin = email.endsWith('@shelter.com');
    if (isAdmin || password === 'demo123') {
      const userData = { email, isAdmin };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      await loadData(); // Load application data after login
      return true;
    }
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);