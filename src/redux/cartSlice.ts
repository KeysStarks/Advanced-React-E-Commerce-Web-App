import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/catalog';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'cart';

const loadCartFromSession = (): CartItem[] => {
    try {
        const stored = sessionStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const initialState: CartState = {
  items: loadCartFromSession(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
        const existing = state.items.find((item) => item.id === action.payload.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            state.items.push({ ...action.payload, quantity: 1 });
        }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
        const item = state.items.find((item) => item.id === action.payload);
        if (item) {
            item.quantity += 1;
        }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
        const item = state.items.find((item) => item.id === action.payload);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
        } else if (item) {
            state.items = state.items.filter((i) => i.id !== action.payload);
        }
    },
    clearCart: (state) => {
        state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;