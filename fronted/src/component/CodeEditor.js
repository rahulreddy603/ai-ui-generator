import React, { useState } from 'react';

export default function CodeEditor({ code, onChange, onRegenerate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);

  React.useEffect(() => {
    setEditedCode(code);
  }, [code]);

  const handleSave = () => {
    onChange(editedCode);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCode(code);
    setIsEditing(false);
  };

  return (
    <div style={{
      width: '450px',
      height: '100vh',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      right: 0,
      top: 0,
      borderLeft: '1px solid #333'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#252526'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#cccccc'
        }}>
          Generated Code
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#0e639c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3e3e42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3e3e42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={onRegenerate}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3e3e42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Regenerate
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px'
      }}>
        {isEditing ? (
          <textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              border: 'none',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              padding: 0,
              margin: 0,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            spellCheck={false}
          />
        ) : (
          <pre style={{
            margin: 0,
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <code style={{ color: '#d4d4d4' }}>
              {code || '// Generated code will appear here'}
            </code>
          </pre>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #333',
        fontSize: '11px',
        color: '#858585',
        backgroundColor: '#252526'
      }}>
        {code ? `${code.split('\n').length} lines` : 'No code generated yet'}
      </div>
    </div>
  );
}