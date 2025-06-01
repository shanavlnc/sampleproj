import React, { useState, useEffect, useMemo } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApplication } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/colors';
import FormInput from '../../components/FormInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../types/index';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = yup.object({
  fullName: yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
  address: yup.string()
    .required('Address is required')
    .min(10, 'Please provide a complete address'),
  occupation: yup.string()
    .required('Occupation is required'),
  birthdate: yup.date()
    .required('Birthdate is required')
    .max(new Date(), 'Birthdate must be in the past')
    .typeError('Please select a valid date'),
  homeType: yup.string()
    .required('Please select your home type')
    .typeError('Please select your home type'),
  householdMembers: yup.string()
    .required('Please describe your household members')
    .min(5, 'Please provide more details about your household members'),
  hoursAlone: yup.string()
    .required('Please select how long the pet will be alone')
    .typeError('Please select how long the pet will be alone'),
  petExperience: yup.string()
    .required('Please describe your experience with pets')
    .min(10, 'Please provide more details about your experience with pets'),
  whyAdopt: yup.string()
    .required('Please tell us why you want to adopt')
    .min(10, 'Please tell us more about why you want to adopt this pet'),
  agreement: yup.boolean()
    .oneOf([true], 'You must agree to provide proper care')
    .required('You must agree to provide proper care'),
}).required();

type FormData = yup.InferType<typeof schema>;

const homeTypes = ['House', 'Apartment', 'Condo', 'Other'];
const hoursAloneOptions = [
  'Less than 2 hours',
  '2-4 hours', 
  '4-6 hours',
  '6-8 hours',
  '8+ hours'
];

