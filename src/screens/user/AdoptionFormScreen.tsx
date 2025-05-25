import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform, TextInput, Switch } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

interface FormValues {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  birthdate: Date;
  occupation: string;
  hasAdoptedBefore: string;
  householdMembers: string;
  homeType: string;
  hoursAlone: string;
  hasOtherPets: string;
  petExperience: string;
  whyAdopt: string;
  agreement: boolean;
}

const schema = yup.object().shape({
  fullName: yup.string()
    .required('Full name is required')
    .min(2, 'Too short (min 2 characters)')
    .max(50, 'Too long (max 50 characters)'),
  address: yup.string()
    .required('Address is required')
    .min(10, 'Please provide full address (min 10 characters)'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Must be 10-15 digits'),
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  birthdate: yup.date()
    .required('Birthdate is required')
    .max(new Date(), 'Birthdate cannot be in the future'),
  occupation: yup.string()
    .required('Occupation is required')
    .min(2, 'Too short (min 2 characters)'),
  hasAdoptedBefore: yup.string()
    .required('Please select an option')
    .oneOf(['true', 'false'], 'Please select an option'),
  householdMembers: yup.string()
    .required('Household members description is required')
    .min(10, 'Please provide more details (min 10 characters)'),
  homeType: yup.string()
    .required('Home type is required'),
  hoursAlone: yup.string()
    .required('Please select hours pet would be alone'),
  hasOtherPets: yup.string()
    .required('Please select an option')
    .oneOf(['true', 'false'], 'Please select an option'),
  petExperience: yup.string()
    .required('Pet experience is required')
    .min(20, 'Please provide more details (min 20 characters)'),
  whyAdopt: yup.string()
    .required('Adoption reason is required')
    .min(20, 'Please provide more details (min 20 characters)'),
  agreement: yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('Agreement is required'),
});

const homeTypes = [
  { label: 'House', value: 'House' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Condo', value: 'Condo' },
  { label: 'Other', value: 'Other' },
];

const hoursAloneOptions = [
  { label: 'Less than 2 hours', value: '2 hours' },
  { label: '2-4 hours', value: '3 hours' },
  { label: '4-6 hours', value: '5 hours' },
  { label: '6-8 hours', value: '7 hours' },
  { label: '8-10 hours', value: '9 hours' },
  { label: 'More than 10 hours', value: '10+ hours' },
];

const yesNoOptions: RadioButtonProps[] = [
  {
    id: '1',
    label: 'Yes',
    value: 'true',
    color: theme.primary,
    labelStyle: { color: theme.text }
  },
  {
    id: '2',
    label: 'No',
    value: 'false',
    color: theme.primary,
    labelStyle: { color: theme.text }
  }
];

const AdoptionFormScreen = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting, touchedFields }, 
    setValue,
    trigger
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      hasAdoptedBefore: '',
      hasOtherPets: '',
      agreement: false
    }
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: any };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const handleRadioChange = (selectedId: string, fieldName: 'hasAdoptedBefore' | 'hasOtherPets') => {
    const selectedOption = yesNoOptions.find(option => option.id === selectedId);
    if (selectedOption) {
      setValue(fieldName, selectedOption.value as 'true' | 'false', { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const submissionData = {
        ...data,
        hasAdoptedBefore: data.hasAdoptedBefore === 'true',
        hasOtherPets: data.hasOtherPets === 'true'
      };

      const applications = await AsyncStorage.getItem('applications');
      let updatedApplications = applications ? JSON.parse(applications) : [];
      
      const application = {
        ...submissionData,
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
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
      setValue('birthdate', selectedDate, { shouldValidate: true });
      trigger('birthdate');
    }
  };

  const isFormComplete = () => {
    return isValid && Object.keys(touchedFields).length >= 12;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Adopt {pet.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              )}
              name="fullName"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Address <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your complete address"
                  placeholderTextColor="#999"
                />
              )}
              name="address"
            />
            {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g., 09123456789"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              )}
              name="phone"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="your@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Birthdate <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={birthdate ? styles.inputText : styles.placeholderText}>
                {birthdate ? birthdate.toLocaleDateString() : 'Select your birthdate'}
              </Text>
              <Ionicons name="calendar" size={20} color={theme.text} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthdate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            {errors.birthdate && <Text style={styles.errorText}>{errors.birthdate.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Occupation <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Your current job"
                  placeholderTextColor="#999"
                />
              )}
              name="occupation"
            />
            {errors.occupation && <Text style={styles.errorText}>{errors.occupation.message}</Text>}
          </View>
        </View>

        {/* Living Situation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Living Situation</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Who lives with you? <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="List all household members and ages"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              )}
              name="householdMembers"
            />
            {errors.householdMembers && <Text style={styles.errorText}>{errors.householdMembers.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Type of Home <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select your home type..." value="" />
                    {homeTypes.map((option) => (
                      <Picker.Item 
                        key={option.value} 
                        label={option.label} 
                        value={option.value} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
              name="homeType"
            />
            {errors.homeType && <Text style={styles.errorText}>{errors.homeType.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Hours pet would be alone daily <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select hours..." value="" />
                    {hoursAloneOptions.map((option) => (
                      <Picker.Item 
                        key={option.value} 
                        label={option.label} 
                        value={option.value} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
              name="hoursAlone"
            />
            {errors.hoursAlone && <Text style={styles.errorText}>{errors.hoursAlone.message}</Text>}
          </View>
        </View>

        {/* Pet Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pet Experience</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Have you adopted a pet before? <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { value } }) => (
                <RadioGroup
                  radioButtons={yesNoOptions}
                  onPress={(selectedId) => handleRadioChange(selectedId, 'hasAdoptedBefore')}
                  selectedId={value === 'true' ? '1' : value === 'false' ? '2' : undefined}
                  layout="row"
                  containerStyle={styles.radioGroup}
                />
              )}
              name="hasAdoptedBefore"
            />
            {errors.hasAdoptedBefore && <Text style={styles.errorText}>{errors.hasAdoptedBefore.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Do you currently have other pets? <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { value } }) => (
                <RadioGroup
                  radioButtons={yesNoOptions}
                  onPress={(selectedId) => handleRadioChange(selectedId, 'hasOtherPets')}
                  selectedId={value === 'true' ? '1' : value === 'false' ? '2' : undefined}
                  layout="row"
                  containerStyle={styles.radioGroup}
                />
              )}
              name="hasOtherPets"
            />
            {errors.hasOtherPets && <Text style={styles.errorText}>{errors.hasOtherPets.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Describe your experience with pets <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="What pets have you cared for before? Describe your experience..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              )}
              name="petExperience"
            />
            {errors.petExperience && <Text style={styles.errorText}>{errors.petExperience.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Why do you want to adopt this pet? <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Tell us why you'd be a good match for this pet..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              )}
              name="whyAdopt"
            />
            {errors.whyAdopt && <Text style={styles.errorText}>{errors.whyAdopt.message}</Text>}
          </View>
        </View>

        {/* Agreement Section */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.agreementContainer}>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#767577', true: theme.primary }}
                    thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
                  />
                  <Text style={styles.agreementText}>
                    I agree to provide a loving home and proper care for this pet <Text style={styles.required}>*</Text>
                  </Text>
                </View>
              )}
              name="agreement"
            />
            {errors.agreement && <Text style={styles.errorText}>{errors.agreement.message}</Text>}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !isFormComplete() && styles.disabledButton
          ]} 
          onPress={handleSubmit(onSubmit)}
          disabled={!isFormComplete() || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputText: {
    fontSize: 16,
    color: theme.text,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioGroup: {
    justifyContent: 'space-between',
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text,
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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