import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import Cart from './Cart';
import type { Product } from '../types/catalog';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', email: 'test@example.com' }, loading: false }),
}));

jest.mock('../api/ordersApi', () => ({
  createOrder: jest.fn(),
}));

const mockProduct: Product = {
  id: 'test-1',
  title: 'Test Sneaker',
  price: 49.99,
  description: 'A shoe for testing.',
  category: 'shoes',
  image: 'https://example.com/shoe.png',
  rating: { rate: 4.5, count: 10 },
};

describe('Cart integration', () => {
  test('adding a product from ProductCard updates the Cart page', async () => {
    const store = configureStore({ reducer: { cart: cartReducer } });
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
          <Cart />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();

    await user.click(screen.getByText('Add to Cart'));

    expect(screen.queryByText('Your cart is empty.')).not.toBeInTheDocument();
    expect(screen.getByText('Total Items: 1')).toBeInTheDocument();
    expect(screen.getByText('Total Price: $49.99')).toBeInTheDocument();
  });
});