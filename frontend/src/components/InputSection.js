import React, { useState } from 'react';
import './InputSection.css';

const InputSection = ({ onSend, onClear, processing, darkTheme }) => {
  const [question, setQuestion] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !processing) {
      onSend(question, url);
      setQuestion('');
      setUrl('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`input-section ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="url-input">🔗 URL (Optional)</label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={processing}
            className="url-input"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="question-input">💬 Your Question</label>
          <textarea
            id="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about education policy..."
            rows="3"
            disabled={processing}
            className="question-input"
            required
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={onClear}
            disabled={processing}
            className="clear-btn"
          >
            🗑️ CLear History
          </button>
          <button
            type="submit"
            disabled={!question.trim() || processing}
            className="send-btn"
          >
            {processing ? '⏳ Processing...' : '📤 Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;

