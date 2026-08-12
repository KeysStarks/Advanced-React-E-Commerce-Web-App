import { useQuery } from '@tanstack/react-query';
import { categoriesQueryOptions } from '../api';

export const useCategories = () => useQuery(categoriesQueryOptions());
