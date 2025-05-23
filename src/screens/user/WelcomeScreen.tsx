import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { placeholderPets } from '../../constants/pets';
import { theme } from '../../constants/colors';
import PetCard from '../../components/PetCard';
import SwipeButtons from '../../components/SwipeButtons';
import { useNavigation } from '@react-navigation/native';
import { Pet } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  AdoptionForm: { pet: Pet };
  PetDetail: { pet: Pet };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [pets] = useState(placeholderPets.filter(pet => pet.status === 'available'));
  const [swipedAll, setSwipedAll] = useState(false);
  const swiperRef = useRef<any>(null); // Using any as temporary workaround
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const onSwipedLeft = (cardIndex: number) => {
    console.log(`Swiped left on ${pets[cardIndex].name}`);
  };

  const onSwipedRight = (cardIndex: number) => {
    const pet = pets[cardIndex];
    Alert.alert(
      `You liked ${pet.name}!`,
      'Would you like to adopt this pet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Adopt', onPress: () => navigation.navigate('AdoptionForm', { pet }) },
      ]
    );
  };

  const onSwipedAll = () => {
    setSwipedAll(true);
  };

  const swipeLeft = () => {
    swiperRef.current?.swipeLeft();
  };

  const swipeRight = () => {
    swiperRef.current?.swipeRight();
  };

  const showDetails = () => {
    const currentIndex = swiperRef.current?.state?.firstCardIndex;
    if (currentIndex !== undefined && currentIndex < pets.length) {
      navigation.navigate('PetDetail', { pet: pets[currentIndex] });
    }
  };

  return (
    <View style={styles.container}>
      {pets.length > 0 ? (
        <>
          <Swiper
            ref={swiperRef}
            cards={pets}
            renderCard={(pet: Pet) => <PetCard pet={pet} />}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onSwipedAll={onSwipedAll}
            cardIndex={0}
            backgroundColor="white"
            stackSize={3}
            verticalSwipe={false}
            overlayLabels={{
              left: {
                title: <Text style={styles.overlayLabelText}>NOPE</Text>,
                style: {
                  label: {
                    backgroundColor: theme.secondary,
                    borderColor: theme.secondary,
                    borderWidth: 1,
                    padding: 10,
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
                title: <Text style={styles.overlayLabelText}>LIKE</Text>,
                style: {
                  label: {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1,
                    padding: 10,
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
            animateOverlayLabelsOpacity
            animateCardOpacity
          />
          <SwipeButtons
            onPressLeft={swipeLeft}
            onPressRight={swipeRight}
            onPressInfo={showDetails}
          />
        </>
      ) : (
        <View style={styles.noPetsContainer}>
          <Text style={styles.noPetsText}>No pets available for adoption right now.</Text>
          <Text style={styles.noPetsSubText}>Please check back later!</Text>
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
    marginBottom: 10,
    color: theme.text,
  },
  noPetsSubText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.textLight,
  },
  overlayLabelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
