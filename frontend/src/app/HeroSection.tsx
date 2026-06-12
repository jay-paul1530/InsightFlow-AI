"use client";

import React, { useState, useEffect } from "react";
import { Database, Sparkles, ArrowRight, Terminal, Table, Play, Code } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  // Simulated Interactive Query State Machine
  const [simStep, setSimStep] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const targetInput = "Show our top 3 best-selling products by total revenue";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (simStep === 0) {
      // Step 0: Reset and prepare typing
      setTypedInput("");
      timer = setTimeout(() => setSimStep(1), 1000);
    } else if (simStep === 1) {
      // Step 1: Type the prompt character by character
      if (typedInput.length < targetInput.length) {
        timer = setTimeout(() => {
          setTypedInput(targetInput.slice(0, typedInput.length + 1));
        }, 50);
      } else {
        timer = setTimeout(() => setSimStep(2), 1500);
      }
    } else if (simStep === 2) {
      // Step 2: "AI Thinking" (brief delay)
      timer = setTimeout(() => setSimStep(3), 1200);
    } else if (simStep === 3) {
      // Step 3: Show generated SQL & results table, hold for 5s, then reset
      timer = setTimeout(() => {
        setSimStep(0);
      }, 7000);
    }

    return () => clearTimeout(timer);
  }, [simStep, typedInput]);

  return (
    <div className="hero-page">
      {/* Background glowing effects */}
      <div className="hero-glow hero-glow-top"></div>
      <div className="hero-glow hero-glow-bottom"></div>

      {/* Floating Header */}
      <header className="hero-header">
        <div className="hero-logo" onClick={() => setSimStep(0)}>
          <Database className="logo-icon animate-pulse" size={24} />
          <span className="logo-text">QueryLens AI</span>
        </div>
        <button className="hero-header-btn" onClick={onGetStarted}>
          Launch Console <ArrowRight size={14} />
        </button>
      </header>

      {/* Main Hero Container */}
      <main className="hero-content">
        {/* Decorative Tagline */}
        <div className="hero-pill-badge">
          <Sparkles size={14} className="text-purple-400" />
          <span>Welcome to Our Platform</span>
          <ArrowRight size={12} className="opacity-60" />
        </div>

        {/* Hero Title */}
        <h1 className="hero-headline">
          Transform your database queries into <br />
          <span className="hero-gradient-text">beautiful digital experiences</span>
        </h1>

        {/* Hero Description */}
        <p className="hero-subheadline">
          Ask questions in plain English, and watch our Text-to-SQL AI transform them 
          instantly into optimized SQL queries and rich, interactive data tables.
        </p>

        {/* Hero CTA Button */}
        <div className="hero-cta-group">
          <button className="hero-cta-btn" onClick={onGetStarted}>
            Get Started
          </button>
        </div>

        {/* Live Simulator Mockup */}
        <div className="hero-preview-window">
          <div className="preview-window-header">
            <div className="window-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="window-title">QueryLens Sandbox - demo_db</div>
            <div className="window-status">
              <span className="status-indicator"></span> Connected
            </div>
          </div>

          <div className="preview-window-body">
            {/* Input bar inside simulator */}
            <div className="sim-input-row">
              <span className="sim-prompt-icon">🤖</span>
              <div className="sim-input-box">
                {typedInput}
                {simStep === 1 && <span className="sim-cursor">|</span>}
                {simStep === 0 && <span className="sim-placeholder">Type your natural language query here...</span>}
              </div>
            </div>

            {/* AI thinking state */}
            {simStep === 2 && (
              <div className="sim-status-row">
                <div className="sim-spinner"></div>
                <span>Translating query to SQL & retrieving schema info...</span>
              </div>
            )}

            {/* Results display state */}
            {simStep === 3 && (
              <div className="sim-results-container animate-fade-in">
                {/* Generated SQL block */}
                <div className="sim-code-block">
                  <div className="sim-block-header">
                    <span className="flex items-center gap-1"><Code size={13} /> GENERATED SQL QUERY</span>
                    <span className="code-lang">postgresql</span>
                  </div>
                  <pre className="sim-code">
                    <code>
                      <span className="sql-keyword">SELECT</span> p.name, <span className="sql-function">SUM</span>(oi.quantity) <span className="sql-keyword">as</span> units_sold, <span className="sql-function">SUM</span>(oi.price * oi.quantity) <span className="sql-keyword">as</span> total_revenue{"\n"}
                      <span className="sql-keyword">FROM</span> order_items oi{"\n"}
                      <span className="sql-keyword">JOIN</span> products p <span className="sql-keyword">ON</span> p.id = oi.product_id{"\n"}
                      <span className="sql-keyword">GROUP BY</span> p.id, p.name{"\n"}
                      <span className="sql-keyword">ORDER BY</span> total_revenue <span className="sql-keyword">DESC</span>{"\n"}
                      <span className="sql-keyword">LIMIT</span> <span className="sql-number">3</span>;
                    </code>
                  </pre>
                </div>

                {/* Table representation */}
                <div className="sim-table-block">
                  <div className="sim-block-header">
                    <span className="flex items-center gap-1"><Table size={13} /> QUERY RESULTS</span>
                    <span className="table-rows">3 rows returned</span>
                  </div>
                  <div className="sim-table-wrapper">
                    <table className="sim-table">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th className="text-right">Units Sold</th>
                          <th className="text-right">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="animate-slide-up-1">
                          <td>Wireless Noise-Canceling Headphones</td>
                          <td className="text-right">142</td>
                          <td className="text-right text-emerald-400 font-semibold">$42,458.00</td>
                        </tr>
                        <tr className="animate-slide-up-2">
                          <td>Mechanical Gaming Keyboard</td>
                          <td className="text-right">98</td>
                          <td className="text-right text-emerald-400 font-semibold">$14,602.00</td>
                        </tr>
                        <tr className="animate-slide-up-3">
                          <td>Ergonomic Office Chair</td>
                          <td className="text-right">64</td>
                          <td className="text-right text-emerald-400 font-semibold">$12,736.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Features Section */}
      <footer className="hero-footer-bar">
        <div className="hero-footer-grid">
          <div className="footer-feature">
            <div className="feature-icon"><Terminal size={18} /></div>
            <h3>Intelligent Schema Matching</h3>
            <p>Automatically resolves column aliases, relationships, and table structures.</p>
          </div>
          <div className="footer-feature">
            <div className="feature-icon"><Sparkles size={18} /></div>
            <h3>Optimized Execution</h3>
            <p>Ensures generate-level indexing alignment for fast query resolution.</p>
          </div>
          <div className="footer-feature">
            <div className="feature-icon"><Table size={18} /></div>
            <h3>Beautiful Interactive Displays</h3>
            <p>Renders markdown summaries, code blocks, and live data tables.</p>
          </div>
        </div>
        <p className="hero-copyright">© {new Date().getFullYear()} QueryLens. Powered by Gemini Pro.</p>
      </footer>
    </div>
  );
}
