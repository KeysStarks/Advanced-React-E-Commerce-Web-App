import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category, Product } from '../types/catalog';
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  updateProduct,
  type NewProduct,
} from './firestoreProducts';

const PRODUCTS_STALE_TIME = 60_000;

export const catalogQueryKeys = {
  products: ['products'] as const,
  categories: ['categories'] as const,
};

export const productsQueryOptions = () =>
  queryOptions<Product[]>({
    queryKey: catalogQueryKeys.products,
    queryFn: () => fetchProducts(),
    staleTime: PRODUCTS_STALE_TIME,
  });

export const categoriesQueryOptions = () =>
  queryOptions<Category[]>({
    queryKey: catalogQueryKeys.categories,
    queryFn: () => fetchCategories(),
    staleTime: PRODUCTS_STALE_TIME,
  });

export const productsByCategoryQueryOptions = (category: string) =>
  queryOptions<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    staleTime: PRODUCTS_STALE_TIME,
    enabled: !!category,
  });

const useInvalidateCatalog = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products });
    queryClient.invalidateQueries({ queryKey: catalogQueryKeys.categories });
  };
};

export const useCreateProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (product: NewProduct) => createProduct(product),
    onSuccess: invalidate,
  });
};

export const useUpdateProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<NewProduct> }) =>
      updateProduct(id, product),
    onSuccess: invalidate,
  });
};

export const useDeleteProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });
};
