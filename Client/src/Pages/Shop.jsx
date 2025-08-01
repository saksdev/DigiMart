import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api';
import { ShoppingCart, Info } from 'lucide-react';
import './Css/Shop.css';

export default function Shop({ user, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then((res) => {
      if (res.success !== false) setProducts(res);
    });
  }, []);

  function handleAdd(product) {
    if (!user) {
      window.showNotification?.('Please login to add to cart.', 'warning');
      navigate('/login');
      return;
    }
    onAddToCart(product);
  }

  return (
    <div className="shop-container">
      <h1 className="shop-title">Explore Our Tools</h1>
      {products.length === 0 ? (
        <div className="shop-empty">
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <div className="shop-grid">
          {products.map((product) => (
            <div key={product._id || product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image || 'https://placehold.co/300x200/png'}
                  alt={product.name}
                  className="product-image"
                />
                {product.discount && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-container">
                  {product.discount ? (
                    <>
                      <span className="product-original-price">
                        ₹{product.price}
                      </span>
                      <span className="product-discounted-price">
                        ₹{Math.round(product.price * (1 - product.discount / 100))}
                      </span>
                    </>
                  ) : (
                    <span className="product-price">₹{product.price}</span>
                  )}
                </div>
                <div className="product-buttons">
                  <button
                    onClick={() => handleAdd(product)}
                    className="add-to-cart-button"
                  >
                    <ShoppingCart className="cart-icon" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                    className="more-info-button"
                  >
                    <Info className="info-icon" />
                    More Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}