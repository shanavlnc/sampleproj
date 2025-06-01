import React from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../../types/index';

const PetDetailScreen = () => {
  const route = useRoute<RouteProp<UserStackParamList, 'PetDetail'>>();
  const navigation = useNavigation<StackNavigationProp<UserStackParamList>>();
  const { pet, fromScreen } = route.params;
  const isAdopted = pet.status === 'adopted';

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={[styles.backButton, Platform.OS === 'android' && styles.backButtonAndroid]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Image 
          source={pet.imageUrl || require('../../assets/images/placeholder.gif')} 
          style={[styles.image, isAdopted && styles.imageAdopted]} 
          resizeMode="cover" 
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.details}>
              {pet.species} • {pet.age} • {pet.gender}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{pet.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Ionicons name="paw" size={20} color={theme.textLight} />
              <Text style={styles.detailText}>Breed: {pet.breed || 'Mixed'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="resize" size={20} color={theme.textLight} />
              <Text style={styles.detailText}>Size: {pet.size || 'Medium'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="heart" size={20} color={theme.textLight} />
              <Text style={styles.detailText}>
                Temperament: {pet.temperament?.join(', ') || 'Friendly'}
              </Text>
            </View>
          </View>

          {isAdopted ? (
            <View style={styles.adoptedContainer}>
              <Ionicons name="home" size={32} color={theme.danger} />
              <Text style={styles.adoptedText}>
                {pet.name} has found their forever home
              </Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.adoptButton}
              onPress={() => navigation.navigate('AdoptionForm', { pet })}
            >
              <Text style={styles.adoptButtonText}>Adopt {pet.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  backButtonAndroid: {
    top: 40,
  },
  image: {
    width: '100%',
    height: 300,
  },
  imageAdopted: {
    opacity: 0.7,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: theme.textLight,
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text,
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
  adoptedContainer: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  adoptedText: {
    fontSize: 18,
    color: theme.danger,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
}); //

export default PetDetailScreen;