import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, getShadowStyle } from '../../constants/colors';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap; // Only allow valid Ionicons names
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={theme.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  ); 
}; //

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    ...getShadowStyle(2),
  },
  iconContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    textAlign: 'center',
  },
});

export default ActionButton;