import { db } from '../firebase/config';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Application } from '../types';

export const getAllApplications = async (): Promise<Application[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'applications'));
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as Application);
    });
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const getPendingApplications = async (): Promise<Application[]> => {
  try {
    const q = query(collection(db, 'applications'), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as Application);
    });
    return applications;
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    throw error;
  }
};

export const submitApplication = async (applicationData: Omit<Application, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...applicationData,
      createdAt: new Date(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: 'approved' | 'rejected'
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'applications', applicationId), {
      status,
      reviewedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};