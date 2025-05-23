import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../constants/colors';

interface Application {
  id: string;
  fullName: string;
  petName: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt: Date | null;
  submittedAt: Date;
}

const ApprovedApplicationsScreen = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // 1. Get all applications from AsyncStorage
        const applicationsString = await AsyncStorage.getItem('applications');
        const allApplications: Application[] = applicationsString 
          ? JSON.parse(applicationsString) 
          : [];

        // 2. Filter approved applications
        const approvedApps = allApplications.filter(
          app => app.status === 'approved'
        );

        // 3. Convert string dates back to Date objects
        const processedApps = approvedApps.map(app => ({
          ...app,
          reviewedAt: app.reviewedAt ? new Date(app.reviewedAt) : null,
          submittedAt: new Date(app.submittedAt)
        }));

        setApplications(processedApps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const renderItem = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <Text style={styles.petName}>Pet: {item.petName}</Text>
      <Text style={styles.applicantName}>Applicant: {item.fullName}</Text>
      <Text style={styles.date}>
        Approved: {item.reviewedAt?.toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading applications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved Applications</Text>
      
      {applications.length > 0 ? (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No approved applications</Text>
        </View>
      )}
    </View>
  );
};

// Your existing styles remain unchanged
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
  listContent: {
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 5,
  },
  applicantName: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: theme.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.textLight,
  },
});

export default ApprovedApplicationsScreen;