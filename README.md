# Advanced React E-Commerce Web App

An e-commerce demo built with React, TypeScript, React Query, Redux Toolkit, and FakeStoreAPI.

## What it does

- Fetches products and categories with React Query
- Filters products by category from the API
- Lets users add products to a shopping cart
- Stores cart state in Redux Toolkit and sessionStorage
- Shows cart totals, quantity controls, and checkout behavior
- Uses an image fallback when product images fail to load

## Tech Stack

- React 19
- TypeScript
- React Router
- TanStack React Query
- Redux Toolkit
- Bootstrap
- Axios

## Features

### Product Catalog

- Displays products from FakeStoreAPI
- Shows title, price, category, description, rating, and image
- Loads categories dynamically from the API
- Fetches category-specific products when a category is selected

### Shopping Cart

- Add products from the Home page
- Increase or decrease item quantity
- Remove items from the cart
- View total item count and total price
- Clear cart on checkout

### Persistence

- Saves cart data to sessionStorage
- Restores cart data on refresh

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run lint` - run ESLint

## Video Presentation Checklist

- Keep the video under 5 minutes
- Make sure your face is visible on camera
- Briefly explain what the app does
- Explain how React Query and Redux Toolkit are used
- Show a quick live demo of the app

## Demo Talk Track

1. "This is an e-commerce app that lets users browse products, filter by category, and manage a cart."
2. "I use React Query for server state like products and categories."
3. "I use Redux Toolkit for the cart because that state is shared across the app."
4. "The cart is saved to sessionStorage so it survives refreshes."
5. "When the user checks out, the cart is cleared and the session data is reset."
