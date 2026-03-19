import React from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'vs-dark' ? <Sun size={20} /> : <Moon size={20} />}
      <span>{theme === 'vs-dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;