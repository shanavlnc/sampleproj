import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Text // Added Text import
} from 'react-native';
import { useApplication } from '../../context/ApplicationContext'; 
import { useAuth } from '../../context/AuthContext'; 
import { theme } from '../../constants/colors';
import StatCard from '.././admin/StatCard'; 
import ActionButton from '.././admin/ActionButton'; 
import { Ionicons } from '@expo/vector-icons';

interface AdminDashboardProps {
  navigation: {
    navigate: (screen: string) => void;
  };
} //

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const { pets, applications } = useApplication();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    pendingApps: 0,
  });

  useEffect(() => {
    setStats({
      totalPets: pets.length,
      availablePets: pets.filter(p => p.status === 'available').length,
      pendingApps: applications.filter(a => a.status === 'pending').length,
    });
  }, [pets, applications]);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>PAWS Management</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || 'Admin'}!</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard 
          icon="paw" 
          value={stats.totalPets} 
          label="Total Pets" 
          color={theme.primary}
        />
        <StatCard 
          icon="checkmark-circle" 
          value={stats.availablePets} 
          label="Available" 
          color={theme.success}
        />
        <StatCard 
          icon="document-text" 
          value={stats.pendingApps} 
          label="Pending Apps" 
          color={theme.warning}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <ActionButton 
            icon="list" 
            label="Manage Pets" 
            onPress={() => navigation.navigate('PetManagement')}
          />
          <ActionButton 
            icon="document-attach" 
            label="Applications" 
            onPress={() => navigation.navigate('ApplicationReview')}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={signOut}
      >
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  }, //
  logoutButton: {
    backgroundColor: theme.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AdminDashboard;