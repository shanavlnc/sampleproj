import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { placeholderPets } from '../../constants/pets';
import { theme } from '../../constants/colors';
import PetCard from '../../components/PetCard';
import SwipeButtons from '../../components/SwipeButtons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, UserStackParamList } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<UserStackParamList, 'Home'>;

const HomeScreen = () => {
  const [pets, setPets] = useState(placeholderPets.filter(pet => pet.status === 'available'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        // Swiped right
        handleSwipeRight();
      } else if (gesture.dx < -120) {
        // Swiped left
        handleSwipeLeft();
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true
        }).start();
      }
    }
  });

  const handleSwipeRight = async () => {
    const pet = pets[currentIndex];
    try {
      const savedPets = await AsyncStorage.getItem('savedPets');
      let updatedSavedPets = savedPets ? JSON.parse(savedPets) : [];
      
      if (!updatedSavedPets.some((p: Pet) => p.id === pet.id)) {
        updatedSavedPets.push(pet);
        await AsyncStorage.setItem('savedPets', JSON.stringify(updatedSavedPets));
      }
    } catch (error) {
      console.error('Error saving pet:', error);
    }
    goToNextPet();
  };

  const handleSwipeLeft = () => {
    console.log(`Swiped left on ${pets[currentIndex].name}`);
    goToNextPet();
  };

  const goToNextPet = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true
    }).start(() => {
      setCurrentIndex(prev => (prev + 1) % pets.length);
    });
  };

  return (
    <View style={styles.container}>
      {pets.length > 0 ? (
        <>
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  {
                    rotate: position.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: ['-30deg', '0deg', '30deg']
                    })
                  }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <PetCard pet={pets[currentIndex]} />
          </Animated.View>
          
          <SwipeButtons
            onPressLeft={handleSwipeLeft}
            onPressRight={handleSwipeRight}
            onPressInfo={() => {
              navigation.navigate('PetDetail', { pet: pets[currentIndex] });
            }}
          />
        </>
      ) : (
        <View style={styles.noPetsContainer}>
          <Text style={styles.noPetsText}>No pets available for adoption right now.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    height: '60%',
    position: 'absolute',
    top: '10%',
  },
  noPetsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPetsText: {
    fontSize: 18,
    textAlign: 'center',
    color: theme.text,
  },
});

export default HomeScreen;