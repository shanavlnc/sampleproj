import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApplication } from '../../context/ApplicationContext';

const ReviewApplicationsScreen = () => {
  const { applications, updateApplicationStatus } = useApplication();
  const [pendingApps, setPendingApps] = useState([]);

  useEffect(() => {
    setPendingApps(applications.filter(app => app.status === 'pending'));
  }, [applications]);

  const handleDecision = (appId: string, decision: 'approved' | 'rejected') => {
    updateApplicationStatus(appId, decision);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Applications</Text>
      
      {pendingApps.length > 0 ? (
        <FlatList
          data={pendingApps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.applicationCard}>
              <Text style={styles.petName}>Pet: {item.petName}</Text>
              <Text style={styles.applicantName}>Applicant: {item.fullName}</Text>
              
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
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No pending applications</Text>
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
    marginBottom: 15,
    color: theme.text,
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
  emptyText: {
    textAlign: 'center',
    color: theme.textLight,
  },
});

export default ReviewApplicationsScreen;