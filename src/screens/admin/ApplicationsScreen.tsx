import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Application } from '../../types';

// Mock data - replace with your actual data source
const mockApplications: Application[] = [
  {
      id: '1',
      petId: '1',
      applicantName: 'John Doe',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      contactInfo: ''
  },
  {
      id: '2',
      petId: '2',
      applicantName: 'Jane Smith',
      status: 'approved',
      submittedAt: new Date().toISOString(),
      contactInfo: ''
  }
];

const ApplicationsScreen = () => {
  const { colors } = useTheme(); // Destructure colors from theme

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Adoption Applications</Text>
      
      <FlatList
        data={mockApplications}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.applicantName, { color: colors.text }]}>
              {item.applicantName}
            </Text>
            <Text style={{ color: colors.text }}>
              Status: {item.status}
            </Text>
            <Text style={{ color: colors.text }}>
              Submitted: {new Date(item.submittedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default ApplicationsScreen;