import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../../constants/colors';
import { useApplication } from '../../context/ApplicationContext';

const ApprovedApplicationsScreen = () => {
  const { applications } = useApplication();
  const approvedApps = applications.filter(app => app.status === 'approved');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved Applications</Text>
      
      {approvedApps.length > 0 ? (
        <FlatList
          data={approvedApps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.applicationCard}>
              <Text style={styles.petName}>Pet: {item.petName}</Text>
              <Text style={styles.applicantName}>Applicant: {item.fullName}</Text>
              <Text style={styles.status}>Status: Approved</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No approved applications</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.text,
  },
  applicationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.text,
  },
  applicantName: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text,
  },
  status: {
    fontSize: 16,
    color: theme.success,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textLight,
  },
});

export default ApprovedApplicationsScreen;