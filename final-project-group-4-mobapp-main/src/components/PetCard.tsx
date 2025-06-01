import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ImageRequireSource
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, getShadowStyle } from '../constants/colors';
import { Pet } from '../types/index';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  adminMode?: boolean;
  isAdopted?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ 
  pet, 
  onPress, 
  onDelete, 
  onFavorite,
  isFavorite = false,
  adminMode = false,
  isAdopted = false
}) => {
  const statusColor = pet.status === 'available' ? theme.success : theme.danger;

  const getImageSource = () => {
    if (typeof pet.imageUrl === 'string') {
      return { uri: pet.imageUrl };
    }
    return pet.imageUrl || require('../assets/images/placeholder.gif');
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={getImageSource()}
        style={[styles.image, isAdopted && styles.imageAdopted]} 
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{pet.name}</Text>
            {onFavorite && !isAdopted && (
              <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton}>
                <Ionicons 
                  name={isFavorite ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={isFavorite ? theme.danger : theme.textLight} 
                />
              </TouchableOpacity>
            )}
        {adminMode && onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => 
              Alert.alert(
                'Confirm Delete',
                `Remove ${pet.name} from the system?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', onPress: onDelete, style: 'destructive' }
                ]
              )
            }
          >
            <Ionicons name="trash" size={20} color={theme.danger} />
          </TouchableOpacity>
        )}
          </View>
          
          <Text style={styles.details}>
            {pet.species} • {pet.age} • {pet.gender}
          </Text>
          
          {pet.size && (
            <Text style={styles.size}>Size: {pet.size}</Text>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{pet.status.toUpperCase()}</Text>
            </View>
            
            {isAdopted && (
              <Text style={styles.adoptedText}>This pet has found their forever home</Text>
            )}
          </View>
        </View>
      </View> 
    </TouchableOpacity>
  );
}; //

const styles = StyleSheet.create({
  card: {
    height: 400,
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    overflow: 'hidden',
    ...getShadowStyle(8),
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.border,
  },
  imageAdopted: {
    opacity: 0.7,
  },
  content: {
    padding: 15,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
    marginRight: 10,
  },
  details: {
    fontSize: 16,
    color: theme.textLight,
  },
  size: {
    fontSize: 14,
    color: theme.textLight,
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adoptedText: {
    color: theme.danger,
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  favoriteButton: {
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default PetCard;