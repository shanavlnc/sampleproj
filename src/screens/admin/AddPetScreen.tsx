import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Added missing import
import { theme } from '../../constants/colors';
import FormInput from '../../components/FormInput';
import { usePets } from '../../context/PetContext'; // Changed from usePetContext to usePets

const AddPetScreen = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const { addPet } = usePets(); // Changed to usePets

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name || !breed || !age || !gender || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newPet = {
      name,
      breed,
      age,
      gender,
      description,
      imageUrl: image || 'default_image_uri',
      status: 'available' as const
    };

    addPet(newPet);
    Alert.alert('Success', 'Pet added successfully');
    setName('');
    setBreed('');
    setAge('');
    setGender('');
    setDescription('');
    setImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Pet</Text>
      
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={40} color={theme.textLight} />
            <Text style={styles.imagePlaceholderText}>Tap to select pet image</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <FormInput label="Pet Name" value={name} onChangeText={setName} />
      <FormInput label="Breed" value={breed} onChangeText={setBreed} />
      <FormInput label="Age" value={age} onChangeText={setAge} />
      <FormInput label="Gender" value={gender} onChangeText={setGender} />
      <FormInput 
        label="Description" 
        value={description} 
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Add Pet</Text>
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
    backgroundColor: '#e0e0e0',
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