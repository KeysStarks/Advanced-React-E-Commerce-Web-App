import axios, { type AxiosResponse } from 'axios';
import type { Category, Product } from '../types/catalog';

const catalogApiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export const fetchProducts = (): Promise<AxiosResponse<Product[]>> =>
  catalogApiClient.get<Product[]>('/products');

export const fetchCategories = (): Promise<AxiosResponse<Category[]>> =>
  catalogApiClient.get<Category[]>('/products/categories');

export const fetchProductsByCategory = (category: string): Promise<AxiosResponse<Product[]>> =>
  catalogApiClient.get<Product[]>(`/products/category/${category}`);