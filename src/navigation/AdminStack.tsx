import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../constants/colors';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddPetScreen from '../screens/admin/AddPetScreen';
import ReviewApplicationsScreen from '../screens/admin/ReviewApplicationsScreen';
import ApprovedApplicationsScreen from '../screens/admin/ApprovedApplicationsScreen';
import PetManagementScreen from '../screens/admin/PetManagementScreen';

export type AdminStackParamList = {
  AdminHome: undefined;
  AddPet: undefined;
  ReviewApplications: undefined;
  ApprovedApplications: undefined;
  PetManagement: undefined; // Add this line
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => (
  <Stack.Navigator
    id="AdminStack"
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: '',
    }}
  >
    <Stack.Screen 
      name="AdminHome" 
      component={AdminHomeScreen} 
      options={{ title: 'Admin Dashboard' }} 
    />
    <Stack.Screen 
      name="AddPet" 
      component={AddPetScreen}
      options={{ title: 'Add New Pet' }}
    />
    <Stack.Screen 
      name="ReviewApplications" 
      component={ReviewApplicationsScreen}
      options={{ title: 'Review Applications' }}
    />
    <Stack.Screen 
      name="ApprovedApplications" 
      component={ApprovedApplicationsScreen}
      options={{ title: 'Approved Applications' }}
    />
    <Stack.Screen 
      name="PetManagement" 
      component={PetManagementScreen}
      options={{ title: 'Manage Pets' }}
    />
  </Stack.Navigator>
);

export default AdminStack;