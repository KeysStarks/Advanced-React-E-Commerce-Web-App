import { useState } from 'react';
import type { Category, Product } from '../types/catalog';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts } from '../hooks';

const Home: React.FC = () => {
  const navigate = useNavigate();
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
    <div>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((category: Category) => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={() => navigate('/profile')}>Go to Profile Page</button>
      <button onClick={() => navigate('/cart')}>View Cart</button>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;