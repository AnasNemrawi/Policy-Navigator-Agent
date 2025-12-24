import React from 'react';
import './Instructions.css';

const Instructions = ({ darkTheme }) => {
  return (
    <div className={`instructions ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h3>📚 How to Use</h3>
      <ul>
        <li>Ask questions about education policies and federal requirements</li>
        <li>Optionally provide a URL to scrape education policy content</li>
        <li>Get responses with citations from verified sources</li>
        <li>Manage multiple conversation sessions</li>
      </ul>
    </div>
  );
};

export default Instructions;

