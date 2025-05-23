import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface SwipeButtonsProps {
  onPressLeft: () => void;
  onPressRight: () => void;
  onPressInfo: () => void;
  disabled?: boolean;
}

const SwipeButtons: React.FC<SwipeButtonsProps> = ({
  onPressLeft,
  onPressRight,
  onPressInfo,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.nopeButton]}
        onPress={onPressLeft}
        disabled={disabled}
      >
        <Ionicons name="close" size={32} color={theme.danger} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.infoButton]}
        onPress={onPressInfo}
        disabled={disabled}
      >
        <Ionicons name="information-circle" size={32} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={onPressRight}
        disabled={disabled}
      >
        <Ionicons name="heart" size={32} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nopeButton: {
    borderColor: theme.danger,
    borderWidth: 2,
  },
  likeButton: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  infoButton: {
    borderColor: theme.textLight,
    borderWidth: 2,
  },
});

export default SwipeButtons;