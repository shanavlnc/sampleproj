import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../constants/colors';
import { AdminStackParamList } from '../types/index';
import AdminDashboard from "../screens/admin/AdminDashboard";
import PetManagementScreen from '../screens/admin/PetManagementScreen';
import ApplicationReviewScreen from '../screens/admin/ApplicationReviewScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.textInverted,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      }, 
      contentStyle: {
        backgroundColor: theme.background,
      },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboard}
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen
      name="PetManagement"
      component={PetManagementScreen}
      options={{ title: 'Manage Pets' }}
    />
    <Stack.Screen
      name="ApplicationReview"
      component={ApplicationReviewScreen}
      options={{ title: 'Applications' }}
    />
  </Stack.Navigator>
); //