const AdoptionFormScreen = () => {
  const { user } = useAuth();
  const { submitApplication } = useApplication();
  const route = useRoute<RouteProp<UserStackParamList, 'AdoptionForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { pet } = route.params;
  const progressAnim = useMemo(() => new Animated.Value(0), []);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, dirtyFields },
    setValue,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      occupation: '',
      birthdate: new Date(),
      homeType: '',
      householdMembers: '',
      hoursAlone: '',
      petExperience: '',
      whyAdopt: '',
      agreement: false
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Load saved form data
  useEffect(() => {
    const loadSavedForm = async () => {
      try {
        const saved = await AsyncStorage.getItem(`adoption-form-${pet.id}`);
        if (saved) {
          const savedData = JSON.parse(saved) as Partial<FormData>;
          Object.entries(savedData).forEach(([key, value]) => {
            if (key === 'birthdate' && typeof value === 'string') {
              setValue(key as keyof FormData, new Date(value));
            } else if (typeof value === 'boolean' || typeof value === 'string') {
              setValue(key as keyof FormData, value);
            }
          });
        }
      } catch (error) {
        console.error('Error loading saved form:', error);
      }
    };
    loadSavedForm();
  }, [pet.id, setValue]);

  // Save form progress
  useEffect(() => {
    const saveFormProgress = async () => {
      try {
        await AsyncStorage.setItem(`adoption-form-${pet.id}-progress`, JSON.stringify({ progress: currentProgress }));
      } catch (error) {
        console.error('Error saving form progress:', error);
      }
    };
    saveFormProgress();
  }, [pet.id, currentProgress]);

  // Trigger validation on mount to show initial state
  useEffect(() => {
    trigger();
  }, [trigger]);

  // Check if user has already submitted an application for this pet
  useEffect(() => {
    const checkPreviousApplication = async () => {
      try {
        const previousApp = await AsyncStorage.getItem(`submitted-application-${pet.id}`);
        if (previousApp) {
          setHasSubmitted(true);
        }
      } catch (error) {
        console.error('Error checking previous application:', error);
      }
    };
    checkPreviousApplication();
  }, [pet.id]);

  // Calculate and animate form progress
  useEffect(() => {
    const calculateProgress = () => {
      const totalFields = Object.keys(schema.fields).length;
      const filledFields = Object.keys(formValues).filter(key => !!formValues[key]).length;
      return filledFields / totalFields;
    };

    const newProgress = calculateProgress();
    setCurrentProgress(newProgress);
    
    Animated.spring(progressAnim, {
      toValue: newProgress,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
  }, [formValues, progressAnim]);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const date = selectedDate || formValues.birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setValue('birthdate', date, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    if (hasSubmitted) {
      Alert.alert('Already Submitted', 'You have already submitted an application for this pet.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplication({
        petId: pet.id,
        petName: pet.name,
        applicantName: data.fullName,
        applicantEmail: data.email,
        applicantPhone: data.phone,
        address: data.address,
        occupation: data.occupation,
        hasExperience: data.petExperience.length > 0,
        homeType: data.homeType,
        householdMembers: data.householdMembers,
        hoursAlone: data.hoursAlone,
        petExperience: data.petExperience,
        whyAdopt: data.whyAdopt
      });
      
      // Mark this pet as having a submitted application
      await AsyncStorage.setItem(`submitted-application-${pet.id}`, 'true');
      setHasSubmitted(true);
      
      // Clear saved form data after successful submission
      await AsyncStorage.removeItem(`adoption-form-${pet.id}`);
      
      Alert.alert(
        'Application Submitted!',
        `Thank you for applying to adopt ${pet.name}! We'll contact you soon.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
        <Text style={styles.progressText}>
          {Math.round(currentProgress * 100)}% Complete
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {hasSubmitted && (
          <View style={styles.alreadySubmittedBanner}>
            <Text style={styles.alreadySubmittedText}>
              You have already submitted an application for this pet
            </Text>
          </View>
        )}

        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDetails}>
            {pet.species} • {pet.age} • {pet.gender}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            label="Full Name"
            control={control}
            name="fullName"
            error={errors.fullName?.message}
            icon="person"
            required
          />

          <FormInput
            label="Email"
            control={control}
            name="email"
            error={errors.email?.message}
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <FormInput
            label="Phone"
            control={control}
            name="phone"
            error={errors.phone?.message}
            icon="call"
            keyboardType="phone-pad"
            required
          />

          <FormInput
            label="Address"
            control={control}
            name="address"
            error={errors.address?.message}
            icon="home"
            multiline
            required
          />

          <FormInput
            label="Occupation"
            control={control}
            name="occupation"
            error={errors.occupation?.message}
            icon="briefcase"
            required
          />

          {/* Birthdate Picker */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>
              Birthdate <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={theme.textLight} />
              <Text style={styles.dateText}>
                {formValues.birthdate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {errors.birthdate && (
              <Text style={styles.errorText}>{errors.birthdate.message}</Text>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formValues.birthdate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Home Type Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>
              Home Type <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formValues.homeType}
                onValueChange={(value) => setValue('homeType', value, { shouldValidate: true })}
                style={styles.picker}
              >
                <Picker.Item label="Select Home Type" value="" />
                {homeTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
            {errors.homeType && (
              <Text style={styles.errorText}>{errors.homeType.message}</Text>
            )}
          </View>

          {/* Hours Alone Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>
              Hours Pet Will Be Alone <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formValues.hoursAlone}
                onValueChange={(value) => setValue('hoursAlone', value, { shouldValidate: true })}
                style={styles.picker}
              >
                <Picker.Item label="Select Hours" value="" />
                {hoursAloneOptions.map((hours) => (
                  <Picker.Item key={hours} label={hours} value={hours} />
                ))}
              </Picker>
            </View>
            {errors.hoursAlone && (
              <Text style={styles.errorText}>{errors.hoursAlone.message}</Text>
            )}
          </View>

          <FormInput
            label="Household Members"
            control={control}
            name="householdMembers"
            error={errors.householdMembers?.message}
            multiline
            placeholder="Describe who lives in your household, including children and other pets"
            required
          />

          <FormInput
            label="Pet Experience"
            control={control}
            name="petExperience"
            error={errors.petExperience?.message}
            multiline
            placeholder="Describe your experience with pets"
            required
          />

          <FormInput
            label="Why do you want to adopt?"
            control={control}
            name="whyAdopt"
            error={errors.whyAdopt?.message}
            multiline
            placeholder="Tell us why you want to adopt this pet"
            required
          />

          {/* Agreement Checkbox */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setValue('agreement', !formValues.agreement)}
            >
              <Ionicons
                name={formValues.agreement ? 'checkbox' : 'square-outline'}
                size={24}
                color={errors.agreement ? theme.danger : theme.primary}
              />
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              I agree to provide a loving home and proper care for this pet *
            </Text>
          </View>
          {errors.agreement && (
            <Text style={styles.errorText}>{errors.agreement.message}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (hasSubmitted || !isValid || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={hasSubmitted || !isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {hasSubmitted ? 'Application Already Submitted' : 'Submit Application'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  progressContainer: {
    height: 2,
    backgroundColor: theme.border,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.primary,
  },
  progressText: {
    textAlign: 'center',
    color: theme.textLight,
    fontSize: 12,
    paddingVertical: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.background,
  },
  petInfo: {
    padding: 16,
    backgroundColor: theme.cardBackground,
    marginBottom: 16,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
    color: theme.textLight,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.inputBackground,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.text,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.inputBackground,
  },
  picker: {
    height: 48,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    color: theme.text,
  },
  errorText: {
    color: theme.danger,
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requiredAsterisk: {
    color: theme.danger,
    fontSize: 16,
  },
  alreadySubmittedBanner: {
    backgroundColor: theme.danger,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  alreadySubmittedText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
}); //

export default AdoptionFormScreen;