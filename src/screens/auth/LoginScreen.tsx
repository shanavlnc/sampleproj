import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme(); // Get the theme object directly
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
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
        onPress={handleLogin}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 15, alignItems: 'center' }}
      >
        <Text style={{ color: theme.colors.primary }}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;