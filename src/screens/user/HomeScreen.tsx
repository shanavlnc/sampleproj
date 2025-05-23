import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { placeholderPets } from '../../constants/pets';
import { theme } from '../../constants/colors';
import PetCard from '../../components/PetCard';
import SwipeButtons from '../../components/SwipeButtons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, UserStackParamList } from '../../types'; // Changed to UserStackParamList

// Update to use UserStackParamList since PetDetail is in the user stack
type HomeScreenNavigationProp = NativeStackNavigationProp<UserStackParamList, 'Home'>;

const HomeScreen = () => {
  const [pets, setPets] = useState(placeholderPets.filter(pet => pet.status === 'available'));
  const [swipedAll, setSwipedAll] = useState(false);
  const swiperRef = useRef<Swiper<Pet>>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const onSwipedLeft = (cardIndex: number) => {
    console.log(`Swiped left on ${pets[cardIndex].name}`);
  };

  const onSwipedRight = async (cardIndex: number) => {
    const pet = pets[cardIndex];
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
  };

  return (
    <View style={styles.container}>
      {pets.length > 0 ? (
        <>
          <Swiper
            ref={swiperRef}
            cards={pets}
            renderCard={(pet) => <PetCard pet={pet} />}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            backgroundColor="white"
            stackSize={3}
            verticalSwipe={false}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: theme.secondary,
                    borderColor: theme.secondary,
                    color: 'white',
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    color: 'white',
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
            }}
          />
          <SwipeButtons
            onPressLeft={() => swiperRef.current?.swipeLeft()}
            onPressRight={() => swiperRef.current?.swipeRight()}
            onPressInfo={() => {
              if (swiperRef.current) {
                const currentIndex = swiperRef.current.state.firstCardIndex;
                if (currentIndex < pets.length) {
                  navigation.navigate('PetDetail', { pet: pets[currentIndex] });
                }
              }
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