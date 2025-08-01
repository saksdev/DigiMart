import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import './auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      window.showNotification('All fields are required.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      if (data.success) {
        window.showNotification('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        window.showNotification(data.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      window.showNotification('Unable to register. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us today to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" aria-label="Registration form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} aria-hidden="true" />
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-describedby="name-error"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} aria-hidden="true" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-describedby="email-error"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} aria-hidden="true" />
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                aria-describedby="password-error"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
            aria-label={loading ? 'Registering...' : 'Register'}
          >
            {loading ? (
              <div className="loading-spinner" aria-hidden="true"></div>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight size={20} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" aria-label="Navigate to login page">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}