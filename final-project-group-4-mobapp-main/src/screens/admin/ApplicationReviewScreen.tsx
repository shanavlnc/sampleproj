import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert, RefreshControl, Modal, ScrollView } from 'react-native';
import { useApplication } from '../../context/ApplicationContext';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ApplicationReviewScreen = () => {
  const { applications, updateApplicationStatus, refreshData } = useApplication();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = applications.filter(app => app.status === filter);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }; //

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${status} this application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            try {
              await updateApplicationStatus(id, status);
            } catch (error) {
              Alert.alert('Error', 'Failed to update application');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>Pending</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {applications.filter(a => a.status === 'pending').length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'approved' && styles.activeFilter]}
          onPress={() => setFilter('approved')}
        >
          <Text style={[styles.filterText, filter === 'approved' && styles.activeFilterText]}>Approved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'rejected' && styles.activeFilter]}
          onPress={() => setFilter('rejected')}
        >
          <Text style={[styles.filterText, filter === 'rejected' && styles.activeFilterText]}>Rejected</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setSelectedApp(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.petName}>{item.petName}</Text>
              <Text style={styles.applicantName}>{item.applicantName}</Text>
            </View>
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="mail" size={16} color={theme.textLight} />
                <Text style={styles.detailText}>{item.applicantEmail}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color={theme.textLight} />
                <Text style={styles.detailText}>{item.applicantPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color={theme.textLight} />
                <Text style={styles.detailText}>
                  Applied: {new Date(item.applicationDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="home" size={16} color={theme.textLight} />
                <Text style={styles.detailText}>Home Type: {item.homeType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color={theme.textLight} />
                <Text style={styles.detailText}>Occupation: {item.occupation}</Text>
              </View>
            </View>

            {item.status === 'pending' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleStatusChange(item.id, 'approved')}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleStatusChange(item.id, 'rejected')}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}

            {item.status === 'approved' && (
              <View style={styles.statusBadge}>
                <Text style={styles.approvedText}>APPROVED</Text>
              </View>
            )}

            {item.status === 'rejected' && (
              <View style={[styles.statusBadge, styles.rejectedBadge]}>
                <Text style={styles.rejectedText}>REJECTED</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={50} color={theme.textLight} />
            <Text style={styles.emptyText}>No {filter} applications</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {selectedApp && (
        <Modal
          visible={!!selectedApp}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedApp(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Application Details</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedApp(null)}
                >
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Pet Information</Text>
                  <Text style={styles.modalText}>Name: {selectedApp.petName}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Applicant Information</Text>
                  <Text style={styles.modalText}>Name: {selectedApp.applicantName}</Text>
                  <Text style={styles.modalText}>Email: {selectedApp.applicantEmail}</Text>
                  <Text style={styles.modalText}>Phone: {selectedApp.applicantPhone}</Text>
                  <Text style={styles.modalText}>Address: {selectedApp.address}</Text>
                  <Text style={styles.modalText}>Occupation: {selectedApp.occupation}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Living Situation</Text>
                  <Text style={styles.modalText}>Home Type: {selectedApp.homeType}</Text>
                  <Text style={styles.modalText}>Hours Alone: {selectedApp.hoursAlone}</Text>
                  <Text style={styles.modalText}>Household: {selectedApp.householdMembers}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Experience & Motivation</Text>
                  <Text style={styles.modalText}>Pet Experience: {selectedApp.petExperience}</Text>
                  <Text style={styles.modalText}>Why Adopt: {selectedApp.whyAdopt}</Text>
                </View>

                {selectedApp.status === 'pending' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton, styles.modalButton]}
                      onPress={() => {
                        handleStatusChange(selectedApp.id, 'approved');
                        setSelectedApp(null);
                      }}
                    >
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton, styles.modalButton]}
                      onPress={() => {
                        handleStatusChange(selectedApp.id, 'rejected');
                        setSelectedApp(null);
                      }}
                    >
                      <Ionicons name="close" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}; //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: theme.cardBackground,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: theme.primary,
  },
  filterText: {
    color: theme.text,
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: 'white',
  },
  badge: {
    backgroundColor: theme.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    backgroundColor: theme.background,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  applicantName: {
    fontSize: 16,
    color: theme.textLight,
  },
  details: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    color: theme.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: theme.success,
  },
  rejectButton: {
    backgroundColor: theme.danger,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: theme.success,
  },
  rejectedBadge: {
    backgroundColor: theme.danger,
  },
  approvedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rejectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.background,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textLight,
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    padding: 15,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 20,
  },
  modalButton: {
    flex: 0.48,
  },
});

export default ApplicationReviewScreen;