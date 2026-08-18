# Video Submission Script — Firebase E-Commerce App

Target: under 5 minutes, face visible the whole time (webcam bubble via QuickTime).

Before you hit record: log out, clear your cart, and have the Firebase console
Rules tab open in a second tab in case you want to flash it quickly.

## 0:00–0:30 — Intro

"Hey, I'm Keishawn. This is my e-commerce app, originally built on FakeStoreAPI,
now fully migrated to Firebase — Authentication for users and Firestore for
products, user profiles, and orders."

## 0:30–1:15 — Auth + User Profile

- Register a new throwaway account on screen (or log in if already registered).
- "When you register, it creates both a Firebase Auth account and a matching
  user profile document in Firestore's `users` collection."
- Click **Profile**. Edit name/address, hit Save Changes.
- "Users can update their profile info here, and there's account deletion too
  — that re-authenticates with your password before removing your Firestore
  profile and your sign-in."

## 1:15–2:30 — Product Catalog + Manage Products

- Go to **Home**. "Products used to come from FakeStoreAPI — now they're
  pulled live from Firestore." Filter by category to show it still works.
- Go to **Manage Products**. "Any signed-in user can create, edit, or delete
  products here, and it's all writing directly to Firestore."
- Add a quick product on camera (fill the form, submit, show it appear).
- Edit that same product, then delete it — show all three CRUD actions.

## 2:30–3:45 — Cart + Checkout + Orders

- Back to Home, add 2 products to cart.
- Go to **Cart**, show quantity +/-, remove, and totals.
- Click **Checkout**. "This writes an order document to Firestore with the
  items, total, and my user ID, then clears the cart."
- Go to **Orders**. "Here's my order history, pulled from Firestore, filtered
  to just my orders." Click into the order you just placed, show the detail
  view with the full item breakdown.

## 3:45–4:15 — Security rules (quick, optional flash)

- Briefly show `firestore.rules` or the Rules tab in Firebase console.
- "Users can only read and edit their own profile and their own orders —
  products are open to any signed-in user since there's no admin role."

## 4:15–4:45 — Wrap up

"That's the app — Firebase Auth for sign-in, Firestore for products, user
profiles, and order history, React Query for data fetching, and Redux
Toolkit for the cart. Thanks for watching."

---

### If you go long, cut in this order:
1. The security rules flash (2:30–3:45 segment)
2. The edit-product step in Manage Products (keep create + delete)
3. Filtering by category on Home
