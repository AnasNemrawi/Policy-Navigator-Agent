import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatDisplay from './components/ChatDisplay';
import InputSection from './components/InputSection';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';
import Instructions from './components/Instructions';
import ExamplePrompts from './components/ExamplePrompts';
import Notification from './components/Notification';
import { loadSessions, createNewSession, saveSession, deleteSession } from './services/sessionService';

function App() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem('darkTheme');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Load sessions on mount
    const loadInitialSessions = async () => {
      const loadedSessions = await loadSessions();
      setSessions(loadedSessions);
      
      if (Object.keys(loadedSessions).length > 0) {
        // Load most recent session
        const recentSessionId = Math.max(...Object.keys(loadedSessions).map(Number));
        setCurrentSessionId(recentSessionId);
        setMessages(loadedSessions[recentSessionId].messages || []);
      } else {
        // Create first session
        const newSession = await createNewSession();
        setSessions({ [newSession.id]: newSession });
        setCurrentSessionId(newSession.id);
      }
    };
    
    loadInitialSessions();
  }, []);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
    document.body.classList.toggle('dark-theme', darkTheme);
    document.body.classList.toggle('light-theme', !darkTheme);
  }, [darkTheme]);

  const handleNewSession = async () => {
    // Save current session before creating new one
    if (currentSessionId && messages.length > 0) {
      await saveSession(currentSessionId, messages);
    }
    
    const newSession = await createNewSession();
    setSessions(prev => ({ ...prev, [newSession.id]: newSession }));
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const handleSwitchSession = async (sessionId) => {
    // Save current session
    if (currentSessionId && messages.length > 0) {
      await saveSession(currentSessionId, messages);
    }
    
    setCurrentSessionId(sessionId);
    setMessages(sessions[sessionId].messages || []);
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    const updatedSessions = { ...sessions };
    delete updatedSessions[sessionId];
    setSessions(updatedSessions);
    
    // Switch to most recent session
    const remainingIds = Object.keys(updatedSessions).map(Number);
    if (remainingIds.length > 0) {
      const recentId = Math.max(...remainingIds);
      setCurrentSessionId(recentId);
      setMessages(updatedSessions[recentId].messages || []);
    } else {
      // Create new session if none remain
      const newSession = await createNewSession();
      setSessions({ [newSession.id]: newSession });
      setCurrentSessionId(newSession.id);
      setMessages([]);
    }
  };

  const handleClearChat = async () => {
    if (messages.length === 0) {
      showNotification("Chat is already empty!", "info");
      return;
    }
    
    setMessages([]);
    if (currentSessionId) {
      await saveSession(currentSessionId, []);
    }
  };

  const handleSendMessage = async (question, url) => {
    if (!question.trim() || processing) return;
    
    setProcessing(true);
    
    // Add user message
    const userDisplay = url && url.trim() 
      ? `${question}\n\n🔗 URL: ${url}`
      : question;
    
    const userMessage = { role: 'user', content: userDisplay };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          url: url || '',
          messages: updatedMessages
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = { role: 'assistant', content: data.response };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        
        // Save session
        if (currentSessionId) {
          await saveSession(currentSessionId, finalMessages);
        }
        
        // Check for out of domain
        if (data.is_out_of_domain) {
          showNotification(
            "⚠️ This question appears to be outside the bot's domain of education policy.",
            "warning"
          );
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification(`❌ Error: ${error.message}`, "error");
      // Remove failed user message
      setMessages(messages);
    } finally {
      setProcessing(false);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  return (
    <div className={`app ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <ThemeToggle darkTheme={darkTheme} onToggle={toggleTheme} />
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewSession={handleNewSession}
        onSwitchSession={handleSwitchSession}
        onDeleteSession={handleDeleteSession}
        darkTheme={darkTheme}
      />
      <div className="main-content">
        <Header darkTheme={darkTheme} />
        <Instructions darkTheme={darkTheme} />
        <ExamplePrompts darkTheme={darkTheme} onSelectPrompt={handleSendMessage} />
        <ChatDisplay messages={messages} darkTheme={darkTheme} />
        <hr className="divider" />
        <InputSection
          onSend={handleSendMessage}
          onClear={handleClearChat}
          processing={processing}
          darkTheme={darkTheme}
        />
        <div className="footer-text" style={{ textAlign: 'center', padding: '10px', fontSize: '0.8rem', opacity: 0.7 }}>
          Built with humain ❤️ to provide AI guidance
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;

