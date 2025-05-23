import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { usePets } from '../../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

type ManagePetsNavigationProp = StackNavigationProp<RootStackParamList, 'ManagePets'>;

const ManagePetsScreen = () => {
  const { colors } = useTheme();
  const { pets, deletePet } = usePets();
  const navigation = useNavigation<ManagePetsNavigationProp>();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deletePet(id) }
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: colors.card }]}>
            <Text style={[styles.name, { color: colors.primary }]}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('PetForm', { pet: item })}
              >
                <Ionicons name="create" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('PetForm', { pet: undefined })}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default ManagePetsScreen;