import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Product } from '../types/catalog';

const PRODUCTS_COLLECTION = 'products';

const toProduct = (id: string, data: DocumentData): Product => ({
  id,
  title: data.title,
  price: data.price,
  description: data.description,
  category: data.category,
  image: data.image,
  rating: data.rating ?? { rate: 0, count: 0 },
});

export const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snapshot.docs.map((docSnap) => toProduct(docSnap.id, docSnap.data()));
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => toProduct(docSnap.id, docSnap.data()));
};

export const fetchCategories = async (): Promise<string[]> => {
  const products = await fetchProducts();
  return Array.from(new Set(products.map((product) => product.category))).sort();
};

export type NewProduct = Omit<Product, 'id'>;

export const createProduct = async (product: NewProduct): Promise<string> => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<NewProduct>): Promise<void> => {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};
