import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { theme } from '../constants/colors';

interface FormInputProps {
  label: string;
  value: any;
  onChangeText?: (text: string) => void;
  onValueChange?: (value: boolean) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  isSwitch?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  onValueChange,
  error,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  isSwitch = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      ) : (
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.errorInput
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white'
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  errorInput: {
    borderColor: theme.danger
  },
  errorText: {
    color: theme.danger,
    fontSize: 12,
    marginTop: 5
  }
});

export default FormInput;