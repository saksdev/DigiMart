import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, LogIn, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './Css/Header.css';

export default function Header({ user, onLogout, cartCount = 0, onCartOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      className="header"
      initial={{ 
        opacity: 0, 
        y: -20,
        x: '-50%' // Start centered immediately
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: '-50%' // Stay centered during animation
      }}
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }}
      style={{
        position: 'fixed',
        top: '0.8rem',
        left: '50%',
        zIndex: 1000
      }}
    >
      <div className="header-container">
        {/* Left Section: Logo and Navigation */}
        <div className="header-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/" className="header-logo">
              DIGIMART
            </Link>
          </motion.div>
          <motion.nav 
            className="header-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/" className="header-nav-link">
              Home
            </Link>
            <Link to="/shop" className="header-nav-link">
              Shop
            </Link>
          </motion.nav>
        </div>

        {/* Right Section: Cart and User Actions */}
        <motion.div 
          className="header-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={onCartOpen}
            className="cart-button"
            aria-label={`Cart with ${cartCount} items`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart style={{ width: '1.2rem', height: '1.2rem' }} />
            <span>Cart</span>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  className="cart-count"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Button - Only visible on mobile */}
          <motion.button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X style={{ width: '1.4rem', height: '1.4rem', color: '#4b5563' }} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu style={{ width: '1.4rem', height: '1.4rem', color: '#4b5563' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Desktop User Actions */}
          <motion.div 
            className="user-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/dashboard" className="user-action-link">
                    <User style={{ width: '1rem', height: '1rem' }} />
                    Dashboard
                  </Link>
                </motion.div>
                <motion.button
                  onClick={onLogout}
                  className="logout-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut style={{ width: '1rem', height: '1rem' }} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="user-action-link">
                    <LogIn style={{ width: '1rem', height: '1rem' }} />
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="user-action-link">
                    <User style={{ width: '1rem', height: '1rem' }} />
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu active"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <nav className="mobile-menu-nav">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/"
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  to="/shop"
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
              </motion.div>
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/dashboard"
                      className="mobile-menu-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User style={{ width: '1rem', height: '1rem' }} />
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-menu-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <LogOut style={{ width: '1rem', height: '1rem' }} />
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className="mobile-menu-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn style={{ width: '1rem', height: '1rem' }} />
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      to="/register"
                      className="mobile-menu-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User style={{ width: '1rem', height: '1rem' }} />
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}