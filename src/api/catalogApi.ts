// Deprecated: product reads now go through Firestore (see firestoreProducts.ts).
// Kept only so the one-time FakeStore catalog import (fakeStoreImport.ts) has
// somewhere to live without breaking older imports of this file.
export { fetchFakeStoreProducts } from './fakeStoreImport';
