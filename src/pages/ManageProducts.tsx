import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts } from '../hooks';
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '../api/catalogQueries';
import { createProduct, catalogQueryKeys, fetchFakeStoreProducts } from '../api';
import type { Product } from '../types/catalog';
import type { NewProduct } from '../api/firestoreProducts';

const emptyForm: NewProduct = {
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
  rating: { rate: 0, count: 0 },
};

const ManageProducts: React.FC = () => {
  const { data: products = [], isPending, isError, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<NewProduct>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.category.trim() || !form.image.trim()) {
      setFormError('Title, category, and image URL are required.');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, product: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      resetForm();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Unable to save product.');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    if (editingId === id) resetForm();
  };

  const handleImport = async () => {
    setImporting(true);
    setFormError(null);
    try {
      const starterProducts = await fetchFakeStoreProducts();
      for (const product of starterProducts) {
        await createProduct(product);
      }
      await queryClient.invalidateQueries({ queryKey: catalogQueryKeys.products });
      await queryClient.invalidateQueries({ queryKey: catalogQueryKeys.categories });
    } catch (importError) {
      setFormError(importError instanceof Error ? importError.message : 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page-shell" style={{ marginTop: '1rem' }}>
      <h2>Manage Products</h2>

      {products.length === 0 && !isPending && (
        <div className="list-card">
          <p className="muted-text">No products in Firestore yet.</p>
          <button onClick={handleImport} disabled={importing}>
            {importing ? 'Importing…' : 'Import starter catalog from FakeStore'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" style={{ marginBottom: '1.25rem' }}>
        <h3>{editingId ? 'Edit Product' : 'Add a Product'}</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
        <div className="button-row">
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        {formError && <p className="auth-error">{formError}</p>}
      </form>

      {isPending && <p>Loading products…</p>}
      {isError && <p className="auth-error">Unable to load products: {error?.message}</p>}

      {products.map((product) => (
        <div className="list-card" key={product.id}>
          <div className="list-card-header">
            <div>
              <strong>{product.title}</strong>
              <p className="muted-text">
                {product.category} · ${product.price}
              </p>
            </div>
            <div className="button-row">
              <button onClick={() => startEditing(product)}>Edit</button>
              <button
                className="danger-button"
                onClick={() => handleDelete(product.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageProducts;
