import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getCustomers, getProducts, createOrder, deleteOrder } from '../../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: '' }]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getOrders(), getCustomers(), getProducts()])
      .then(([o, c, p]) => {
        setOrders(o.data);
        setCustomers(c.data);
        setProducts(p.data);
      })
      .catch(() => setAlert({ type: 'error', msg: 'Failed to load data' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const addItem = () => setItems([...items, { product_id: '', quantity: '' }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const validate = () => {
    const e = {};
    if (!customerId) e.customer = 'Select a customer';
    items.forEach((item, i) => {
      if (!item.product_id) e[`product_${i}`] = 'Select a product';
      if (!item.quantity || parseInt(item.quantity) <= 0) e[`qty_${i}`] = 'Enter quantity > 0';
    });
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await createOrder({
        customer_id: parseInt(customerId),
        items: items.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) }))
      });
      setAlert({ type: 'success', msg: 'Order created successfully' });
      setShowModal(false);
      setCustomerId('');
      setItems([{ product_id: '', quantity: '' }]);
      load();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.detail || 'Order creation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;
    try {
      await deleteOrder(id);
      setAlert({ type: 'success', msg: 'Order cancelled and stock restored' });
      load();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.detail || 'Failed to cancel order' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setErrors({}); setShowModal(true); }}>
          + New Order
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>
          {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
          <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-text">Create your first order to get started.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#ORD-{String(o.id).padStart(4, '0')}</strong></td>
                  <td>{o.customer?.full_name || `Customer #${o.customer_id}`}</td>
                  <td>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                  <td><strong>${o.total_amount.toFixed(2)}</strong></td>
                  <td><span className="badge badge-success">{o.status}</span></td>
                  <td style={{ color: '#6b7280', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/orders/${o.id}`} className="btn btn-ghost btn-sm">View</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Cancel</button>
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
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Order</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Customer *</label>
              <select className={errors.customer ? 'error' : ''} value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">Select a customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
              </select>
              {errors.customer && <span className="field-error">{errors.customer}</span>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>Order Items *</label>
                <button className="btn btn-ghost btn-sm" onClick={addItem}>+ Add Item</button>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: 8, marginBottom: 8, alignItems: 'start' }}>
                  <div>
                    <select
                      className={errors[`product_${i}`] ? 'error' : ''}
                      value={item.product_id}
                      onChange={e => updateItem(i, 'product_id', e.target.value)}
                    >
                      <option value="">Select product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)} ({p.quantity} in stock)</option>
                      ))}
                    </select>
                    {errors[`product_${i}`] && <span className="field-error">{errors[`product_${i}`]}</span>}
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className={errors[`qty_${i}`] ? 'error' : ''}
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', e.target.value)}
                    />
                    {errors[`qty_${i}`] && <span className="field-error">{errors[`qty_${i}`]}</span>}
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 18, padding: '8px 4px', lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
