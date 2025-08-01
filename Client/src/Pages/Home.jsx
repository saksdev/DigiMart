import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShoppingCart, Star, Shield } from 'lucide-react';
import './Css/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover the Best Online Tools</h1>
          <p className="hero-subtitle">
            Empower your work with our curated collection of premium digital tools designed for efficiency and creativity.
          </p>
          <Link to="/shop" className="hero-button">
            <ShoppingCart className="button-icon" />
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="features-title">Why Choose Our Tools?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Wrench className="feature-icon" />
              <h3 className="feature-title">High Quality</h3>
              <p className="feature-description">
                Our tools are crafted for performance, reliability, and ease of use.
              </p>
            </div>
            <div className="feature-card">
              <Star className="feature-icon" />
              <h3 className="feature-title">Top Rated</h3>
              <p className="feature-description">
                Trusted by thousands of users with stellar reviews.
              </p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3 className="feature-title">Secure</h3>
              <p className="feature-description">
                Safe purchases with secure payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Boost Your Productivity?</h2>
          <p className="cta-subtitle">
            Explore our collection of tools and find the perfect solution for your needs.
          </p>
          <Link to="/shop" className="cta-button">
            <ShoppingCart className="button-icon" />
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-brand">MyShop Tools</p>
          <div className="footer-links">
            <Link to="/shop" className="footer-link">Shop</Link>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
          </div>
          <p className="footer-copyright">
            © 2025 MyShop Tools. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}