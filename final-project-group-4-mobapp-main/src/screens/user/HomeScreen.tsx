import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApplication } from '../../context/ApplicationContext';
import PetCard from '../../components/PetCard';
import { theme, getShadowStyle } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../../types';

type HomeScreenNavigationProp = StackNavigationProp<UserStackParamList, 'Home'>;

const HomeScreen = () => {
  const { pets, savedPets, toggleSavedPet, viewedPetIds, markPetAsViewed, resetViewedPets } = useApplication();
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    // Find first unviewed pet
    const firstUnviewedIndex = pets.findIndex(pet => !viewedPetIds.includes(pet.id));
    setCurrentIndex(firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0);
  }, [pets, viewedPetIds]);

  const goToNext = (direction: 'left' | 'right' = 'right') => {
    const currentPet = pets[currentIndex];
    markPetAsViewed(currentPet.id);

    Animated.timing(position, {
      toValue: { x: direction === 'right' ? 400 : -400, y: 0 },
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      // Find next unviewed pet
      let nextIndex = currentIndex;
      let foundUnviewed = false;
      
      for (let i = 1; i <= pets.length; i++) {
        const candidateIndex = (currentIndex + i) % pets.length;
        if (!viewedPetIds.includes(pets[candidateIndex].id)) {
          nextIndex = candidateIndex;
          foundUnviewed = true;
          break;
        }
      }

      if (foundUnviewed) {
        setCurrentIndex(nextIndex);
      }
      position.setValue({ x: 0, y: 0 });
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: async (_, gesture) => {
      if (Math.abs(gesture.dx) > 120) {
        const pet = pets[currentIndex];
        if (gesture.dx > 0) { // Right swipe (like)
          await toggleSavedPet(pet.id);
          goToNext('right');
        } else { // Left swipe (pass)
          goToNext('left');
        }
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
      }
    }
  });

  if (pets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="paw" size={50} color={theme.textLight} />
          <Text style={styles.emptyText}>No pets available</Text>
          <Text style={styles.emptySubtext}>
            Check back later for new furry friends
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewedPetIds.length === pets.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={50} color={theme.textLight} />
          <Text style={styles.emptyText}>You've seen all our pets!</Text>
          <Text style={styles.emptySubtext}>
            Check your saved pets or come back later for new additions
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetViewedPets}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentPet = pets[currentIndex];
  const isSaved = savedPets.some(p => p.id === currentPet.id);
  const isAdopted = currentPet.status === 'adopted';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { translateX: position.x },
                { 
                  rotate: position.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ['-15deg', '0deg', '15deg']
                  })
                }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <PetCard 
            pet={currentPet} 
            onPress={() => navigation.navigate('PetDetail', { pet: currentPet })}
            onFavorite={async () => {
              await toggleSavedPet(currentPet.id);
              goToNext('right');
            }}
            isFavorite={isSaved}
            isAdopted={isAdopted}
          />
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]}
            onPress={() => goToNext('left')}
          >
            <Ionicons name="close" size={32} color={theme.danger} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={async () => {
              await toggleSavedPet(currentPet.id);
              goToNext('right');
            }}
          >
            <Ionicons 
              name={isSaved ? 'heart' : 'heart-outline'} 
              size={32} 
              color={isSaved ? theme.danger : theme.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    ...getShadowStyle(),
  },
  passButton: {
    borderWidth: 2,
    borderColor: theme.danger,
  },
  saveButton: {
    borderWidth: 2,
    borderColor: theme.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  resetButtonText: {
    color: theme.textInverted,
    fontSize: 16,
    fontWeight: '600',
  },
}); //

export default HomeScreen;