import React, { createContext, useContext } from 'react';
import { DefaultTheme } from 'styled-components';

// 1. Extend the DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      card: string;
      border: string;
      error: string;
      success: string;
    };
  }
}

// 2. Create your theme object with proper typing
const lightTheme: DefaultTheme = {
  colors: {
    primary: '#FF7D40',
    secondary: '#4ECDC4',
    background: '#FFFFFF',
    text: '#333333',
    card: '#F5F5F5',
    border: '#E0E0E0',
    error: '#FF5252',
    success: '#4CAF50',
  },
};

// 3. Create the context
const ThemeContext = createContext<DefaultTheme>(lightTheme);

// 4. Create the provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Create the custom hook
export const useTheme = () => useContext(ThemeContext);