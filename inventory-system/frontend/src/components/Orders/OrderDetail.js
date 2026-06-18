import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then(res => setOrder(res.data))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /> Loading order...</div>;
  if (error) return <div className="alert alert-error">⚠️ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order #ORD-{String(order.id).padStart(4, '0')}</h1>
          <p className="page-subtitle">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <Link to="/orders" className="btn btn-ghost">← Back to Orders</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 className="card-title">Customer</h2>
          <p style={{ fontWeight: 600 }}>{order.customer?.full_name}</p>
          <p style={{ color: '#6b7280', marginTop: 4 }}>{order.customer?.email}</p>
          <p style={{ color: '#6b7280' }}>{order.customer?.phone}</p>
        </div>
        <div className="card">
          <h2 className="card-title">Order Summary</h2>
          <p>Status: <span className="badge badge-success">{order.status}</span></p>
          <p style={{ marginTop: 8 }}>Items: <strong>{order.items?.length || 0}</strong></p>
          <p style={{ marginTop: 4, fontSize: 20, fontWeight: 700, color: '#111827' }}>
            Total: ${order.total_amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Order Items</h2>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.product?.name}</strong></td>
                  <td><code style={{ fontSize: 12, background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{item.product?.sku}</code></td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td><strong>${(item.unit_price * item.quantity).toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                <td><strong>${order.total_amount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
