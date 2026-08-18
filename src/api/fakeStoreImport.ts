import axios from 'axios';
import type { NewProduct } from './firestoreProducts';

// One-time import helper: pulls the original FakeStore catalog so the new
// Firestore `products` collection isn't empty. Not used for regular reads.

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

const fakeStoreClient = axios.create({ baseURL: 'https://fakestoreapi.com' });

export const fetchFakeStoreProducts = async (): Promise<NewProduct[]> => {
  const { data } = await fakeStoreClient.get<FakeStoreProduct[]>('/products');
  return data.map(({ title, price, description, category, image, rating }) => ({
    title,
    price,
    description,
    category,
    image,
    rating,
  }));
};
