import { useQuery } from '@tanstack/react-query';
import { productsByCategoryQueryOptions, productsQueryOptions } from '../api/catalogQueries';

export const useProducts = (category?: string) =>
  useQuery(category ? productsByCategoryQueryOptions(category) : productsQueryOptions());
