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
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const homeTypes = [
  { label: 'Select home type', value: '' },
  { label: 'House', value: 'House' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Condo', value: 'Condo' },
  { label: 'Other', value: 'Other' },
];

const requiredFields = [
  'fullName', 'address', 'phone', 'email', 'birthdate', 'occupation',
  'householdMembers', 'homeType', 'hoursAlone', 'petExperience', 'whyAdopt', 'agreement'
];

const AdoptionFormScreen = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting, touchedFields }, 
    setValue 
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      homeType: '',
      hasAdoptedBefore: false,
      hasOtherPets: false,
      agreement: false
    }
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: any };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date());

  const allRequiredFieldsTouched = () => {
    return requiredFields.every(field => touchedFields[field]);
  };

  const isSubmitDisabled = () => {
    return !isValid || !allRequiredFieldsTouched() || isSubmitting;
  };

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
    isSubmitting(true);
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
      isSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
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
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Full Name *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.fullName?.message}
              placeholder="Your full name"
              editable={!isSubmitting}
            />
          )}
          name="fullName"
        />
        
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Address *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.message}
              placeholder="Your complete address"
              editable={!isSubmitting}
            />
          )}
          name="address"
        />
        
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Phone Number *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Email *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          )}
          name="email"
        />

        <View style={styles.dateInputContainer}>
          <Text style={styles.inputLabel}>Birthdate *</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
            disabled={isSubmitting}
          >
            <Text style={styles.dateText}>
              {birthdate.toLocaleDateString()}
            </Text>
            <Ionicons name="calendar" size={20} color={theme.text} />
          </TouchableOpacity>
          {errors.birthdate && (
            <Text style={styles.errorText}>{errors.birthdate.message}</Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setBirthdate(selectedDate);
                  setValue('birthdate', selectedDate.toISOString().split('T')[0], {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                }
              }}
            />
          )}
        </View>
        
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Occupation *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Who lives with you? *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.householdMembers?.message}
              placeholder="List all household members and ages"
              multiline
              numberOfLines={3}
              editable={!isSubmitting}
            />
          )}
          name="householdMembers"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.inputLabel}>Type of Home *</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.picker}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => {
                    onChange(itemValue);
                    setValue('homeType', itemValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }}
                  enabled={!isSubmitting}
                >
                  {homeTypes.map((item) => (
                    <Picker.Item 
                      key={item.value} 
                      label={item.label} 
                      value={item.value} 
                    />
                  ))}
                </Picker>
              </View>
            )}
            name="homeType"
          />
          {errors.homeType && (
            <Text style={styles.errorText}>{errors.homeType.message}</Text>
          )}
        </View>
        
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Hours pet would be alone daily *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Describe your experience with pets *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Why do you want to adopt this pet? *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
            isSubmitDisabled() && styles.disabledButton
          ]} 
          onPress={handleSubmit(showConfirmation)}
          disabled={isSubmitDisabled()}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 
             (isValid && allRequiredFieldsTouched()) ? 'Submit Application' : 'Complete All Required Fields'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    flex: 1,
    textAlign: 'center',
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
    fontSize: 14,
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
  dateInputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: theme.text,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
});

export default AdoptionFormScreen;