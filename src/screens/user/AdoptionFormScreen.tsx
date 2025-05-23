import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, KeyboardTypeOptions } from 'react-native';
import { useForm, Controller, SubmitHandler, FieldValues, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../components/FormInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/colors';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Pet } from '../../types';

// Define form data type
interface FormData {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  birthdate: string;
  occupation: string;
  company?: string;
  socialMedia?: string;
  maritalStatus: string;
  alternateContactName?: string;
  alternateContactRelationship?: string;
  alternateContactPhone?: string;
  alternateContactEmail?: string;
  hasAdoptedBefore: boolean;
  householdMembers: string;
  childrenAges?: string;
  homeType: string;
  hasYard: boolean;
  yardFenced?: boolean;
  hoursAlone: string;
  hasOtherPets: boolean;
  otherPetsInfo?: string;
  hasVet: boolean;
  vetInfo?: string;
  petExperience: string;
  petActivities: string;
  whyAdopt: string;
  agreement: boolean;
}

// Define schema type
type SchemaType = yup.ObjectSchema<{
  fullName: string;
  address: string;
  phone: string;
  email: string;
  birthdate: string;
  occupation: string;
  company?: string;
  socialMedia?: string;
  maritalStatus: string;
  alternateContactName?: string;
  alternateContactRelationship?: string;
  alternateContactPhone?: string;
  alternateContactEmail?: string;
  hasAdoptedBefore: boolean;
  householdMembers: string;
  childrenAges?: string;
  homeType: string;
  hasYard: boolean;
  yardFenced?: boolean;
  hoursAlone: string;
  hasOtherPets: boolean;
  otherPetsInfo?: string;
  hasVet: boolean;
  vetInfo?: string;
  petExperience: string;
  petActivities: string;
  whyAdopt: string;
  agreement: boolean;
}>;

const schema: SchemaType = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: yup.string().email('Invalid email').required('Email is required'),
  birthdate: yup.string().required('Birthdate is required'),
  occupation: yup.string().required('Occupation is required'),
  company: yup.string().optional(),
  socialMedia: yup.string().optional(),
  maritalStatus: yup.string().required('Marital status is required'),
  alternateContactName: yup.string().optional(),
  alternateContactRelationship: yup.string().optional(),
  alternateContactPhone: yup.string().optional(),
  alternateContactEmail: yup.string().optional(),
  hasAdoptedBefore: yup.boolean().required('This field is required'),
  householdMembers: yup.string().required('Please describe household members'),
  childrenAges: yup.string().optional(),
  homeType: yup.string().required('Please specify your home type'),
  hasYard: yup.boolean().required('This field is required'),
  yardFenced: yup.boolean().optional(),
  hoursAlone: yup.string().required('Please specify hours pet would be alone'),
  hasOtherPets: yup.boolean().required('This field is required'),
  otherPetsInfo: yup.string().optional(),
  hasVet: yup.boolean().required('This field is required'),
  vetInfo: yup.string().optional(),
  petExperience: yup.string().required('Please describe your pet experience'),
  petActivities: yup.string().required('Please describe planned activities'),
  whyAdopt: yup.string().required('Please explain why you want to adopt'),
  agreement: yup.boolean().oneOf([true], 'You must agree to the terms').required(),
});

const AdoptionFormScreen = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
    defaultValues: {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      birthdate: '',
      occupation: '',
      company: '',
      socialMedia: '',
      maritalStatus: '',
      alternateContactName: '',
      alternateContactRelationship: '',
      alternateContactPhone: '',
      alternateContactEmail: '',
      hasAdoptedBefore: false,
      householdMembers: '',
      childrenAges: '',
      homeType: '',
      hasYard: false,
      yardFenced: false,
      hoursAlone: '',
      hasOtherPets: false,
      otherPetsInfo: '',
      hasVet: false,
      vetInfo: '',
      petExperience: '',
      petActivities: '',
      whyAdopt: '',
      agreement: false,
    },
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: Pet };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await addDoc(collection(db, 'applications'), {
        ...data,
        petId: pet.id,
        petName: pet.name,
        status: 'pending',
        createdAt: new Date(),
      });
      Alert.alert(
        'Application Submitted',
        'Your adoption application has been submitted successfully. We will review it and get back to you soon.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const hasYard = watch('hasYard');
  const hasOtherPets = watch('hasOtherPets');
  const hasVet = watch('hasVet');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* All your form fields remain exactly the same as before */}
      {/* ... */}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      >
        <Text style={styles.submitButtonText}>Submit Application</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: theme.primary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  errorText: {
    color: theme.danger,
    marginBottom: 15,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdoptionFormScreen;