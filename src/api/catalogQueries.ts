import { queryOptions } from '@tanstack/react-query';
import type { Category, Product } from '../types/catalog';
import { fetchCategories, fetchProducts, fetchProductsByCategory } from './catalogApi';

const PRODUCTS_STALE_TIME = 60_000;

export const catalogQueryKeys = {
  products: ['products'] as const,
  categories: ['categories'] as const,
};

export const productsQueryOptions = () =>
  queryOptions<Product[]>({
    queryKey: catalogQueryKeys.products,
    queryFn: async () => (await fetchProducts()).data,
    staleTime: PRODUCTS_STALE_TIME,
  });

export const categoriesQueryOptions = () =>
  queryOptions<Category[]>({
    queryKey: catalogQueryKeys.categories,
    queryFn: async () => (await fetchCategories()).data,
    staleTime: PRODUCTS_STALE_TIME,
  });

export const productsByCategoryQueryOptions = (category: string) =>
  queryOptions<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => (await fetchProductsByCategory(category)).data,
    staleTime: PRODUCTS_STALE_TIME,
    enabled: !!category,
  });
