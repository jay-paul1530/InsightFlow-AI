"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Database, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  Terminal, 
  Table,
  User,
  AlertCircle,
  Trash2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import HeroSection from "./HeroSection";

interface Session {
  session_id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

interface Message {
  role: "user" | "ai";
  message: string;
  created_at?: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showHero, setShowHero] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load all sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle auto-growing textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/v1/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to load chat sessions. Please ensure the backend is running.");
    } finally {
      setInitialLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    setError(null);
    setLoading(true);
    setActiveSessionId(sessionId);
    setSidebarOpen(false);
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages for session");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load message history.");
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setInput("");
    setSidebarOpen(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat session?")) return;
    
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete session");
      
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      fetchSessions();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete the session. Please try again.");
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setError(null);
    setLoading(true);

    // Optimistically append user message
    const userMessage: Message = {
      role: "user",
      message: userQuery,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const params = new URLSearchParams({ user_input: userQuery });
      if (activeSessionId) {
        params.append("session_id", activeSessionId);
      }

      const res = await fetch(`/api/v1/chat?${params.toString()}`);
      if (!res.ok) throw new Error("Server responded with an error");
      const data = await res.json();

      // Append AI message
      const aiMessage: Message = {
        role: "ai",
        message: data.result,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // If it's a new session, set the active session and refresh sidebar
      if (!activeSessionId && data.session_id) {
        setActiveSessionId(data.session_id);
        fetchSessions();
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to get response from the Text2SQL Assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  // SQL syntax highlighter returning React elements
  const renderHighlightedSql = (sqlText: string) => {
    // Basic regex-based tokenizer
    const tokens = sqlText.split(/(\s+|\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bON\b|\bGROUP\b|\bORDER\b|\bBY\b|\bLIMIT\b|\bAND\b|\bOR\b|\bAS\b|\bIN\b|\bCOUNT\b|\bSUM\b|\bAVG\b|\bMIN\b|\bMAX\b|\bLEFT\b|\bRIGHT\b|\bINNER\b|\bOUTER\b|\bHAVING\b|\bUNION\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bCREATE\b|\bTABLE\b|\bDROP\b|'[^']*'|--.*)/gi);
    
    return tokens.map((token, idx) => {
      const upper = token.toUpperCase();
      if ([
        "SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP", "ORDER", "BY", 
        "LIMIT", "AND", "OR", "AS", "IN", "LEFT", "RIGHT", "INNER", 
        "OUTER", "HAVING", "UNION", "INSERT", "UPDATE", "DELETE", 
        "CREATE", "TABLE", "DROP"
      ].includes(upper)) {
        return <span key={idx} className="sql-keyword">{token}</span>;
      }
      if (["COUNT", "SUM", "AVG", "MIN", "MAX"].includes(upper)) {
        return <span key={idx} className="sql-function">{token}</span>;
      }
      if (token.startsWith("'") && token.endsWith("'")) {
        return <span key={idx} className="sql-string">{token}</span>;
      }
      if (token.startsWith("--")) {
        return <span key={idx} className="sql-comment">{token}</span>;
      }
      return token;
    });
  };

  const suggestions = [
    {
      title: "Popular Products",
      prompt: "Find top 5 best selling products by revenue.",
      icon: <Sparkles size={16} />
    },
    {
      title: "Stock Alert",
      prompt: "Show me all products with less than 10 units in inventory.",
      icon: <Database size={16} />
    },
    {
      title: "Order Tracking",
      prompt: "List the most recent 10 orders with total amount and order date.",
      icon: <Terminal size={16} />
    },
    {
      title: "Customer Insights",
      prompt: "Get count of customers grouped by city.",
      icon: <Table size={16} />
    }
  ];

  if (showHero) {
    return <HeroSection onGetStarted={() => setShowHero(false)} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div 
            className="logo-section" 
            onClick={() => setShowHero(true)} 
            style={{ cursor: "pointer" }}
            title="Go to Home"
          >
            <Database className="logo-icon" size={20} />
            <span>QueryLens</span>
          </div>
          {sidebarOpen && (
            <button className="menu-toggle" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <button className="new-chat-btn" onClick={startNewChat}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div className="sessions-container">
          <div className="sessions-label">Recent Chats</div>
          {initialLoading ? (
            <div style={{ padding: "0 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Loading history...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: "0 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No previous chats
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.session_id}
                className={`session-item ${activeSessionId === session.session_id ? "active" : ""}`}
                onClick={() => loadSessionMessages(session.session_id)}
              >
                <div className="session-info-left">
                  <span className="session-title">{session.title || "Untitled Chat"}</span>
                  <span className="session-date">{formatDate(session.updated_at || session.created_at)}</span>
                </div>
                <button
                  className="delete-session-btn"
                  onClick={(e) => handleDeleteSession(e, session.session_id)}
                  title="Delete Session"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Dipesh Pal</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="chat-container">
        {/* Mobile Header */}
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div 
            className="logo-section" 
            onClick={() => setShowHero(true)} 
            style={{ cursor: "pointer" }}
            title="Go to Home"
          >
            <Database className="logo-icon" size={18} />
            <span>QueryLens</span>
          </div>
        </header>

        {/* Messages Viewport */}
        <div className="messages-viewport">
          {messages.length === 0 && !loading ? (
            /* Welcome Screen */
            <div className="welcome-screen">
              <div className="welcome-icon-wrapper">
                <Sparkles size={32} />
              </div>
              <h1 className="welcome-title">Ask your E-commerce Database</h1>
              <p className="welcome-subtitle">
                I am your Text-to-SQL E-commerce AI. Write natural language questions, and I will generate optimized SQL queries and retrieve the correct answers for you.
              </p>
              
              <div className="suggestions-grid">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(s.prompt)}
                  >
                    <div className="suggestion-header">
                      {s.icon}
                      <span>{s.title}</span>
                    </div>
                    <p className="suggestion-prompt">{s.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="messages-list">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.role === "user" ? "user" : "ai"}`}>
                  <div className="message-icon">
                    {msg.role === "user" ? <User size={18} /> : <Database size={18} />}
                  </div>
                  <div className="message-content-wrapper">
                    <div className="message-bubble">
                      <div className="markdown-body">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Handle tables nicely
                            table({ children }) {
                              return (
                                <div className="table-container">
                                  <table>{children}</table>
                                </div>
                              );
                            },
                            // Custom code block rendering with Copy button and syntax highlighting
                            code({ node, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || "");
                              const codeContent = String(children).replace(/\n$/, "");
                              const isSql = match && match[1]?.toLowerCase() === "sql";
                              
                              if (match) {
                                return (
                                  <div className="code-container">
                                    <div className="code-header">
                                      <span>{match[1]}</span>
                                      <button
                                        className="copy-code-btn"
                                        onClick={() => {
                                          navigator.clipboard.writeText(codeContent);
                                        }}
                                      >
                                        Copy
                                      </button>
                                    </div>
                                    <pre>
                                      <code className={className} {...props}>
                                        {isSql ? renderHighlightedSql(codeContent) : codeContent}
                                      </code>
                                    </pre>
                                  </div>
                                );
                              }
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {msg.created_at && (
                      <span className="message-time">{formatDate(msg.created_at)}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing/Thinking Indicator */}
              {loading && (
                <div className="message-row ai">
                  <div className="message-icon">
                    <Database size={18} />
                  </div>
                  <div className="message-content-wrapper">
                    <div className="message-bubble">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div style={{
                  display: "flex",
                  gap: "12px",
                  backgroundColor: "rgba(248, 81, 73, 0.1)",
                  border: "1px solid rgba(248, 81, 73, 0.4)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ff7b72",
                  fontSize: "0.9rem",
                  alignItems: "center",
                  maxWidth: "800px",
                  margin: "0 auto",
                  width: "100%"
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <footer className="input-panel">
          <form onSubmit={handleSend} className="input-container">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Ask a question about sales, products, inventory..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <div className="input-actions">
              <span className="input-hints">
                Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline
              </span>
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || loading}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </footer>
      </main>
    </div>
  );
}
