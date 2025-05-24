import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/colors';
import FormInput from '../../components/FormInput';
import { usePets } from '../../context/PetContext';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

const schema = yup.object().shape({
  name: yup.string().required('Pet name is required'),
  species: yup.string().required('Species is required'),
  age: yup.string()
    .required('Age is required')
    .matches(/^[0-9]+(\.[0-9]+)?\s*(years?|months?|weeks?)?$/i, 'Enter valid age (e.g., "2 years")'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['Male', 'Female', 'male', 'female'], 'Must be Male or Female'),
  description: yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
});

const AddPetScreen = () => {
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const [image, setImage] = useState<string | null>(null);
  const { addPet } = usePets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  const showConfirmation = (data: any) => {
    Alert.alert(
      'Confirm Pet Details',
      `Are you sure you want to add ${data.name} to the pet listings?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleAddPet(data),
        },
      ]
    );
  };

  const handleAddPet = async (data: any) => {
    if (!image) {
      Alert.alert('Image required', 'Please select an image for the pet');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPet = {
        ...data,
        id: Date.now().toString(),
        imageUrl: image,
        status: 'available',
        createdAt: new Date(),
      };

      await addPet(newPet);
      Alert.alert('Success', `${data.name} has been added successfully!`);
      reset();
      setImage(null);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Pet</Text>
      
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={pickImage}
        disabled={isSubmitting}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons 
              name="camera-outline" 
              size={40} 
              color={isSubmitting ? theme.textLight : theme.primary} 
            />
            <Text style={styles.imagePlaceholderText}>
              {isSubmitting ? 'Processing...' : 'Tap to select pet image'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Pet Name *"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
            placeholder="Enter pet's name"
            editable={!isSubmitting}
          />
        )}
        name="name"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Species *"
            value={value}
            onChangeText={onChange}
            error={errors.species?.message}
            placeholder="e.g., Dog, Cat, Rabbit"
            editable={!isSubmitting}
          />
        )}
        name="species"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Age *"
            value={value}
            onChangeText={onChange}
            error={errors.age?.message}
            placeholder="e.g., 2 years"
            editable={!isSubmitting}
          />
        )}
        name="age"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Gender *"
            value={value}
            onChangeText={onChange}
            error={errors.gender?.message}
            placeholder="Male or Female"
            editable={!isSubmitting}
          />
        )}
        name="gender"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Description *"
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
            placeholder="Tell us about this pet..."
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />
        )}
        name="description"
      />

      <TouchableOpacity 
        style={[
          styles.button,
          (!isValid || !image || isSubmitting) && styles.disabledButton
        ]}
        onPress={handleSubmit(showConfirmation)}
        disabled={!isValid || !image || isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Adding Pet...' : 
           !image ? 'Select Image First' : 
           isValid ? 'Add Pet' : 'Complete All Fields'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.text,
    textAlign: 'center',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
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
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPetScreen;