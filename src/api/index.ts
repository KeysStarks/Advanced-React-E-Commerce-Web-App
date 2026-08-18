export {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from './firestoreProducts';
export type { NewProduct } from './firestoreProducts';
export {
  catalogQueryKeys,
  categoriesQueryOptions,
  productsQueryOptions,
  productsByCategoryQueryOptions,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './catalogQueries';
export { fetchFakeStoreProducts } from './fakeStoreImport';
