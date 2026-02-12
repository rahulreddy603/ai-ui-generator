import React from 'react';

// Fixed UI Component Library - NEVER MODIFIED BY AI

export function Button({ children, variant = 'primary', onClick, disabled }) {
  const baseStyles = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1
  };

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: 'white',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
    }
  };

  return (
    <button
      style={{ ...baseStyles, ...variants[variant] }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Card({ children, header, footer }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      {header && (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          {header}
        </div>
      )}
      <div style={{ padding: '16px' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export function Input({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

export function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb' }}>
            {headers.map((header, idx) => (
              <th key={idx} style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} style={{
              borderBottom: '1px solid #e5e7eb'
            }}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} style={{ padding: '12px' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ children, title }) {
  return (
    <div style={{
      width: '250px',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '20px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      {title && (
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '20px',
          marginTop: 0
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function Navbar({ title, items = [] }) {
  return (
    <nav style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '20px', fontWeight: '700' }}>{title}</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href || '#'}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function Chart({ type = 'bar', data = [], title }) {
  // Mock chart implementation
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ padding: '16px' }}>
      {title && (
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>
          {title}
        </h3>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                height: `${(item.value / maxValue) * 100}%`,
                borderRadius: '4px 4px 0 0',
                minHeight: '4px'
              }}
            />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}