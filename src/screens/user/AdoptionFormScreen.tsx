import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../components/FormInput';
import { theme } from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const schema = yup.object().shape({
  fullName: yup.string()
    .required('Full name is required')
    .min(2, 'Too short')
    .max(50, 'Too long'),
  address: yup.string()
    .required('Address is required')
    .min(10, 'Please provide full address'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number'),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  birthdate: yup.string()
    .required('Birthdate is required'),
  occupation: yup.string().required('Occupation is required'),
  hasAdoptedBefore: yup.boolean(),
  householdMembers: yup.string()
    .required('Please describe household members')
    .min(10, 'Please provide more details'),
  homeType: yup.string()
    .required('Please specify your home type')
    .oneOf(['House', 'Apartment', 'Condo', 'Other'], 'Invalid home type'),
  hoursAlone: yup.string()
    .required('Please specify hours pet would be alone')
    .matches(/^\d+\s*(hours?|hrs?)?$/i, 'Enter valid hours (e.g., "8 hours")'),
  hasOtherPets: yup.boolean(),
  petExperience: yup.string()
    .required('Please describe your pet experience')
    .min(20, 'Please provide more details'),
  whyAdopt: yup.string()
    .required('Please explain why you want to adopt')
    .min(20, 'Please provide more details'),
  agreement: yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('Required'),
});

const AdoptionFormScreen = () => {
  const { control, handleSubmit, formState: { errors, isValid, isDirty }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: any };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date());

  const showConfirmation = (data: any) => {
    Alert.alert(
      'Review Your Application',
      `Please confirm your adoption application for ${pet.name}.`,
      [
        {
          text: 'Edit',
          style: 'cancel',
        },
        {
          text: 'Confirm & Submit',
          onPress: () => onSubmit(data),
        },
      ]
    );
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const applications = await AsyncStorage.getItem('applications');
      let updatedApplications = applications ? JSON.parse(applications) : [];
      
      const application = {
        ...data,
        id: Date.now().toString(),
        petId: pet.id,
        petName: pet.name,
        status: 'pending',
        applicationDate: new Date().toISOString(),
      };

      updatedApplications.push(application);
      await AsyncStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      Alert.alert(
        'Application Submitted!',
        `Thank you for applying to adopt ${pet.name}! We'll review your application and contact you soon.`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.goBack();
            } 
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Adopt {pet.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionHeader}>Personal Information</Text>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Full Name *"
            value={value}
            onChangeText={onChange}
            error={errors.fullName?.message}
            placeholder="Your full name"
            editable={!isSubmitting}
          />
        )}
        name="fullName"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Address *"
            value={value}
            onChangeText={onChange}
            error={errors.address?.message}
            placeholder="Your complete address"
            editable={!isSubmitting}
          />
        )}
        name="address"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Phone Number *"
            value={value}
            onChangeText={onChange}
            error={errors.phone?.message}
            placeholder="e.g., 09123456789"
            keyboardType="phone-pad"
            editable={!isSubmitting}
          />
        )}
        name="phone"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Email *"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
        )}
        name="email"
      />

      <View>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <FormInput
            label="Birthdate *"
            value={birthdate.toLocaleDateString()}
            editable={false}
            pointerEvents="none"
            error={errors.birthdate?.message}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthdate(selectedDate);
                setValue('birthdate', selectedDate.toISOString().split('T')[0], {
                  shouldValidate: true
                });
              }
            }}
          />
        )}
      </View>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Occupation *"
            value={value}
            onChangeText={onChange}
            error={errors.occupation?.message}
            placeholder="Your current job"
            editable={!isSubmitting}
          />
        )}
        name="occupation"
      />
      
      <Text style={styles.sectionHeader}>Living Situation</Text>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Who lives with you? *"
            value={value}
            onChangeText={onChange}
            error={errors.householdMembers?.message}
            placeholder="List all household members and ages"
            multiline
            numberOfLines={3}
            editable={!isSubmitting}
          />
        )}
        name="householdMembers"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Type of Home *"
            value={value}
            onChangeText={onChange}
            error={errors.homeType?.message}
            placeholder="House, Apartment, Condo, etc."
            editable={!isSubmitting}
          />
        )}
        name="homeType"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Hours pet would be alone daily *"
            value={value}
            onChangeText={onChange}
            error={errors.hoursAlone?.message}
            placeholder="e.g., 8 hours"
            editable={!isSubmitting}
          />
        )}
        name="hoursAlone"
      />
      
      <Text style={styles.sectionHeader}>Pet Experience</Text>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Have you adopted a pet before?</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
              disabled={isSubmitting}
            />
          )}
          name="hasAdoptedBefore"
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Do you currently have other pets?</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
              disabled={isSubmitting}
            />
          )}
          name="hasOtherPets"
        />
      </View>
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Describe your experience with pets *"
            value={value}
            onChangeText={onChange}
            error={errors.petExperience?.message}
            placeholder="What pets have you cared for before?"
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />
        )}
        name="petExperience"
      />
      
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Why do you want to adopt this pet? *"
            value={value}
            onChangeText={onChange}
            error={errors.whyAdopt?.message}
            placeholder="Tell us why you'd be a good match"
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />
        )}
        name="whyAdopt"
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          I agree to provide a loving home and proper care for this pet *
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
              disabled={isSubmitting}
            />
          )}
          name="agreement"
        />
      </View>
      {errors.agreement && (
        <Text style={styles.errorText}>{errors.agreement.message}</Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.submitButton,
          (!isValid || !isDirty || isSubmitting) && styles.disabledButton
        ]} 
        onPress={handleSubmit(showConfirmation)}
        disabled={!isValid || !isDirty || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 
           isValid ? 'Submit Application' : 'Complete All Required Fields'}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
    marginTop: 30,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdoptionFormScreen;