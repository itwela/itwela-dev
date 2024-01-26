// navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import resume from './assets/up-resume-itwela.pdf'
const Navbar = () => {
  return (
    <nav className='w-[100vw] flex place-content-center fixed bottom-3 md:bottom-10 z-[10]'>
      <ul className='nav-bar-container text-[0.7em] md:text-[1em] flex gap-4 md:gap-8 p-5 backdrop-blur rounded-[2em]'>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/Projects">Projects</NavLink></li>
        <li><a href={resume} download>Resume</a></li>
        <li><NavLink to="/Contact">Contact</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
