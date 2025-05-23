import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Application {
  id: string;
  fullName: string;
  petName: string;
  status: string;
  createdAt: any;
}

const ReviewApplicationsScreen = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, 'applications'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const apps: Application[] = [];
        querySnapshot.forEach((doc) => {
          apps.push({ id: doc.id, ...doc.data() } as Application);
        });
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDecision = async (appId: string, decision: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: decision,
        reviewedAt: new Date(),
      });
      setApplications(applications.filter(app => app.id !== appId));
      Alert.alert('Success', `Application ${decision}`);
    } catch (error) {
      console.error('Error updating application:', error);
      Alert.alert('Error', 'Failed to update application');
    }
  };

  const renderItem = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <Text style={styles.petName}>Pet: {item.petName}</Text>
      <Text style={styles.applicantName}>Applicant: {item.fullName}</Text>
      <Text style={styles.date}>
        Applied: {item.createdAt?.toDate()?.toLocaleDateString()}
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.decisionButton, styles.rejectButton]}
          onPress={() => handleDecision(item.id, 'rejected')}
        >
          <Ionicons name="close" size={20} color="white" />
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.decisionButton, styles.approveButton]}
          onPress={() => handleDecision(item.id, 'approved')}
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
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
      <Text style={styles.title}>Pending Applications</Text>
      
      {applications.length > 0 ? (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending applications</Text>
        </View>
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
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  decisionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: theme.danger,
  },
  approveButton: {
    backgroundColor: theme.success,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
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

export default ReviewApplicationsScreen;