import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, Animated } from 'react-native';
import { theme } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Control, Controller } from 'react-hook-form';

interface FormInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showCharCounter?: boolean;
  required?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  control: Control<any>;
  name: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  icon,
  showCharCounter = false,
  maxLength,
  required = false,
  accessibilityLabel,
  accessibilityHint,
  control,
  name,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any, onFocus?: (e: any) => void) => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any, onBlur?: (e: any) => void) => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
    onBlur?.(e);
  };

  const inputBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.primary]
  });

  const labelColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.text, theme.primary]
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && (
          <Text style={styles.asterisk}>*</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.textLight} 
            style={styles.icon}
            accessibilityElementsHidden={true}
          />
        )}
        <Animated.View style={[
          styles.inputWrapper,
          { borderColor: error ? theme.danger : inputBorderColor }
        ]}>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value, onBlur: fieldOnBlur } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    props.multiline && styles.multilineInput,
                    !props.editable && styles.disabledInput,
                    icon && { paddingLeft: 35 }
                  ]}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  onFocus={(e) => handleFocus(e, props.onFocus)}
                  onBlur={(e) => {
                    handleBlur(e, props.onBlur);
                    fieldOnBlur();
                  }}
                  accessibilityLabel={accessibilityLabel || label}
                  accessibilityHint={accessibilityHint}
                  accessibilityState={{ 
                    disabled: !props.editable,
                    selected: !!value,
                  }}
                  {...props}
                />
                {showCharCounter && maxLength && (
                  <Text 
                    style={styles.charCounter}
                    accessibilityLabel={`${value?.length || 0} of ${maxLength} characters used`}
                  >
                    {value?.length || 0}/{maxLength}
                  </Text>
                )}
              </> 
            )} //
          />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        {error && (
          <Text 
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  asterisk: {
    color: theme.danger,
    marginLeft: 4,
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.inputBackground,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 15,
    zIndex: 1,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: theme.text,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: theme.danger,
    fontSize: 14,
    marginTop: 4,
  },
  charCounter: {
    color: theme.textLight,
    fontSize: 12,
    alignSelf: 'flex-end',
  },
});

export default FormInput;  