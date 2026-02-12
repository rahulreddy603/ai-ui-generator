import React, { useState, useEffect } from 'react';
import * as UI from './UI';

export default function LivePreview({ code, onVersionChange, versions, currentVersionId }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    if (!code) {
      setComponent(null);
      setError(null);
      return;
    }

    try {
      // Create a safe sandbox for the generated component
      const wrappedCode = `
        const { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart } = UI;
        ${code}
        return GeneratedUI;
      `;

      // Create function with UI components in scope
      const createComponent = new Function('UI', 'React', wrappedCode);
      const GeneratedComponent = createComponent(UI, React);

      setComponent(() => GeneratedComponent);
      setError(null);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
      setComponent(null);
    }
  }, [code]);

  return (
    <div style={{
      marginLeft: '350px',
      marginRight: '450px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Live Preview
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '2px'
          }}>
            Updates automatically as code changes
          </div>
        </div>

        {versions.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowVersions(!showVersions)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Version History</span>
              <span style={{ fontSize: '10px' }}>({versions.length})</span>
            </button>

            {showVersions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '250px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {versions.map((version, idx) => (
                  <div
                    key={version.id}
                    onClick={() => {
                      onVersionChange(version.id);
                      setShowVersions(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: idx < versions.length - 1 ? '1px solid #e5e7eb' : 'none',
                      cursor: 'pointer',
                      backgroundColor: version.id === currentVersionId ? '#eff6ff' : 'white'
                    }}
                  >
                    <div style={{
                      fontSize: '13px',
                      fontWeight: version.id === currentVersionId ? '600' : '400',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      Version {versions.length - idx}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280'
                    }}>
                      {new Date(version.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px',
        backgroundColor: '#f3f4f6'
      }}>
        {error ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              Preview Error
            </div>
            <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
              {error}
            </div>
          </div>
        ) : Component ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '400px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Component />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <div>Generate a UI to see the live preview</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}