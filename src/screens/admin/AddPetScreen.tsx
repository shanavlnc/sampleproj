import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  imageUri: string;
  status: 'available' | 'adopted';
  createdAt: Date;
}

const AddPetScreen = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to upload images');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !breed || !age || !gender || !description || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    setIsLoading(true);
    try {
      const existingPetsString = await AsyncStorage.getItem('pets');
      const existingPets: Pet[] = existingPetsString ? JSON.parse(existingPetsString) : [];

      const newPet: Pet = {
        id: uuidv4(),
        name,
        breed,
        age,
        gender,
        description,
        imageUri,
        status: 'available',
        createdAt: new Date()
      };

      await AsyncStorage.setItem('pets', JSON.stringify([...existingPets, newPet]));

      Alert.alert('Success', 'Pet added successfully');
      setName('');
      setBreed('');
      setAge('');
      setGender('');
      setDescription('');
      setImageUri(null);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Pet</Text>
      
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={40} color={theme.textLight} />
            <Text style={styles.imagePlaceholderText}>Tap to select pet image</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Age (e.g., 2 years)"
        value={age}
        onChangeText={setAge}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Adding Pet...' : 'Add Pet'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.text,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: theme.textLight,
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPetScreen;