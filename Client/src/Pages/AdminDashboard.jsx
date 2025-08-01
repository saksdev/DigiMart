import React, { useEffect, useState } from 'react';
import {
  fetchDashboardData,
  approvePayment,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../api';
import './AdminDashboard.css';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState({ users: [], products: [] });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', downloadLink: '', discount: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) return;

    fetchDashboardData(user.token)
      .then((res) => {
        if (res?.isAdmin) {
          setData({
            users: res.users || [],
            products: res.products || [],
          });
        }
      })
      .catch(() => {
        window.showNotification?.('Error fetching dashboard data', 'error');
      })
      .finally(() => setLoading(false));

    fetch(`${API_URL}/admin/payments/pending`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((payments) => setPendingPayments(payments || []))
      .catch(() => {
        window.showNotification?.('Error fetching pending payments', 'error');
      });

    fetch(`${API_URL}/admin/payments/approved`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((payments) => setApprovedPayments(payments || []))
      .catch(() => {
        window.showNotification?.('Error fetching approved payments', 'error');
      });
  }, [user]);

  async function handleApprove(paymentId) {
    try {
      await approvePayment(paymentId, user.token);
      setPendingPayments((prev) => prev.filter((p) => p._id !== paymentId));
      window.showNotification?.('Payment approved', 'success');

      const res = await fetch(`${API_URL}/admin/payments/approved`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const payments = await res.json();
      setApprovedPayments(payments || []);
    } catch (err) {
      window.showNotification?.('Failed to approve payment', 'error');
    }
  }

  async function handleReject(paymentId) {
    try {
      const res = await fetch(`${API_URL}/admin/payments/${paymentId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to reject payment');
      }

      setPendingPayments((prev) => prev.filter((p) => p._id !== paymentId));
      window.showNotification?.('Payment rejected', 'info');
    } catch (err) {
      window.showNotification?.('Failed to reject payment', 'error');
    }
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId, user.token);
      setData((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p._id !== productId),
      }));
      window.showNotification?.('Product deleted', 'success');
    } catch (err) {
      window.showNotification?.('Failed to delete product', 'error');
    }
  }

  async function handleProductSubmit(e) {
    e.preventDefault();
    try {
      const productData = {
        name: form.name,
        price: Number(form.price),
        image: form.image,
        description: form.description,
        downloadLink: form.downloadLink,
        discount: Number(form.discount) || 0,
      };
      if (editingProduct) {
        const updated = await updateProduct(editingProduct._id, productData, user.token);
        setData((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p._id === editingProduct._id ? updated.product : p
          ),
        }));
        window.showNotification?.('Product updated', 'success');
        setEditingProduct(null);
      } else {
        const created = await createProduct(productData, user.token);
        setData((prev) => ({
          ...prev,
          products: [...prev.products, created.product],
        }));
        window.showNotification?.('Product created', 'success');
      }
      setForm({ name: '', price: '', image: '', description: '', downloadLink: '', discount: '' });
    } catch (err) {
      window.showNotification?.('Failed to save product', 'error');
    }
  }

  if (!user?.isAdmin) return <div className="access-denied">Access Denied</div>;
  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {['products', 'users', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Management */}
      {activeTab === 'products' && (
        <section className="products-section">
          <h2 className="section-title">Manage Products</h2>
          <form onSubmit={handleProductSubmit} className="product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="form-input"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input"
              rows="4"
            />
            <input
              type="text"
              placeholder="Download Link"
              value={form.downloadLink}
              onChange={(e) => setForm({ ...form, downloadLink: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="form-input"
              min="0"
              max="100"
            />
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {data.products.length === 0 ? (
            <p className="no-data">No products found.</p>
          ) : (
            <div className="products-list">
              {data.products.map((prod) => (
                <div key={prod._id} className="product-item">
                  <div className="product-info">
                    <strong>{prod.name}</strong> — ₹{prod.price}
                    {prod.discount > 0 && (
                      <span className="discount-info">
                        {' '}
                        (Discount: {prod.discount}% → ₹{Math.round(prod.price * (1 - prod.discount / 100))})
                      </span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => {
                        setForm({
                          name: prod.name,
                          price: prod.price,
                          image: prod.image || '',
                          description: prod.description || '',
                          downloadLink: prod.downloadLink,
                          discount: prod.discount || '',
                        });
                        setEditingProduct(prod);
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Users List */}
      {activeTab === 'users' && (
        <section className="users-section">
          <h2 className="section-title">Registered Users</h2>
          {data.users.length === 0 ? (
            <p className="no-data">No users found.</p>
          ) : (
            <div className="users-list">
              {data.users.map((u) => (
                <div key={u._id} className="user-item">
                  <p>
                    {u.name} ({u.email}) - {u.isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Payments Section */}
      {activeTab === 'payments' && (
        <section className="payments-section">
          <h2 className="section-title">Pending Payments</h2>
          {pendingPayments.length === 0 ? (
            <p className="no-data">No pending payments.</p>
          ) : (
            <div className="payments-list">
              {pendingPayments.map((p) => (
                <div key={p._id} className="payment-item">
                  <div className="payment-info">
                    <p>
                      <strong>User:</strong> {p.userId?.email || 'Unknown'}<br />
                      <strong>Txn ID:</strong> {p.referenceId}<br />
                      <strong>Amount:</strong> ₹{p.amount}
                    </p>
                  </div>
                  <div className="payment-actions">
                    <button
                      onClick={() => handleApprove(p._id)}
                      className="approve-button"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(p._id)}
                      className="reject-button"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title">Approved Payments</h2>
          {approvedPayments.length === 0 ? (
            <p className="no-data">No approved payments.</p>
          ) : (
            <div className="payments-list">
              {approvedPayments.map((p, i) => (
                <div key={i} className="payment-item">
                  <div className="payment-info">
                    <p>
                      <strong>User:</strong> {p.userId?.email || 'Unknown'}<br />
                      <strong>Txn ID:</strong> {p.referenceId}<br />
                      <strong>Amount:</strong> ₹{p.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}