# Advanced React E-Commerce Web App

A full-stack e-commerce demo built with React, TypeScript, React Query, Redux Toolkit, and Firebase (Authentication + Firestore).

## Live Demo

https://advanced-react-e-commerce-web-app-brown.vercel.app/

## What it does

- Registers, logs in, and logs out users with Firebase Authentication
- Stores a Firestore user profile (name, address) for every account
- Manages the entire product catalog in Firestore — browse, filter by category, create, edit, and delete products
- Lets users add products to a shopping cart, backed by Redux Toolkit and sessionStorage
- Saves each checkout as an order in Firestore, tied to the signed-in user
- Shows an order history page with a detail view per order

## Tech Stack

- React 19
- TypeScript
- React Router
- TanStack React Query
- Redux Toolkit
- Firebase (Authentication + Firestore)
- Bootstrap
- Axios (used once, for the optional starter-catalog import)

## Features

### Authentication

- Register and log in with email/password (Firebase Authentication)
- Registering creates a matching `users/{uid}` document in Firestore
- Logout button in the navbar

### User Profile

- Edit and save your name and address (Firestore `users` collection)
- Delete your account, which removes your Firestore profile and your Firebase Auth sign-in (requires re-entering your password)

### Product Catalog

- Products live in a Firestore `products` collection instead of an external API
- Browse, filter by category, and view details
- "Manage Products" page: create new products, edit existing ones, or delete them
- If the products collection is empty, a one-time "Import starter catalog from FakeStore" button seeds it from FakeStoreAPI

### Shopping Cart

- Add products from the Home page
- Increase or decrease item quantity
- Remove items from the cart
- View total item count and total price
- Cart persists to sessionStorage and survives refreshes

### Orders

- Checking out writes an order document to Firestore with the items, total, and the user's ID, then clears the cart
- "Orders" page lists your past orders (ID, date, total)
- Click into an order to see the full item list and total

## Firebase Setup

This app uses Firebase Authentication and Firestore. Create a local `.env.local` file based on `.env.example` and populate it with your Firebase web app values:

```bash
cp .env.example .env.local
```

Required variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

You can find these in the Firebase console under Project settings > Your apps > Web app configuration.

### Firestore Security Rules

The `firestore.rules` file in this repo defines access for four collections:

- `products` — any signed-in user can read and manage products
- `users/{uid}` — only the owner can read, update, or delete their own profile
- `orders` — users can create and read only their own orders; orders can't be edited or deleted
- `documents` — a leftover demo collection from an earlier lesson

Paste the contents of `firestore.rules` into Firebase console > Firestore Database > Rules and publish before using product management, profiles, or checkout.

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run lint` - run ESLint
