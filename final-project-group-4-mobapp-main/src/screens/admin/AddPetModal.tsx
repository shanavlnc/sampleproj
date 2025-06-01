import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Image,
  Text, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useApplication } from '../../context/ApplicationContext';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { theme } from '../../constants/colors';
import { 
  speciesOptions, 
  petSizeOptions, 
  temperamentOptions,
  genderOptions
} from '../../constants/pets';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Species, Gender, PetSize, Temperament } from '../../types';

interface PetFormData {
  id?: string;
  name: string;
  species: Species | '';
  breed: string;
  age: string;
  gender: Gender | '';
  size?: PetSize;
  temperament: Temperament[];
  description: string;
  imageUrl: string | null;
}

interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  petToEdit?: PetFormData;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ visible, onClose, petToEdit }) => {
  const { addPet, updatePet } = useApplication();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PetFormData>(petToEdit || {
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: undefined,
    temperament: [],
    description: '',
    imageUrl: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PetFormData, string>> = {};

    if (!formData.name) newErrors.name = 'Pet name is required';
    if (!formData.species) newErrors.species = 'Species is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.imageUrl) newErrors.imageUrl = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const petData = {
        ...formData,
        species: formData.species as Species,
        gender: formData.gender as Gender,
        status: 'available' as const,
        createdAt: new Date(),
        imageUrl: formData.imageUrl,
      }; //

      if (petToEdit?.id) {
        await updatePet(petToEdit.id, petData);
      } else {
        await addPet(petData);
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save pet');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTemperament = (trait: Temperament) => {
    setFormData(prev => ({
      ...prev,
      temperament: prev.temperament.includes(trait)
        ? prev.temperament.filter(t => t !== trait)
        : [...prev.temperament, trait]
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {petToEdit ? 'Edit Pet' : 'Add New Pet'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pet Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter pet name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Species *</Text>
              <View style={[styles.picker, errors.species && styles.inputError]}>
                <Picker
                  selectedValue={formData.species}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, species: value as Species }))}
                >
                  <Picker.Item label="Select Species" value="" />
                  {speciesOptions.map((species) => (
                    <Picker.Item key={species} label={species} value={species} />
                  ))}
                </Picker>
              </View>
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Breed</Text>
              <TextInput
                style={styles.input}
                value={formData.breed}
                onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
                placeholder="Enter breed"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                placeholder="Enter age"
                keyboardType="numeric"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Gender *</Text>
              <View style={[styles.picker, errors.gender && styles.inputError]}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as Gender }))}
                >
                  <Picker.Item label="Select Gender" value="" />
                  {genderOptions.map((gender) => (
                    <Picker.Item key={gender} label={gender} value={gender} />
                  ))}
                </Picker>
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Size</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={formData.size}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, size: value as PetSize }))}
                >
                  <Picker.Item label="Select Size" value={undefined} />
                  {petSizeOptions.map((size) => (
                    <Picker.Item key={size} label={size} value={size} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.temperamentContainer}>
              <Text style={styles.label}>Temperament</Text>
              <View style={styles.temperamentGrid}>
                {temperamentOptions.map((trait) => (
                  <TouchableOpacity
                    key={trait}
                    style={[
                      styles.temperamentChip,
                      formData.temperament.includes(trait as Temperament) && styles.temperamentChipSelected
                    ]}
                    onPress={() => toggleTemperament(trait as Temperament)}
                  >
                    <Text style={[
                      styles.temperamentChipText,
                      formData.temperament.includes(trait as Temperament) && styles.temperamentChipTextSelected
                    ]}>
                      {trait}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.imagePicker}>
              {formData.imageUrl ? (
                <Image 
                  source={{ uri: formData.imageUrl }} 
                  style={styles.image} 
                />
              ) : (
                <Ionicons name="image" size={40} color={theme.textLight} />
              )}
              <PrimaryButton 
                title="Select Image" 
                onPress={handleImagePick}
                style={styles.imageButton}
              />
              {errors.imageUrl && <Text style={styles.errorText}>{errors.imageUrl}</Text>}
            </View>

            <PrimaryButton
              title={petToEdit ? 'Update Pet' : 'Add Pet'}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.inputBackground,
  },
  inputError: {
    borderColor: theme.danger,
  },
  errorText: {
    color: theme.danger,
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.inputBackground,
  },
  temperamentContainer: {
    marginBottom: 16,
  },
  temperamentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  temperamentChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: 'white',
  },
  temperamentChipSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  temperamentChipText: {
    fontSize: 14,
    color: theme.text,
  },
  temperamentChipTextSelected: {
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageButton: {
    width: '60%',
    marginTop: 10,
  },
  submitButton: {
    marginTop: 20,
    width: '100%',
  },
  closeButton: {
    padding: 4,
  },
});

export default AddPetModal; 