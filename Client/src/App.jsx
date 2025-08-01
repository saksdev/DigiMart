import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Header from './components/Header';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import Productitem from './Pages/Product'
import UPIPaymentModal from './components/UPIPaymentModal';
import NotificationCenter from './components/NotificationCenter';
import './App.css';
import { submitPayment } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  function handleLogin(data) {
    const userData = { ...data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  function handleAddToCart(product) {
    const exists = cartItems.find((item) => item._id === product._id);
    if (!exists) {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      window.showNotification?.(`${product.name} added to cart`, 'success');
    } else {
      window.showNotification?.(`${product.name} is already in your cart`, 'info');
    }
  }

  function handleUpdateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function handleRemoveFromCart(id) {
    setCartItems((items) => items.filter((item) => item._id !== id));
    window.showNotification?.('Item removed from cart', 'info');
  }

  function handleProceedToPayment(total, items) {
    if (!user) {
      window.showNotification?.('Please login to proceed', 'warning');
      return;
    }
    setPaymentData({ total, items });
    setShowCart(false);
    setShowPaymentModal(true);
  }

  async function handleConfirmPayment(referenceId, total, items) {
    const productIds = items.map((item) => item._id);
    const res = await submitPayment(referenceId, total, productIds, user.token);
    if (res.success) {
      window.showNotification?.('Payment submitted successfully. Awaiting admin approval.', 'success');
      setCartItems([]);
      setShowPaymentModal(false);
    } else {
      window.showNotification?.(res.message || 'Payment submission failed', 'error');
    }
  }

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <Header
        user={user}
        cartCount={cartItemCount}
        onLogout={handleLogout}
        onCartOpen={() => setShowCart(true)}
      />
      <NotificationCenter />
      <Routes>
        <Route path="/" element={<Home user={user} onAddToCart={handleAddToCart} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/shop" element={<Shop user={user} onAddToCart={handleAddToCart} />} />
        <Route path="/product/:id" element={<Productitem user={user} onAddToCart={handleAddToCart} />} />
      </Routes>
      {showCart && (
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveFromCart}
          onCheckout={handleProceedToPayment}
          onClose={() => setShowCart(false)}
        />
      )}
      {showPaymentModal && paymentData && (
        <UPIPaymentModal
          total={paymentData.total}
          items={paymentData.items}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </Router>
  );
}