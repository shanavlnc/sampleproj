import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/colors';
import { UserStackParamList, UserTabParamList } from '../types/index';
import HomeScreen from '../screens/user/HomeScreen';
import SavedPetsScreen from '../screens/user/SavedPetScreen';
import AboutScreen from '../screens/user/AboutScreen';
import PetDetailScreen from '../screens/user/PetDetailsScreen';
import AdoptionFormScreen from '../screens/user/AdoptionFormScreen';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createStackNavigator<UserStackParamList>();

const HomeStack = () => (
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
      cardStyle: { backgroundColor: theme.background },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ 
        title: 'Browse Pets',
        headerShown: true,
      }}
    />
    <Stack.Screen 
      name="PetDetail" 
      component={PetDetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AdoptionForm" 
      component={AdoptionFormScreen}
      options={{
        headerShown: true,
        title: 'Adoption Application',
      }}
    />
  </Stack.Navigator>
);

const SavedStack = () => (
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
      cardStyle: { backgroundColor: theme.background },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen 
      name="SavedPets" 
      component={SavedPetsScreen}
      options={{ 
        title: 'Saved Pets',
        headerLeft: () => null
      }}
    />
    <Stack.Screen 
      name="PetDetail" 
      component={PetDetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AdoptionForm" 
      component={AdoptionFormScreen}
      options={{
        headerShown: true,
        title: 'Adoption Application',
      }}
    />
  </Stack.Navigator>
); //

const UserStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Browse') {
          iconName = focused ? 'paw' : 'paw-outline';
        } else if (route.name === 'Saved') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else {
          iconName = focused ? 'information-circle' : 'information-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textLight,
      tabBarStyle: {
        backgroundColor: theme.cardBackground,
        borderTopWidth: 0,
        paddingBottom: 4,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 4,
      },
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.textInverted,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
      headerShadowVisible: false,
    })}
  >
    <Tab.Screen 
      name="Browse" 
      component={HomeStack} 
      options={{ 
        headerShown: false
      }}
    />
    <Tab.Screen 
      name="Saved" 
      component={SavedStack} 
      options={{ 
        headerShown: false
      }}
    />
    <Tab.Screen 
      name="About" 
      component={AboutScreen} 
      options={{ 
        title: 'About Us',
      }}
    />
  </Tab.Navigator>
);

export default UserStack;