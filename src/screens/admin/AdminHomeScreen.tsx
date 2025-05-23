import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// Define valid icon names as a type
type IconName = 
  | 'add-circle-outline'
  | 'document-text-outline'
  | 'checkmark-done-outline'
  | 'log-out-outline'
  | 'chevron-forward';

interface MenuItem {
  id: string;
  title: string;
  icon: IconName;
  screen: string;
}

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Add New Pet',
      icon: 'add-circle-outline',
      screen: 'AddPet',
    },
    {
      id: '2',
      title: 'Review Applications',
      icon: 'document-text-outline',
      screen: 'ReviewApplications',
    },
    {
      id: '3',
      title: 'Approved Applications',
      icon: 'checkmark-done-outline',
      screen: 'ApprovedApplications',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shelter Admin Dashboard</Text>
        <TouchableOpacity onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color={theme.danger} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Ionicons name={item.icon} size={24} color={theme.primary} />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: theme.text,
  },
});

export default AdminHomeScreen;