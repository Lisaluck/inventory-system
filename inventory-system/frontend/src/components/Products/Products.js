import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api';

const emptyForm = { name: '', sku: '', price: '', quantity: '', description: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setAlert({ type: 'error', msg: 'Failed to load products' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity, description: p.description || '' });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required';
    if (form.quantity === '' || isNaN(Number(form.quantity)) || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) e.quantity = 'Valid non-negative integer required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, payload);
        setAlert({ type: 'success', msg: 'Product updated successfully' });
      } else {
        await createProduct(payload);
        setAlert({ type: 'success', msg: 'Product created successfully' });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.detail || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setAlert({ type: 'success', msg: 'Product deleted' });
      load();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.detail || 'Delete failed' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''} in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>
          {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
          <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading products...</div>
      ) : products.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <div className="empty-title">No products yet</div>
            <div className="empty-text">Add your first product to get started.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: 12, color: '#6b7280' }}>{p.description}</div>}
                  </td>
                  <td><code style={{ fontSize: 12, background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{p.sku}</code></td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.quantity === 0 ? 'badge-danger' : p.quantity <= 10 ? 'badge-warning' : 'badge-success'}`}>
                      {p.quantity} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input className={errors.name ? 'error' : ''} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wireless Keyboard" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input className={errors.sku ? 'error' : ''} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. WK-001" />
                {errors.sku && <span className="field-error">{errors.sku}</span>}
              </div>
              <div className="form-group">
                <label>Price ($) *</label>
                <input type="number" min="0" step="0.01" className={errors.price ? 'error' : ''} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" min="0" className={errors.quantity ? 'error' : ''} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
