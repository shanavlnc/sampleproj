import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApplication } from '../../context/ApplicationContext';
import PetCard from '../../components/PetCard';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../../types/index';

interface SavedPetsScreenProps {
  navigation: StackNavigationProp<UserStackParamList, 'SavedPets'>;
}

const SavedPetsScreen = ({ navigation }: SavedPetsScreenProps) => {
  const { savedPets, toggleSavedPet } = useApplication(); 
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  }; //

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={savedPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => navigation.navigate('PetDetail', { pet: item, fromScreen: 'Saved' })}
            onFavorite={() => toggleSavedPet(item.id)}
            isFavorite={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={50} color={theme.textLight} />
            <Text style={styles.emptyText}>No saved pets yet</Text>
            <Text style={styles.emptySubtext}>
              Find your perfect companion by browsing available pets
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: theme.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    color: theme.text,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SavedPetsScreen;