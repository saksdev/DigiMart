import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import './Css/auth.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      window.showNotification('Please fill in all fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.token && data.user) {
        onLogin(data);
        window.showNotification('Login successful!', 'success');
        navigate('/');
      } else {
        window.showNotification(data.message || 'Invalid email or password.', 'error');
      }
    } catch (err) {
      window.showNotification('Unable to login. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" aria-label="Login form">
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
            aria-label={loading ? 'Logging in...' : 'Sign In'}
          >
            {loading ? (
              <div className="loading-spinner" aria-hidden="true"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" aria-label="Navigate to registration page">Create one here</Link></p>
        </div>
      </div>
    </div>
  );
}