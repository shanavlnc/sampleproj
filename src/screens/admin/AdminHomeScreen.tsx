import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AdminStackParamList } from '../../types/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AdminHomeScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  'AdminHome'
>;

const AdminHomeScreen = () => {
  const navigation = useNavigation<AdminHomeScreenNavigationProp>();
  const { logout } = useAuth();

  type MenuItem = {
    id: string;
    title: string;
    icon: 'add-circle-outline' | 'document-text-outline' | 'checkmark-done-outline' | 'paw-outline' | 'trash-outline';
    screen: keyof AdminStackParamList; // Now matches all possible screens
    description: string;
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Add New Pet',
      icon: 'add-circle-outline',
      screen: 'AddPet',
      description: 'Register new pets available for adoption'
    },
    {
      id: '2',
      title: 'Manage Pets',
      icon: 'paw-outline',
      screen: 'PetManagement',
      description: 'View, edit or remove pets from the system'
    },
    {
      id: '3',
      title: 'Review Applications',
      icon: 'document-text-outline',
      screen: 'ReviewApplications',
      description: 'Process pending adoption applications'
    },
    {
      id: '4',
      title: 'Approved Applications',
      icon: 'checkmark-done-outline',
      screen: 'ApprovedApplications',
      description: 'View approved adoption records'
    },
    {
      id: '5',
      title: 'Removed Pets Archive',
      icon: 'trash-outline',
      screen: 'RemovedPets',
      description: 'View archive of removed pets'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shelter Admin Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={theme.danger} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color={theme.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: theme.textLight,
  },
});

export default AdminHomeScreen;