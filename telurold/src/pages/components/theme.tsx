import React, { useState, useEffect } from 'react';
import Navbar from './navbar';

interface ThemeProps {
    children: React.ReactNode
  }

const Theme = ({ children }: ThemeProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    const root = document.documentElement;
    root.style.setProperty('--navbar-background-color', isDarkMode ? '#050c2e' : '#fff');
    root.style.setProperty('--button_bg_color', isDarkMode ? '#8EAFF0' : '#1946B8');
    root.style.setProperty('--button_txt_color', isDarkMode ? '#050c2e' : '#fff');
    root.style.setProperty('--desc_txt_color', isDarkMode ? '#969696' : '#969696');
    root.style.setProperty('--background-color', isDarkMode ? '#1e1e1e' : '#fff');
    root.style.setProperty('--footer-background-color', isDarkMode ? '#000000' : '#fff');
  }, [isDarkMode]);

  return (
    <div>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {children}
    </div>
  );
};

export default Theme;
