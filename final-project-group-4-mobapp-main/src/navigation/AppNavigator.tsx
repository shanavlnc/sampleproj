import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/index';
import WelcomeScreen from '../screens/user/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import UserStack  from './UserStack';
import { AdminStack } from './AdminStack';
import Loader  from '../components/Loader';
import { theme } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              headerShown: true,
              title: 'Shelter Login',
              headerStyle: {
                backgroundColor: theme.primary,
              },
              headerTintColor: theme.textInverted,
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="UserStack" component={UserStack} />
        </>
      ) : user.isAdmin ? (
        <Stack.Screen name="AdminStack" component={AdminStack} />
      ) : (
        <Stack.Screen name="UserStack" component={UserStack} />
      )}
    </Stack.Navigator>
  );
}; //

export default AppNavigator;