import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Order, OrderItem } from '../types/order';

const ORDERS_COLLECTION = 'orders';

const toOrder = (id: string, data: DocumentData): Order => ({
  id,
  userId: data.userId,
  items: data.items ?? [],
  total: data.total ?? 0,
  createdAt: data.createdAt ?? null,
});

export const createOrder = async (userId: string, items: OrderItem[], total: number): Promise<string> => {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    userId,
    items,
    total,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const fetchOrdersForUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => toOrder(docSnap.id, docSnap.data()));
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  const snapshot = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!snapshot.exists()) return null;
  return toOrder(snapshot.id, snapshot.data());
};
