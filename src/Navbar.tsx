// navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import resume from './assets/2024_Itwela_JPM.pdf'
const Navbar = () => {
  return (
    <nav className='w-[100vw] flex place-content-center md:bottom-10 bg-[#ffcc00]'>
      <ul className='nav-bar-container text-[0.7em] bottom-[3%] left-2 fixed z-[10] md:text-[1em] flex gap-4 md:gap-8 p-2 backdrop-blur rounded-[2em] w-[100vw] justify-evenly'>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/Projects">Projects</NavLink></li>
        <li><a href={resume} download>Resume</a></li>
        <li><NavLink to="/Contact">Contact</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
