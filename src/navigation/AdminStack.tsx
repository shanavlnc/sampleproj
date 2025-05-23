import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../constants/colors';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AddPetScreen from '../screens/admin/AddPetScreen';
import ReviewApplicationsScreen from '../screens/admin/ReviewApplicationsScreen';
import ApprovedApplicationsScreen from '../screens/admin/ApprovedApplicationsScreen';

const Stack = createNativeStackNavigator();

const AdminStack = () => (
  <Stack.Navigator
    id={undefined}  // Explicitly set as undefined
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
  </Stack.Navigator>
);

export default AdminStack;