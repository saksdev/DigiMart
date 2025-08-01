import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api';
import { ShoppingCart } from 'lucide-react';
import './Css/Product.css';

export default function Product({ user, onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((res) => {
      if (res.success !== false) {
        const foundProduct = res.find((p) => (p._id || p.id) === id);
        setProduct(foundProduct);
        setLoading(false);
      }
    });
  }, [id]);

  function handleAdd() {
    if (!user) {
      window.showNotification?.('Please login to add to cart.', 'warning');
      navigate('/login');
      return;
    }
    onAddToCart(product);
  }

  if (loading) {
    return <div className="product-loading">Loading...</div>;
  }

  if (!product) {
    return <div className="product-not-found">Product not found.</div>;
  }

  return (
    <div className="product-container">
      <div className="product-content">
        <img
          src={product.image || 'https://placehold.co/400x300/png'}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price-container">
            {product.discount ? (
              <>
                <span className="product-original-price">₹{product.price}</span>
                <span className="product-discounted-price">
                  ₹{Math.round(product.price * (1 - product.discount / 100))}
                </span>
                <span className="discount-badge">{product.discount}% OFF</span>
              </>
            ) : (
              <span className="product-price">₹{product.price}</span>
            )}
          </div>
          <p className="product-description">{product.description || 'No description available.'}</p>
          <button onClick={handleAdd} className="add-to-cart-button">
            <ShoppingCart className="cart-icon" />
            Add to Cart
          </button>
          <button onClick={() => navigate('/shop')} className="back-to-shop-button">
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
}