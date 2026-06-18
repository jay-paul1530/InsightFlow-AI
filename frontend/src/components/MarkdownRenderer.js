'use client';

import React, { useState } from 'react';
import { Copy, Check, FileText, Download, Image as ImageIcon } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Render a code block with copying functionality and SQL highlighting
  const CodeBlock = ({ rawCode }) => {
    const [copied, setCopied] = useState(false);
    
    // Extract language (first line)
    const firstNewlineIdx = rawCode.indexOf('\n');
    let language = 'text';
    let code = rawCode;
    
    if (firstNewlineIdx !== -1) {
      const possibleLang = rawCode.substring(0, firstNewlineIdx).trim();
      if (possibleLang && possibleLang.length < 10) {
        language = possibleLang.toLowerCase();
        code = rawCode.substring(firstNewlineIdx + 1);
      }
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Syntax highlight SQL keywords
    const highlightSQL = (text) => {
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
        'INNER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'AND', 'OR', 
        'NOT', 'IN', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DESC', 'ASC',
        'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'WITH', 'UNION', 'ALL'
      ];
      
      let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        
      // Bold/colorize SQL keywords
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        html = html.replace(regex, `<span class="sql-keyword">$1</span>`);
      });
      
      // Colorize strings in single quotes
      html = html.replace(/('[^']*')/g, `<span class="sql-string">$1</span>`);
      
      // Colorize numbers
      html = html.replace(/\b(\d+)\b/g, `<span class="sql-number">$1</span>`);

      return <code dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
      <div className="code-block-container">
        <div className="code-block-header">
          <span>{language.toUpperCase()}</span>
          <button className="copy-btn" onClick={handleCopy} title="Copy code">
            {copied ? (
              <>
                <Check size={14} className="text-success" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre>
          {language === 'sql' ? highlightSQL(code) : <code>{code}</code>}
        </pre>
      </div>
    );
  };

  // Helper to process inline styles (bold, code, links, images)
  const renderInlineText = (text) => {
    let parts = [];
    let currentIdx = 0;
    
    // Quick regex to match bold (**text**), inline code (`code`), and markdown links [text](url)
    const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    let match;
    let keyCounter = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      const matchText = match[0];
      const matchIdx = match.index;

      // Add text before token
      if (matchIdx > currentIdx) {
        parts.push(text.substring(currentIdx, matchIdx));
      }

      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        const inner = matchText.slice(2, -2);
        parts.push(<strong key={keyCounter++}>{inner}</strong>);
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        const inner = matchText.slice(1, -1);
        parts.push(<code key={keyCounter++}>{inner}</code>);
      } else if (matchText.startsWith('[')) {
        const textEnd = matchText.indexOf(']');
        const linkText = matchText.substring(1, textEnd);
        const url = matchText.substring(textEnd + 2, matchText.length - 1);
        
        // Check if URL is an image or file link from sandbox
        const isImage = url.match(/\.(png|jpg|jpeg|gif|webp)/i) || url.includes('file_path=') && url.includes('.png');
        const isFile = url.includes('file?sandbox_id=') || url.match(/\.(xlsx|xls|csv|pdf|txt)/i);

        if (isImage) {
          parts.push(
            <div className="sandbox-image-container" key={keyCounter++}>
              <div className="code-block-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} /> Generated Visualization
                </span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="copy-btn">
                  <Download size={14} /> Download
                </a>
              </div>
              <img src={url} alt="Agent visualization" className="sandbox-image" />
            </div>
          );
        } else if (isFile) {
          const fileName = url.split('file_path=').pop()?.split('/').pop() || 'Download File';
          parts.push(
            <a href={url} target="_blank" rel="noopener noreferrer" className="file-link-card" key={keyCounter++}>
              <div className="file-link-icon">
                <FileText size={20} />
              </div>
              <div className="file-link-info">
                <span className="file-link-name">{decodeURIComponent(fileName)}</span>
                <span className="file-link-url">Sandbox Generated Asset</span>
              </div>
              <Download size={16} className="text-secondary" />
            </a>
          );
        } else {
          parts.push(
            <a key={keyCounter++} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'underline' }}>
              {linkText}
            </a>
          );
        }
      }

      currentIdx = tokenRegex.lastIndex;
    }

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  // Helper to parse Markdown tables
  const parseTable = (lines) => {
    // Correctly parse headers and rows preserving empty cells
    const getCells = (line) => {
      const parts = line.split('|');
      // Markdown tables typically start and end with '|', leaving empty strings at start/end of split
      const startIdx = parts[0] === '' ? 1 : 0;
      const endIdx = parts[parts.length - 1] === '' ? parts.length - 1 : parts.length;
      return parts.slice(startIdx, endIdx).map(s => s.trim());
    };

    const headers = getCells(lines[0]);
    const rows = lines.slice(2)
      .map(line => getCells(line))
      .filter(row => row.length > 0 && row.some(cell => cell !== ''));

    return (
      <div style={{ overflowX: 'auto', width: '100%', margin: '1rem 0', borderRadius: '0.375rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ whiteSpace: 'nowrap', textAlign: 'left', padding: '0.5rem 0.625rem', backgroundColor: 'var(--bg-tertiary)', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ backgroundColor: ri % 2 === 1 ? 'rgba(255, 255, 255, 0.01)' : 'transparent' }}>
                {headers.map((_, ci) => {
                  const cell = row[ci] || '';
                  return (
                    <td key={ci} style={{ whiteSpace: 'nowrap', textAlign: 'left', padding: '0.5rem 0.625rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      {renderInlineText(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main block parser
  const blocks = [];
  const parts = content.split('```');
  
  parts.forEach((part, index) => {
    const isCode = index % 2 === 1;
    
    if (isCode) {
      blocks.push(<CodeBlock key={index} rawCode={part} />);
    } else {
      // Parse markdown tables, lists, and paragraphs
      const lines = part.split('\n');
      let tableLines = [];
      let listItems = [];
      let listType = null; // 'ul' or 'ol'
      
      const flushList = () => {
        if (listItems.length > 0) {
          const Tag = listType;
          blocks.push(
            <Tag key={`list-${blocks.length}`}>
              {listItems.map((item, i) => (
                <li key={i}>{renderInlineText(item)}</li>
              ))}
            </Tag>
          );
          listItems = [];
          listType = null;
        }
      };

      const flushTable = () => {
        if (tableLines.length > 0) {
          blocks.push(<React.Fragment key={`table-${blocks.length}`}>{parseTable(tableLines)}</React.Fragment>);
          tableLines = [];
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Table Detection
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1) {
          flushList();
          tableLines.push(line);
          continue;
        } else if (tableLines.length > 0) {
          // If we were parsing a table but now line doesn't start with |
          flushTable();
        }

        // 2. Unordered List Detection
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (listType !== 'ul') {
            flushList();
            listType = 'ul';
          }
          listItems.push(trimmed.substring(2));
          continue;
        }

        // 3. Ordered List Detection
        const matchOl = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matchOl) {
          if (listType !== 'ol') {
            flushList();
            listType = 'ol';
          }
          listItems.push(matchOl[2]);
          continue;
        }

        // Standard text
        if (trimmed) {
          flushList();
          blocks.push(
            <p key={`p-${blocks.length}`} style={{ marginBottom: '12px' }}>
              {renderInlineText(line)}
            </p>
          );
        } else {
          flushList();
        }
      }
      
      // Flush anything left at the end of the part
      flushList();
      flushTable();
    }
  });

  return <div className="markdown-content">{blocks}</div>;
}
