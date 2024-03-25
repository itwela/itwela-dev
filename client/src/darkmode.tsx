import React, { useState, useEffect } from 'react';
import lightModeIcon from './assets/night-mode-light.png';
import darkModeIcon from './assets/night-mode-dark.png';
import './index.css'

const DarkMode: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    const handleDarkModeToggle = () => {
      document.documentElement.classList.toggle('dark');
      setIsDarkMode((prevMode) => !prevMode);
    };

    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', handleDarkModeToggle);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (darkModeToggle) {
        darkModeToggle.removeEventListener('click', handleDarkModeToggle);
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <img
      id="darkModeToggle"
      className='hidden dark-icon fixed top-10 left-7 md:w-[40px] w-[20px]'
      src={isDarkMode ? lightModeIcon : darkModeIcon}
    >
    </img>
  );
};

export default DarkMode;
