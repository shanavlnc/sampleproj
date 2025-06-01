import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/colors';

interface LoaderProps {
  message?: string;
  inline?: boolean;
  size?: 'small' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ 
  message, 
  inline = false, 
  size = 'large' 
}) => {
  return (
    <View style={[styles.container, inline && styles.inlineContainer]}>
      <ActivityIndicator 
        size={size} 
        color={theme.primary} 
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  inlineContainer: {
    flex: 0,
    padding: 20,
  },
  message: {
    marginTop: 10,
    color: theme.text,
    fontSize: 16,
  },
});
export default Loader;  