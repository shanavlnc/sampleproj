import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/colors';
import HomeScreen from '../screens/user/HomeScreen';
import SavedPetsScreen from '../screens/user/SavedPetScreen';
import AboutScreen from '../screens/user/AboutScreen';
import PetDetailScreen from '../screens/user/PetDetailsScreen';
import AdoptionFormScreen from '../screens/user/AdoptionFormScreen';

export type UserStackParamList = {
  Home: undefined;
  PetDetail: { pet: any };
  AdoptionForm: { pet: any };
};

export type UserTabParamList = {
  Browse: undefined;
  Saved: undefined;
  About: undefined;
};

const Tab = createBottomTabNavigator<UserTabParamList>();
const Stack = createNativeStackNavigator<UserStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    <Stack.Screen name="AdoptionForm" component={AdoptionFormScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;

        if (route.name === 'Browse') {
          iconName = focused ? 'paw' : 'paw-outline';
        } else if (route.name === 'Saved') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'About') {
          iconName = focused ? 'information-circle' : 'information-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5
      }
    })}
  >
    <Tab.Screen 
      name="Browse" 
      component={HomeStack} 
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Saved" 
      component={SavedPetsScreen} 
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="About" 
      component={AboutScreen} 
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default UserStack;