import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../redux/cartSlice';
import ProductCard from './ProductCard';
import type { Product } from '../types/catalog';

const mockProduct: Product = {
  id: 'test-1',
  title: 'Test Sneaker',
  price: 49.99,
  description: 'A shoe for testing.',
  category: 'shoes',
  image: 'https://example.com/shoe.png',
  rating: { rate: 4.5, count: 10 },
};

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  render(
    <Provider store={store}>
      <ProductCard product={mockProduct} />
    </Provider>
  );

  return store;
};

describe('ProductCard', () => {
  test('renders product title and price', () => {
    renderWithStore();

    expect(screen.getByText('Test Sneaker')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

    test('dispatches addToCart action when "Add to Cart" button is clicked', async () => {
    const store = renderWithStore();
    const user = userEvent.setup();

    await user.click(screen.getByText('Add to Cart'));

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].id).toBe('test-1');
  });
});
