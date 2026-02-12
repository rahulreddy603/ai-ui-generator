import React, { useState } from 'react';

export default function ChatPanel({ 
  onGenerate, 
  onModify, 
  loading, 
  messages, 
  explanation 
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (messages.length === 0) {
      onGenerate(input);
    } else {
      onModify(input);
    }
    setInput('');
  };

  return (
    <div style={{
      width: '350px',
      height: '100vh',
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          AI UI Generator
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
          Describe your UI in plain English
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: msg.type === 'user' ? '#eff6ff' : 'white',
              border: msg.type === 'user' ? '1px solid #bfdbfe' : '1px solid #e5e7eb'
            }}
          >
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>
              {msg.type === 'user' ? 'You' : 'AI'}
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {explanation && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#16a34a',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              AI Explanation
            </div>
            <div style={{
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#166534',
              whiteSpace: 'pre-wrap'
            }}>
              {explanation}
            </div>
          </div>
        )}

        {loading && (
          <div style={{
            padding: '12px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              AI is working...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '20px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            messages.length === 0
              ? "e.g., Create a dashboard with user stats"
              : "e.g., Add a settings modal"
          }
          style={{
            width: '100%',
            height: '80px',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'none',
            fontFamily: 'inherit',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !input.trim() ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : messages.length === 0 ? 'Generate UI' : 'Modify UI'}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}