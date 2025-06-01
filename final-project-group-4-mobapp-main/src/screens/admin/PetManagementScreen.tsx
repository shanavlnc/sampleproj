import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  Text
} from 'react-native';
import { useApplication } from '../../context/ApplicationContext'; 
import PetCard from '../../components/PetCard';
import { FloatingActionButton } from '../../components/buttons/FloatingActionButton';
import AddPetModal from '../admin/AddPetModal';
import { theme } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PetManagementScreenProps {
  navigation: {
    navigate: (screen: string, params?: { pet: any }) => void;
  };
} //

const PetManagementScreen: React.FC<PetManagementScreenProps> = ({ navigation }) => {
  const { pets, deletePet, refreshData } = useApplication();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard 
            pet={item} 
            adminMode
            onDelete={() => deletePet(item.id)}
            onPress={() => navigation.navigate('AddPet', { pet: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pets found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton 
        icon="add"
        onPress={() => setShowAddModal(true)}
        position="relative"
        style={styles.fab}
      />

      <AddPetModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textLight,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default PetManagementScreen;