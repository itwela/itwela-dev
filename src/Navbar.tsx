import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import resume from './assets/Itwela_21024.pdf';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  
  const [isHovered, setIsHovered] = useState(false);
  const [isCLicked, setIsCLicked] = useState(true);
  const navContainer = useRef<HTMLDivElement>(null);

  //  hover animation menu -----------------
  const handleIsHoveredEnter = () => {
    setIsHovered(true);
    console.log(isHovered, "It's hovered.");
  };

  const handleIsHoveredExit = () => {
    setIsHovered(false);
    console.log(isHovered, "It's not hovered.");
  };
  
  // setting this outside of the useGsap hook to
  // ensure nav links dont show up too early on reaload.


// click menu animation -----------------------
  
const handleMenuClick = () => {
    setIsCLicked(!isCLicked);
  }

//  -------------------------------------------

useGSAP (() => {
  
    gsap.set("#navul > li", {
      x: '-500em'
    })

    gsap.set("#menu-wrapper", {
      backgroundColor: '#fcf7f8'
    })
    
    gsap.to("#navul > li", {
      x: '0',
      stagger: 0.2,
      ease: 'expo.out'
    })

}, [])

const t2 = gsap.timeline()


  if (isCLicked != false) {
    t2.to("#navul > li", {
      x: '0',
      stagger: 0.2,
      ease: 'expo.out'
    })
  }
  
  if (isCLicked != true) {
    t2.to("#navul > li", {
      x: '-500em',
      stagger: 0.2,
      ease: 'expo.in'
    })
  }


// Select all li elements
const listItems = document.querySelectorAll('li');

// Add event listeners to each li element
listItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // On mouseenter, reduce opacity of all other li elements
    listItems.forEach(otherItem => {
      if (otherItem !== item) {
        gsap.to(otherItem, { opacity: 0.5, ease: 'circ' });
      }
    });
  });

  // Reset opacity on mouseleave
  item.addEventListener('mouseleave', () => {
    listItems.forEach(otherItem => {
      gsap.to(otherItem, { opacity: 1 });
    });
  });
});


  return (
    <>
    <nav ref={navContainer} id='menu-wrapper' className='w-[100vw] fixed z-[200] font-main h-[8vh] z-[2] p-2 text-[0.4em] md:text-[1em] flex place-items-center bg-[#FCF7F8]  justify-between'>
      {/* <ul onMouseOver={handleIsHoveredEnter} onMouseOut={handleIsHoveredExit} className='nav-bar-container items-center text-[0.7em] bottom-[3%] left-2 fixed z-[10] md:text-[1em] flex gap-4 md:gap-8 p-2 backdrop-blur rounded-[2em] w-[100vw] justify-evenly'> */}
      <div id='menu-button' onMouseDown={handleMenuClick} className='cursor-pointer p-2 z-[2] '>Menu</div>

      <ul id='navul' className='flex gap-2 p-3'>
        <li id=''><NavLink to="/" className='p-3'>Home</NavLink></li>
        <li id=''><NavLink to="/Projects" className='p-3'>Projects</NavLink></li>
        <li id=''><a href={resume} download className='p-3 '>Resume</a></li>
        <li id=''><NavLink to="/blog" className='p-3 '>Blog</NavLink></li>
        <li id=''><NavLink to="/Contact" className='p-3'>Contact</NavLink></li>

      </ul>

    </nav>

    <nav id='menu-wrapper' className='w-[100vw] text-hidden font-main h-[8vh] z-[2] p-2 text-[0.6em] md:text-[1em] flex place-items-center bg-[#FCF7F8]  justify-between'>
      {/* <ul onMouseOver={handleIsHoveredEnter} onMouseOut={handleIsHoveredExit} className='nav-bar-container items-center text-[0.7em] bottom-[3%] left-2 fixed z-[10] md:text-[1em] flex gap-4 md:gap-8 p-2 backdrop-blur rounded-[2em] w-[100vw] justify-evenly'> */}
      {/* <div id='menu-button' onMouseDown={handleMenuClick} className='cursor-pointer p-2 z-[2] '>Menu</div> */}

      {/* <ul id='navul' className='flex gap-2 p-3'>
        <li id=''><NavLink to="/" className='p-3'>Home</NavLink></li>
        <li id=''><NavLink to="/Projects" className='p-3'>Projects</NavLink></li>
        <li id=''><a href={resume} download className='p-3 '>Resume</a></li>
        <li id=''><NavLink to="/blog" className='p-3 '>Blog</NavLink></li>
        <li id=''><NavLink to="/Contact" className='p-3'>Contact</NavLink></li>

      </ul> */}

    </nav>

    </>
  );
};

export default Navbar;