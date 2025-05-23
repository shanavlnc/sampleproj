import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/colors';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { signIn } = useAuth();

  // Mock admin credentials (in real app, you might want to store these securely)
  const ADMIN_CREDENTIALS = {
    email: 'admin@shelter.com',
    password: 'shelter123' // In production, use proper hashing/security
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.endsWith('@shelter.com')) {
      Alert.alert('Error', 'Only shelter admin accounts can login');
      return;
    }

    setLoading(true);
    try {
      // Check against mock credentials (replace with your actual auth logic)
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        await signIn(email, true); // true for isAdmin
      } else {
        Alert.alert('Login Error', 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Shelter Admin Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Welcome</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Your existing styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: theme.text,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 20,
    textAlign: 'center',
    color: theme.primary,
  },
});

export default LoginScreen;