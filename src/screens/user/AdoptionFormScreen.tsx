import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../components/FormInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  birthdate: yup.string().required('Birthdate is required'),
  occupation: yup.string().required('Occupation is required'),
  hasAdoptedBefore: yup.boolean().required('This field is required'),
  householdMembers: yup.string().required('Please describe household members'),
  homeType: yup.string().required('Please specify your home type'),
  hoursAlone: yup.string().required('Please specify hours pet would be alone'),
  hasOtherPets: yup.boolean().required('This field is required'),
  petExperience: yup.string().required('Please describe your pet experience'),
  whyAdopt: yup.string().required('Please explain why you want to adopt'),
  agreement: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const AdoptionFormScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      birthdate: '',
      occupation: '',
      hasAdoptedBefore: false,
      householdMembers: '',
      homeType: '',
      hoursAlone: '',
      hasOtherPets: false,
      petExperience: '',
      whyAdopt: '',
      agreement: false,
    },
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: any };

  const onSubmit = async (data: any) => {
    try {
      const applications = await AsyncStorage.getItem('applications');
      let updatedApplications = applications ? JSON.parse(applications) : [];
      
      updatedApplications.push({
        ...data,
        petId: pet.id,
        petName: pet.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      Alert.alert(
        'Application Submitted',
        'Your adoption application has been submitted successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adoption Application for {pet.name}</Text>
      
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Full Name"
            onChangeText={onChange}
            value={value}
            error={errors.fullName?.message}
          />
        )}
        name="fullName"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Address"
            onChangeText={onChange}
            value={value}
            error={errors.address?.message}
          />
        )}
        name="address"
      />
      
<Controller
  control={control}
  render={({ field: { onChange, value } }) => (
    <FormInput
      label="Phone Number"
      onChangeText={onChange}
      value={value}
      error={errors.phone?.message}
    />
  )}
  name="phone"
/>

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Email"
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Birthdate"
            onChangeText={onChange}
            value={value}
            error={errors.birthdate?.message}
          />
        )}
        name="birthdate"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Occupation"
            onChangeText={onChange}
            value={value}
            error={errors.occupation?.message}
          />
        )}
        name="occupation"
      />
      
      <Text style={styles.sectionTitle}>Living Situation</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Household Members"
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={3}
            error={errors.householdMembers?.message}
          />
        )}
        name="householdMembers"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Home Type (House, Apartment, etc.)"
            onChangeText={onChange}
            value={value}
            error={errors.homeType?.message}
          />
        )}
        name="homeType"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Hours Pet Would Be Alone Daily"
            onChangeText={onChange}
            value={value}
            error={errors.hoursAlone?.message}
          />
        )}
        name="hoursAlone"
      />
      
      <Text style={styles.sectionTitle}>Pet Experience</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Have you adopted before?</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
            />
          )}
          name="hasAdoptedBefore"
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Do you have other pets?</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
            />
          )}
          name="hasOtherPets"
        />
      </View>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Describe your pet experience"
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={4}
            error={errors.petExperience?.message}
          />
        )}
        name="petExperience"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Why do you want to adopt this pet?"
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={4}
            error={errors.whyAdopt?.message}
          />
        )}
        name="whyAdopt"
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          I agree to provide a loving home and proper care for this pet
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
            />
          )}
          name="agreement"
        />
      </View>
      {errors.agreement && (
        <Text style={styles.errorText}>You must agree to the terms</Text>
      )}
      
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