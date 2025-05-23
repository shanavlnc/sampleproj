import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../components/FormInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/colors';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Pet } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  PetDetail: { pet: Pet };
  Home: undefined;
};

interface FormData {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  birthdate: string;
  occupation: string;
  company?: string | undefined;
  socialMedia?: string | undefined;
  maritalStatus: string;
  alternateContactName?: string | undefined;
  alternateContactRelationship?: string | undefined;
  alternateContactPhone?: string | undefined;
  alternateContactEmail?: string | undefined;
  hasAdoptedBefore: boolean;
  householdMembers: string;
  childrenAges?: string | undefined;
  homeType: string;
  hasYard: boolean;
  yardFenced?: boolean | undefined;
  hoursAlone: string;
  hasOtherPets: boolean;
  otherPetsInfo?: string | undefined;
  hasVet: boolean;
  vetInfo?: string | undefined;
  petExperience: string;
  petActivities: string;
  whyAdopt: string;
  agreement: boolean;
}

// Create a Yup schema that matches FormData exactly
const schema: yup.ObjectSchema<FormData> = yup.object().shape({
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
  yardFenced: yup.boolean().when('hasYard', {
    is: true,
    then: (schema) => schema.required('Please specify if yard is fenced'),
    otherwise: (schema) => schema.optional()
  }),
  hoursAlone: yup.string().required('Please specify hours pet would be alone'),
  hasOtherPets: yup.boolean().required('This field is required'),
  otherPetsInfo: yup.string().when('hasOtherPets', {
    is: true,
    then: (schema) => schema.required('Please describe your other pets'),
    otherwise: (schema) => schema.optional()
  }),
  hasVet: yup.boolean().required('This field is required'),
  vetInfo: yup.string().when('hasVet', {
    is: true,
    then: (schema) => schema.required('Please provide vet information'),
    otherwise: (schema) => schema.optional()
  }),
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
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      birthdate: '',
      occupation: '',
      company: undefined,
      socialMedia: undefined,
      maritalStatus: '',
      alternateContactName: undefined,
      alternateContactRelationship: undefined,
      alternateContactPhone: undefined,
      alternateContactEmail: undefined,
      hasAdoptedBefore: false,
      householdMembers: '',
      childrenAges: undefined,
      homeType: '',
      hasYard: false,
      yardFenced: undefined,
      hoursAlone: '',
      hasOtherPets: false,
      otherPetsInfo: undefined,
      hasVet: false,
      vetInfo: undefined,
      petExperience: '',
      petActivities: '',
      whyAdopt: '',
      agreement: false,
    },
  });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
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
      <Text style={styles.title}>Adoption Application for {pet.name}</Text>
      
      {/* Personal Information Section */}
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Full Name"
            value={value}
            onChangeText={onChange}
            error={errors.fullName?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Address"
            value={value}
            onChangeText={onChange}
            error={errors.address?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Phone Number"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="birthdate"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Birthdate (MM/DD/YYYY)"
            value={value}
            onChangeText={onChange}
            error={errors.birthdate?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="occupation"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Occupation"
            value={value}
            onChangeText={onChange}
            error={errors.occupation?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="company"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Company (Optional)"
            value={value}
            onChangeText={onChange}
            error={errors.company?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="socialMedia"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Social Media (Optional)"
            value={value}
            onChangeText={onChange}
            error={errors.socialMedia?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="maritalStatus"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Marital Status"
            value={value}
            onChangeText={onChange}
            error={errors.maritalStatus?.message}
          />
        )}
      />
      
      {/* Alternate Contact Section */}
      <Text style={styles.sectionTitle}>Alternate Contact</Text>
      
      <Controller
        control={control}
        name="alternateContactName"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Full Name (Optional)"
            value={value}
            onChangeText={onChange}
            error={errors.alternateContactName?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="alternateContactRelationship"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Relationship (Optional)"
            value={value}
            onChangeText={onChange}
            error={errors.alternateContactRelationship?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="alternateContactPhone"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Phone Number (Optional)"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.alternateContactPhone?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="alternateContactEmail"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Email (Optional)"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            error={errors.alternateContactEmail?.message}
          />
        )}
      />
      
      {/* Household Information Section */}
      <Text style={styles.sectionTitle}>Household Information</Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Have you adopted before?</Text>
        <Controller
          control={control}
          name="hasAdoptedBefore"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>
      {errors.hasAdoptedBefore && <Text style={styles.errorText}>{errors.hasAdoptedBefore.message}</Text>}
      
      <Controller
        control={control}
        name="householdMembers"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Who lives in your household?"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
            error={errors.householdMembers?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="childrenAges"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Children's Ages (Optional)"
            value={value}
            onChangeText={onChange}
            error={errors.childrenAges?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="homeType"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Type of Home (House, Apartment, etc.)"
            value={value}
            onChangeText={onChange}
            error={errors.homeType?.message}
          />
        )}
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Do you have a yard?</Text>
        <Controller
          control={control}
          name="hasYard"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>
      {errors.hasYard && <Text style={styles.errorText}>{errors.hasYard.message}</Text>}
      
      {hasYard && (
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Is the yard fenced?</Text>
          <Controller
            control={control}
            name="yardFenced"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value || false}
                onValueChange={onChange}
              />
            )}
          />
        </View>
      )}
      {errors.yardFenced && <Text style={styles.errorText}>{errors.yardFenced.message}</Text>}
      
      <Controller
        control={control}
        name="hoursAlone"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="How many hours per day will the pet be alone?"
            value={value}
            onChangeText={onChange}
            error={errors.hoursAlone?.message}
          />
        )}
      />
      
      {/* Pet Experience Section */}
      <Text style={styles.sectionTitle}>Pet Experience</Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Do you have other pets?</Text>
        <Controller
          control={control}
          name="hasOtherPets"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>
      {errors.hasOtherPets && <Text style={styles.errorText}>{errors.hasOtherPets.message}</Text>}
      
      {hasOtherPets && (
        <Controller
          control={control}
          name="otherPetsInfo"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Tell us about your other pets"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              error={errors.otherPetsInfo?.message}
            />
          )}
        />
      )}
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Do you have a veterinarian?</Text>
        <Controller
          control={control}
          name="hasVet"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>
      {errors.hasVet && <Text style={styles.errorText}>{errors.hasVet.message}</Text>}
      
      {hasVet && (
        <Controller
          control={control}
          name="vetInfo"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Veterinarian name and contact information"
              value={value}
              onChangeText={onChange}
              error={errors.vetInfo?.message}
            />
          )}
        />
      )}
      
      <Controller
        control={control}
        name="petExperience"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Describe your experience with pets"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            error={errors.petExperience?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="petActivities"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="What activities will you do with your pet?"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            error={errors.petActivities?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="whyAdopt"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Why do you want to adopt this pet?"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            error={errors.whyAdopt?.message}
          />
        )}
      />
      
      {/* Agreement Section */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          I agree to provide a loving home and care for this pet
        </Text>
        <Controller
          control={control}
          name="agreement"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>
      {errors.agreement && <Text style={styles.errorText}>{errors.agreement.message}</Text>}
      
      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit(onSubmit)}
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
    backgroundColor: theme.cardBackground,
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