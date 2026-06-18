'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Save, AlertCircle, CheckCircle2, Loader2, Play, ShieldAlert } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export default function SettingsPage() {
  const [isManual, setIsManual] = useState(false);
  const [dbUrl, setDbUrl] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(5432);
  const [databaseName, setDatabaseName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sslMode, setSslMode] = useState('prefer');

  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setIsManual(data.is_manual || false);
      setDbUrl(data.database_url || '');
      setHost(data.host || '');
      setPort(data.port || 5432);
      setDatabaseName(data.database_name || '');
      setUsername(data.username || '');
      setPassword(data.password || '');
      setSslMode(data.ssl_mode || 'prefer');
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend settings service.');
    } finally {
      setFetching(false);
    }
  };

  const handleTestConnection = async (e) => {
    e.preventDefault();
    if (!isManual && !dbUrl.trim()) {
      setError('Database URL cannot be empty');
      return;
    }
    if (isManual && (!host.trim() || !port || !databaseName.trim() || !username.trim() || !password.trim())) {
      setError('Please fill in all manual connection parameters to test connection.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setTestingConnection(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        is_manual: isManual,
        connection_string: isManual ? null : dbUrl.trim(),
        database_url: isManual ? null : dbUrl.trim(),
        host: isManual ? host.trim() : null,
        port: isManual ? parseInt(port) : null,
        database_name: isManual ? databaseName.trim() : null,
        username: isManual ? username.trim() : null,
        password: isManual ? password.trim() : null,
        ssl_mode: isManual ? sslMode : 'prefer'
      };

      const res = await fetch(`${API_URL}/api/v1/settings/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Connection test failed');
      }

      setMessage('Connection tested successfully! Credentials are valid.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isManual && !dbUrl.trim()) {
      setError('Database URL cannot be empty');
      return;
    }
    if (isManual && (!host.trim() || !port || !databaseName.trim() || !username.trim() || !password.trim())) {
      setError('Please fill in all manual connection parameters');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        is_manual: isManual,
        connection_string: isManual ? null : dbUrl.trim(),
        database_url: isManual ? null : dbUrl.trim(),
        host: isManual ? host.trim() : null,
        port: isManual ? parseInt(port) : null,
        database_name: isManual ? databaseName.trim() : null,
        username: isManual ? username.trim() : null,
        password: isManual ? password.trim() : null,
        ssl_mode: isManual ? sslMode : 'prefer'
      };

      const res = await fetch(`${API_URL}/api/v1/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to update settings');
      }

      setMessage('Settings updated successfully! Redirecting to chat...');
      setTimeout(() => {
        window.location.href = '/chat';
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="hero-glow" />
      
      <div className="settings-card" style={{ maxWidth: '42rem' }}>
        <div className="settings-header">
          <button 
            className="back-btn" 
            onClick={() => window.location.href = '/chat'}
            title="Back to chat"
          >
            <ArrowLeft size={16} />
            <span>Back to Chat</span>
          </button>
          <h2 className="settings-title">Database Settings</h2>
          <p className="settings-subtitle">Configure your database connections and parameters.</p>
        </div>

        {fetching ? (
          <div className="settings-loading">
            <Loader2 className="spinner" size={24} />
            <span>Loading settings...</span>
          </div>
        ) : (
          <form className="settings-form">
            <div className="settings-tabs">
              <button 
                type="button"
                className={`settings-tab ${!isManual ? 'active' : ''}`}
                onClick={() => { setIsManual(false); setError(null); setMessage(null); }}
              >
                Connection URL
              </button>
              <button 
                type="button"
                className={`settings-tab ${isManual ? 'active' : ''}`}
                onClick={() => { setIsManual(true); setError(null); setMessage(null); }}
              >
                Manual Parameters
              </button>
            </div>

            {!isManual ? (
              <div className="form-group" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <label htmlFor="database-url" className="form-label">
                  <Database size={14} />
                  <span>Database Connection URL</span>
                </label>
                <input 
                  type="text" 
                  id="database-url"
                  className="settings-input"
                  placeholder="postgresql://user:password@hostname:port/database"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  disabled={loading || testingConnection}
                />
                <p className="form-help">
                  Enter your connection string (e.g. PostgreSQL, SQLite, MySQL). The backend will connect to this database and automatically initialize the schema.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="host" className="form-label">Host</label>
                    <input 
                      type="text" 
                      id="host"
                      className="settings-input"
                      placeholder="e.g. localhost or aws-db.supabase.co"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      disabled={loading || testingConnection}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="port" className="form-label">Port</label>
                    <input 
                      type="number" 
                      id="port"
                      className="settings-input"
                      placeholder="5432"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      disabled={loading || testingConnection}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="databaseName" className="form-label">Database Name</label>
                  <input 
                    type="text" 
                    id="databaseName"
                    className="settings-input"
                    placeholder="e.g. postgres"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                    disabled={loading || testingConnection}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                      type="text" 
                      id="username"
                      className="settings-input"
                      placeholder="e.g. postgres"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading || testingConnection}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password" 
                      id="password"
                      className="settings-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading || testingConnection}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="sslMode" className="form-label">
                    <ShieldAlert size={14} />
                    <span>SSL Mode</span>
                  </label>
                  <select 
                    id="sslMode"
                    className="settings-input"
                    value={sslMode}
                    onChange={(e) => setSslMode(e.target.value)}
                    disabled={loading || testingConnection}
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    <option value="prefer">prefer (Default)</option>
                    <option value="require">require</option>
                    <option value="disable">disable</option>
                    <option value="allow">allow</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="settings-alert error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="settings-alert success">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="save-btn" 
                onClick={handleTestConnection}
                disabled={loading || testingConnection}
                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'none' }}
              >
                {testingConnection ? (
                  <>
                    <Loader2 className="spinner" size={14} />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              <button 
                type="submit" 
                className="save-btn" 
                onClick={handleSave}
                disabled={loading || testingConnection}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="spinner" size={14} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

