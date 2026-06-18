'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to chat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/chat';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed. Please check your credentials.');
      }

      // Save token and email to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_email', data.email);

      // Redirect to chat workspace
      window.location.href = '/chat';
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to connect to the login service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <div className="hero-glow" />
      
      <div className="settings-card" style={{ maxWidth: '28rem', width: '100%', margin: '0 1rem', padding: '2.5rem' }}>
        <div className="settings-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="welcome-logo" style={{ margin: '0 auto 1.5rem auto' }}>
            <Sparkles size={24} />
          </div>
          <h2 className="settings-title" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p className="settings-subtitle">Login to access the InsightFlow AI platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input 
              type="email" 
              id="email"
              className="settings-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              id="password"
              className="settings-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="settings-alert error" style={{ margin: '0.5rem 0 0 0' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="save-btn" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" size={16} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
