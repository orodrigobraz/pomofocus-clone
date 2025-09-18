import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import './Header.css';

const Header: React.FC = () => {
  const { currentMode } = useTimer();

  return (
    <header className="header">
      <div className="header-content">
        <div className={`header-icon ${currentMode}`}>
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="header-title">
          <a 
            href="https://pomofocus.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="header-link"
          >
            Pomofocus Clone
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;