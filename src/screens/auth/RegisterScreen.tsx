import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    try {
      await register({ email, password, name });
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          padding: 15,
          marginBottom: 15,
          backgroundColor: theme.colors.card,
        }}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          padding: 15,
          marginBottom: 15,
          backgroundColor: theme.colors.card,
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          padding: 15,
          marginBottom: 20,
          backgroundColor: theme.colors.card,
        }}
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 15, alignItems: 'center' }}
      >
        <Text style={{ color: theme.colors.primary }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;