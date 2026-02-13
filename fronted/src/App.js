import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import ChatPanel from './component/ChatPanel';
import CodeEditor from './component/CodeEditor';
import LivePreview from './component/LivePreview';

function App() {
  const [sessionId] = useState(() => Date.now().toString());
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [currentVersionId, setCurrentVersionId] = useState(null);

  const API_BASE = 'https://ai-ui-generator-0o7n.onrender.com/api';

  // Wrapped in useCallback to satisfy dependency requirements
  const fetchVersions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/versions/${sessionId}`);
      setVersions(response.data);
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  }, [API_BASE, sessionId]); // Dependencies for the callback

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]); // fetchVersions is now a stable dependency

  const handleGenerate = async (userIntent) => {
    setLoading(true);
    setMessages([...messages, { type: 'user', content: userIntent }]);

    try {
      const response = await axios.post(`${API_BASE}/generate`, {
        userIntent,
        sessionId
      });

      setCode(response.data.code);
      setExplanation(response.data.explanation);
      setCurrentVersionId(response.data.versionId);
      
      setMessages(prev => [
        ...prev,
        { type: 'ai', content: 'UI generated successfully!' }
      ]);

      await fetchVersions();
    } catch (error) {
      console.error('Generation error:', error);
      setMessages(prev => [
        ...prev,
        { 
          type: 'ai', 
          content: `Error: ${error.response?.data?.error || error.message}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async (userRequest) => {
    setLoading(true);
    setMessages([...messages, { type: 'user', content: userRequest }]);

    try {
      const response = await axios.post(`${API_BASE}/modify`, {
        currentCode: code,
        userRequest,
        sessionId
      });

      setCode(response.data.code);
      setExplanation(response.data.explanation);
      setCurrentVersionId(response.data.versionId);
      
      setMessages(prev => [
        ...prev,
        { type: 'ai', content: 'UI modified successfully!' }
      ]);

      await fetchVersions();
    } catch (error) {
      console.error('Modification error:', error);
      setMessages(prev => [
        ...prev,
        { 
          type: 'ai', 
          content: `Error: ${error.response?.data?.error || error.message}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRegenerate = async () => {
    if (messages.length === 0) return;
    
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
      await handleGenerate(lastUserMessage.content);
    }
  };

  const handleVersionChange = async (versionId) => {
    try {
      const response = await axios.get(`${API_BASE}/version/${sessionId}/${versionId}`);
      setCode(response.data.code);
      setExplanation(response.data.explanation);
      setCurrentVersionId(versionId);
    } catch (error) {
      console.error('Error loading version:', error);
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <ChatPanel
        onGenerate={handleGenerate}
        onModify={handleModify}
        loading={loading}
        messages={messages}
        explanation={explanation}
      />
      
      <LivePreview
        code={code}
        versions={versions}
        currentVersionId={currentVersionId}
        onVersionChange={handleVersionChange}
      />
      
      <CodeEditor
        code={code}
        onChange={handleCodeChange}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}

export default App;