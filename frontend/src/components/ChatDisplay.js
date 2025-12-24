import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatDisplay.css';

const ChatDisplay = ({ messages, darkTheme }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={`chat-display empty ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="empty-state">
          <p>👋 Start a conversation by asking a question about education policy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-display ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
        >
          {message.role === 'user' ? (
            <div className="user-message-content">
              <div className="message-header">
                <strong>You</strong>
              </div>
              <div className="message-text">
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="assistant-message-content">
              <div className="message-header">
                <strong>🤖 Assistant</strong>
              </div>
              <div className="message-text">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatDisplay;

