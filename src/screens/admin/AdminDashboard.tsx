import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminDashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation<AdminDashboardNavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Admin Dashboard</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('ManagePets')}
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>Manage Pets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('Applications')}
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>View Applications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdminDashboard;