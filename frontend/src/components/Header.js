import React from 'react';
import './Header.css';

const Header = ({ darkTheme }) => {
  return (
    <div className={`header ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h1 className="header-title">Education Policy Knowledge Assistant</h1>
      <p className="header-subtitle">
        Get authoritative guidance on education policies and federal requirements
      </p>
    </div>
  );
};

export default Header;

