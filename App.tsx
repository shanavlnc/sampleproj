import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { PetProvider } from './src/context/PetContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PetProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}