'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Menu, 
  X, 
  Database, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Trash2,
  Settings,
  LogOut
} from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionTitle, setCurrentSessionTitle] = useState('New Query');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const viewportRef = useRef(null);

  // Suggestions for empty chat state
  const suggestions = [
    {
      title: "Top Selling Products",
      desc: "Analyze top selling products by category and volume",
      query: "Show the top selling products by category and total revenue.",
      icon: <ShoppingBag size={15} />
    },
    {
      title: "Revenue Analysis",
      desc: "Break down revenue by payment method and timeline",
      query: "Show monthly revenue trends and average order values by payment method.",
      icon: <TrendingUp size={15} />
    },
    {
      title: "Customer Insights",
      desc: "Identify active customers and geographic shipping spread",
      query: "Analyze order status and customer distribution by shipping address.",
      icon: <CreditCard size={15} />
    },
    {
      title: "Generate SQL Query",
      desc: "Write custom PostgreSQL query statements safely",
      query: "Write a SQL query to select all orders with payment method 'Credit Card' and totalprice > 100.",
      icon: <Database size={15} />
    }
  ];

  // Authenticate route guard and fetch sessions
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    window.location.href = '/login';
  };

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
      setError('Backend unavailable. Make sure your database and API services are running.');
    }
  };

  const loadSession = async (sessionId) => {
    if (!sessionId) {
      setCurrentSessionId(null);
      setCurrentSessionTitle('New Query');
      setMessages([]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setCurrentSessionId(sessionId);
      setCurrentSessionTitle(data.title || 'SQL Query');
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load session details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setError(null);
    setLoading(true);
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Optimistically add user message to list
    const userMessage = {
      role: 'user',
      message: query,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let url = `${API_URL}/api/v1/chat?user_input=${encodeURIComponent(query)}`;
      if (currentSessionId) {
        url += `&session_id=${currentSessionId}`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('API server returned an error');
      const data = await res.json();

      // Add AI response
      const aiMessage = {
        role: 'ai',
        message: data.result,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // If it was a new session, update active session ID and refresh sidebar
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        setCurrentSessionTitle(query.substring(0, 15));
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to receive response from analyst agent.');
      // Remove optimistic user message on hard failure so they can retry
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setCurrentSessionTitle('New Query');
    setMessages([]);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this session?')) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete session');
      if (currentSessionId === sessionId) {
        startNewChat();
      }
      fetchSessions();
    } catch (err) {
      console.error(err);
      setError('Failed to delete session.');
    }
  };

  // Grouping sessions for premium sidebar look
  const getGroupedSessions = () => {
    const today = [];
    const previous = [];

    const todayDate = new Date().toDateString();

    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at).toDateString();
      if (sessionDate === todayDate) {
        today.push(session);
      } else {
        previous.push(session);
      }
    });

    return { today, previous };
  };

  const { today, previous } = getGroupedSessions();

  return (
    <div className="app-container">
      {/* Sidebar Panel */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="brand hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
            <span className="brand-dot" />
            <span>InsightFlow AI</span>
          </a>
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(true)}
            title="Collapse sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={startNewChat}>
          <Plus size={16} />
          <span>New Query</span>
        </button>

        <div className="sessions-list-container">
          {today.length > 0 && (
            <div className="sessions-group">
              <div className="sessions-group-title">Today</div>
              {today.map(session => (
                <div 
                  key={session.session_id} 
                  className={`session-item ${currentSessionId === session.session_id ? 'active' : ''}`}
                  onClick={() => loadSession(session.session_id)}
                >
                  <div className="session-info">
                    <MessageSquare size={14} className="text-secondary" />
                    <span className="session-title">{session.title || 'SQL Session'}</span>
                  </div>
                  <button 
                    className="delete-session-btn"
                    onClick={(e) => handleDeleteSession(session.session_id, e)}
                    title="Delete session"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {previous.length > 0 && (
            <div className="sessions-group">
              <div className="sessions-group-title">Previous Days</div>
              {previous.map(session => (
                <div 
                  key={session.session_id} 
                  className={`session-item ${currentSessionId === session.session_id ? 'active' : ''}`}
                  onClick={() => loadSession(session.session_id)}
                >
                  <div className="session-info">
                    <MessageSquare size={14} className="text-secondary" />
                    <span className="session-title">{session.title || 'SQL Session'}</span>
                  </div>
                  <button 
                    className="delete-session-btn"
                    onClick={(e) => handleDeleteSession(session.session_id, e)}
                    title="Delete session"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {sessions.length === 0 && (
            <div style={{ padding: '24px 16px', textAlignment: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No history found
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '12px' }}>
            <button 
              className="sidebar-settings-btn"
              onClick={() => window.location.href = '/settings'}
              title="Settings"
              style={{ flex: 1 }}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <button 
              className="sidebar-settings-btn"
              onClick={handleLogout}
              title="Log Out"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
          <div className="user-profile">
            <div className="avatar">JP</div>
            <div className="user-info">
              <span className="user-name">Jay Paul</span>
              <span className="user-role">Developer Profile</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <main className="main-content">
        <div className="hero-glow" />
        {/* Floating Sidebar Toggle - Appears when sidebar is collapsed */}
        {sidebarCollapsed && (
          <button 
            className="floating-menu-btn" 
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
          >
            <Menu size={16} />
          </button>
        )}

        {/* Message Area */}
        <div className="messages-viewport" ref={viewportRef}>
          {error && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: 'var(--danger)', 
              maxWidth: '680px', 
              margin: '0 auto 16px auto',
              width: '100%',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="welcome-container">
              <div className="welcome-logo">
                <Sparkles size={24} />
              </div>
              <h2 className="welcome-title">InsightFlow AI</h2>
              <p className="welcome-desc">
                AI-powered SQL and database analytics
              </p>

              <div className="suggestions-grid">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    className="suggestion-card"
                    onClick={() => handleSendMessage(s.query)}
                  >
                    <div className="suggestion-card-icon">
                      {s.icon}
                    </div>
                    <div className="suggestion-card-content">
                      <span className="suggestion-card-title">{s.title}</span>
                      <span className="suggestion-card-desc">{s.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="message-bubble">
                  {msg.role === 'user' ? (
                    <p>{msg.message}</p>
                  ) : (
                    <MarkdownRenderer content={msg.message} />
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="loading-wrapper">
              <div className="message-avatar" style={{ background: 'var(--accent-gradient)', color: '#fff' }}>
                AI
              </div>
              <div className="shimmer-bubble">
                <div className="shimmer-line" />
                <div className="shimmer-line" />
                <div className="shimmer-line" />
              </div>
            </div>
          )}

          <div className="scroll-anchor" ref={messagesEndRef} />
        </div>

        {/* ChatGPT style Floating Prompt Input Panel */}
        <div className="input-panel">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Ask InsightFlow AI a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading}
            />
            <div className="input-actions">
              <span className="input-meta-text">Press Enter to query</span>
              <button 
                className="send-btn" 
                onClick={() => handleSendMessage()}
                disabled={loading || !inputValue.trim()}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <p className="disclaimer">
            InsightFlow AI can write and execute database queries.
          </p>
        </div>
      </main>
    </div>
  );
}
