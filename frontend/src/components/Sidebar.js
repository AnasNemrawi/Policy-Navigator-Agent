import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ sessions, currentSessionId, onNewSession, onSwitchSession, onDeleteSession, darkTheme }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getSessionTitle = (session) => {
    const messages = session.messages || [];
    const createdDate = new Date(session.created_at);
    const dateStr = createdDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });

    if (messages.length === 0) {
      return `New Chat - ${dateStr}`;
    }

    // Get first user message
    for (const msg of messages) {
      if (msg.role === 'user') {
        const content = msg.content.replace(/\n/g, ' ').trim();
        const maxLength = 30;
        const truncated = content.length > maxLength 
          ? content.substring(0, maxLength) + '...'
          : content;
        return `💬 ${truncated}`;
      }
    }

    return `📝 Chat - ${dateStr}`;
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDeleteSession(currentSessionId);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  const sortedSessionIds = Object.keys(sessions)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className={`sidebar ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="sidebar-container">
        <div className="sidebar-new-session">
          <button
            className="new-session-btn"
            onClick={onNewSession}
          >
            ➕ New Session
          </button>
        </div>

        <div className="sidebar-session-list">
          <h3 className="sidebar-title">Previous Sessions</h3>
          {sortedSessionIds.length === 0 ? (
            <p className="no-sessions">No previous sessions</p>
          ) : (
            sortedSessionIds.map(sessionId => (
              <button
                key={sessionId}
                className={`session-btn ${sessionId === currentSessionId ? 'active' : ''}`}
                onClick={() => onSwitchSession(sessionId)}
              >
                {getSessionTitle(sessions[sessionId])}
              </button>
            ))
          )}
        </div>

        <div className="sidebar-delete-section">
          {currentSessionId && (
            <button
              className={`delete-btn ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDeleteClick}
            >
              {confirmDelete ? '⚠️ Confirm Delete' : '🗑️ Delete Session'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

