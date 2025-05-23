import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import { AuthProvider } from './src/context/AuthContext';
import { ApplicationProvider } from './src/context/ApplicationContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/colors';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ApplicationProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </ApplicationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}