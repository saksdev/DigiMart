import React, { useEffect, useRef } from 'react';
import { ShoppingCart, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './Cart.css';

export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout, onClose }) {
  // Calculate total considering discounts
  const total = items.reduce((acc, item) => {
    const price = item.discount
      ? Math.round(item.price * (1 - item.discount / 100)) * item.quantity
      : item.price * item.quantity;
    return acc + price;
  }, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="cart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={cartRef}
        className="cart-container"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-content">
            <div className="cart-header-icon">
              <ShoppingCart className="icon" />
            </div>
            <div>
              <h2 className="cart-title">Your Cart</h2>
              <p className="cart-item-count">{itemCount} items</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="cart-close-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="icon" />
          </motion.button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <motion.div
              className="cart-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="cart-empty-icon">🛒</div>
              <p className="cart-empty-text">Your cart is empty</p>
            </motion.div>
          ) : (
            <div className="cart-items-list">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="cart-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="cart-item-details">
                      <div className="cart-item-image">
                        <img
                          src={item.image || 'https://placehold.co/80x80/png'}
                          alt={item.name}
                          className="cart-item-img"
                        />
                      </div>
                      <div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-price-container">
                          {item.discount ? (
                            <>
                              <span className="cart-item-original-price">
                                ₹{item.price}
                              </span>
                              <span className="cart-item-discounted-price">
                                ₹{Math.round(item.price * (1 - item.discount / 100))}
                              </span>
                            </>
                          ) : (
                            <span className="cart-item-price">₹{item.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="cart-item-controls">
                      <span className="cart-item-quantity">Qty: {item.quantity}</span>
                      <motion.button
                        onClick={() => onRemove(item._id)}
                        className="cart-remove-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="control-icon" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Total and Checkout */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              className="cart-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="cart-total">
                <span className="cart-total-label">Total:</span>
                <span className="cart-total-amount">₹{total}</span>
              </div>
              <motion.button
                onClick={() => onCheckout(total, items)}
                className="cart-checkout-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCard className="button-icon" />
                Proceed to Payment
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}