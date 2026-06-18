import React, { useState, useEffect } from 'react';
import { getDashboard } from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">⚠️ {error}</div>;

  const statItems = [
    { icon: '🏷️', label: 'Total Products', value: stats.total_products },
    { icon: '👥', label: 'Total Customers', value: stats.total_customers },
    { icon: '🛒', label: 'Total Orders', value: stats.total_orders },
    { icon: '⚠️', label: 'Low Stock Items', value: stats.low_stock_products.length },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your inventory and orders</p>
        </div>
      </div>

      <div className="stats-grid">
        {statItems.map(item => (
          <div className="stat-card" key={item.label}>
            <div className="stat-icon">{item.icon}</div>
            <div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {stats.low_stock_products.length > 0 && (
        <div className="card">
          <h2 className="card-title">⚠️ Low Stock Products (≤10 units)</h2>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock_products.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><code style={{ fontSize: 12, background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{p.sku}</code></td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {p.quantity} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.low_stock_products.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">All products are well stocked</div>
            <div className="empty-text">No products with 10 or fewer units in stock.</div>
          </div>
        </div>
      )}
    </div>
  );
}
