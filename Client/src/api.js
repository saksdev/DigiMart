// const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://digimart-visg.onrender.com/api';

// Register a new user
export async function registerUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network error during registration.' };
  }
}

// Login existing user
export async function loginUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network error during login.' };
  }
}

// Fetch all available products (for store page)
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to fetch products.' };
  }
}

// Submit UPI payment reference (user uploads referenceId + cart)
export async function submitPayment(reference, amount, productIds, token) {
  try {
    const res = await fetch(`${API_URL}/payments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ referenceId: reference, amount, productIds }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Payment submission failed.' };
  }
}

// Create a new product (admin only)
export async function createProduct(data, token) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to create product.' };
  }
}

// Update an existing product (admin only)
export async function updateProduct(productId, data, token) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update product.' };
  }
}

// Delete a product (admin only)
export async function deleteProduct(productId, token) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to delete product.' };
  }
}

// Fetch dashboard data for regular users
export async function fetchDashboardData(token) {
  try {
    const res = await fetch(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to load dashboard.' };
  }
}

// Approve a user's payment (admin only)
export async function approvePayment(paymentId, token) {
  try {
    const res = await fetch(`${API_URL}/admin/payments/${paymentId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Payment approval failed.' };
  }
}

// Reject a user's payment (admin only)
export async function rejectPayment(paymentId, token) {
  try {
    const res = await fetch(`${API_URL}/admin/payments/${paymentId}/reject`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to reject payment');
    }
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Payment rejection failed.' };
  }
}

// Fetch all pending payments (admin only)
export async function fetchPendingPayments(token) {
  try {
    const res = await fetch(`${API_URL}/admin/payments/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to fetch pending payments.' };
  }
}

// Fetch all approved payments (admin only)
export async function fetchApprovedPayments(token) {
  try {
    const res = await fetch(`${API_URL}/admin/payments/approved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to fetch approved payments.' };
  }
}

// Fetch all users (admin only)
export async function fetchUsers(token) {
  try {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return [];
  }
}