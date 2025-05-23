import { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  interface Persistence {
    type: 'SESSION' | 'LOCAL' | 'NONE';
  }
}