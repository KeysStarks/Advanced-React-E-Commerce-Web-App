import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { UserProfile } from '../types/userProfile';

const USERS_COLLECTION = 'users';

export const createUserProfile = async (uid: string, email: string): Promise<void> => {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    uid,
    email,
    name: '',
    address: '',
    createdAt: serverTimestamp(),
  });
};

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<Pick<UserProfile, 'name' | 'address'>>,
): Promise<void> => {
  // merge: true creates the doc if it's missing (e.g. accounts registered
  // before user profiles existed) instead of throwing "No document to update".
  await setDoc(doc(db, USERS_COLLECTION, uid), updates, { merge: true });
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
};
