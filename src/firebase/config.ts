import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a proper persistence implementation
const reactNativePersistence = {
  type: 'LOCAL' as const,
  async _setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async _getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },
  async _removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
  async _isAvailable(): Promise<boolean> {
    try {
      await AsyncStorage.setItem('__test__', 'test');
      await AsyncStorage.removeItem('__test__');
      return true;
    } catch {
      return false;
    }
  },
  _addListener: () => {},
  _removeListener: () => {},
};

// Initialize Auth with custom persistence
const auth = initializeAuth(app, {
  persistence: [reactNativePersistence, browserLocalPersistence]
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };