import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../api';
import './UserDashboard.css';

export default function UserDashboard({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData(user.token).then((res) => {
      if (res && Array.isArray(res.purchases)) {
        setData(res);
      } else {
        setData({ purchases: [] });
      }
    });
  }, [user]);

  if (!data) return <div className="loading">Loading...</div>;

  const purchases = Array.isArray(data.purchases) ? data.purchases : [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user.name}!</h1>
      <h2 className="purchases-title">Your Purchases</h2>
      {purchases.length === 0 ? (
        <p className="no-purchases">You have no purchases yet.</p>
      ) : (
        <table className="purchases-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((item, index) => (
              <tr key={`${item.productId}-${index}`}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.referenceId || '—'}</td>
                <td>₹{item.amount || '—'}</td>
                <td>
                  {item.status === 'Approved' && item.downloadLink ? (
                    <a href={item.downloadLink} download className="download-link">
                      <button className="download-button">Download</button>
                    </a>
                  ) : (
                    <span className="pending-text">Pending Approval</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}