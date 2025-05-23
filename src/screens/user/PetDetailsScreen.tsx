import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pet } from '../../types';
import { theme } from '../../constants/colors';

// Define the navigation stack types
type RootStackParamList = {
  PetDetail: { pet: Pet };
  AdoptionForm: { pet: Pet };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PetDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { pet } = route.params as { pet: Pet };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.detailsContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.status}>
            {pet.status === 'available' ? '🟢 Available' : '🔴 Adopted'}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detail}>{pet.breed}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.age}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.detail}>{pet.gender}</Text>
        </View>

        <Text style={styles.sectionTitle}>About {pet.name}</Text>
        <Text style={styles.description}>{pet.description}</Text>

        {pet.status === 'available' && (
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => navigation.navigate('AdoptionForm', { pet })}
          >
            <Text style={styles.adoptButtonText}>Adopt {pet.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 350,
  },
  detailsContainer: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  status: {
    fontSize: 16,
    color: theme.textLight,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  detail: {
    marginRight: 5,
    color: theme.textLight,
    fontSize: 16,
  },
  separator: {
    marginRight: 5,
    color: theme.textLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: theme.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
    marginBottom: 30,
  },
  adoptButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  adoptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PetDetailScreen;
