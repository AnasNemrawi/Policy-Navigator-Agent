import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ darkTheme, onToggle }) => {
  return (
    <button
      className={`theme-toggle ${darkTheme ? 'dark' : 'light'}`}
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      {darkTheme ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;

