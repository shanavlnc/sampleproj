import { Platform } from 'react-native';

export const theme = {
  // Core Colors
  primary: '#FF6B6B',       
  secondary: '#4ECDC4',     
  accent: '#FFBE0B',       
  
  // Status Colors
  success: '#51CF66',     
  warning: '#FCC419',       
  danger: '#FF6B6B',       
  info: '#339AF0',          
  
  // Text Colors
  text: '#2E2E2E',          
  textLight: '#7A7A7A',     
  textInverted: '#FFFFFF',  
  
  // Background
  background: '#FFFFFF',    
  cardBackground: '#F8F9FA',
  inputBackground: '#FFFFFF',
  
  // Borders & Dividers //
  border: '#E9ECEF',       
  divider: '#DEE2E6',    
  
  // Overlays
  overlay: 'rgba(0,0,0,0.5)', 
  
  // Platform Specific
  iosShadow: 'rgba(0,0,0,0.1)',
  androidElevation: 4,
};

export type ThemeColors = typeof theme;

// Shadow utility function
export const getShadowStyle = (elevation = 2) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    },
    android: {
      elevation: elevation,
    },
    default: {},
  });
};