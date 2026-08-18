import { useState } from 'react';
import type { Category, Product } from '../types/catalog';
import ProductCard from '../components/ProductCard';
import { useCategories, useProducts } from '../hooks';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: categories = [],
    isPending: areCategoriesPending,
    isError: areCategoriesError,
    error: categoriesError,
  } = useCategories();
  const {
    data: products = [],
    isPending,
    isError,
    error,
  } = useProducts(selectedCategory || undefined);

  if (areCategoriesPending) return <p>Loading...</p>;
  if (areCategoriesError) return <p>Unable to load categories: {categoriesError.message}</p>;
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong: {error?.message}</p>;

  return (
    <div className="home-page">
      <div className="home-toolbar">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category: Category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={() => setSelectedCategory('')} disabled={!selectedCategory}>
          Clear Filter
        </button>
      </div>
      <div className="home-grid">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;