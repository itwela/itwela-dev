import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import resume from './assets/Itwela_3_4_24.pdf';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IoMdClose, IoMdMenu } from "react-icons/io";


const Navbar = () => {
  
  const [isHovered, setIsHovered] = useState(false);
  const [isCLicked, setIsCLicked] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
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

const handleMobileMenuClick = () => {
  setIsOpen(!isOpen);
}

//  -------------------------------------------

useLayoutEffect (() => {

    setIsOpen(false);

    gsap.set("#mobilenav", {
      y: '-1000%'
    })
  
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

  // mobile animations
  if (isOpen != false) {
      gsap.to("#mobilenav", {
      y: '0%',
      ease: 'expo.out',

    })

  }

  if (isOpen != true) {
    gsap.to("#mobilenav", {
      y: '-1000%',
      ease: 'expo.in',
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
        gsap.to(otherItem, { opacity: 0.7, ease: 'bounce.Out', duration: 0.5 });
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
    <nav ref={navContainer} id='menu-wrapper' className='w-[100vw] fixed z-[200] font-main h-[8vh] z-[2] p-4 sm:p-8 text-[#1e1f21] font-second hidden sm:flex place-items-center bg-[#FCF7F8]  justify-between'>
      <div id='menu-button' onMouseDown={handleMenuClick} className='cursor-pointer p-2 z-[2] '>Menu</div>

      <ul id='navul' className='hidden sm:flex flex gap-2 p-3'>
        <li id=''><NavLink to="/" className='p-5 '>Home</NavLink></li>
        {/* <li id=''><NavLink to="/Projects" className='p-3'>Projects</NavLink></li> */}
        <li id=''><a href={resume} download className='p-5 '>Resume</a></li>
        <li id=''><NavLink to="/blog" className='p-5 '>Blog</NavLink></li>
        <li id=''><NavLink to="/Contact" className='p-5'>Contact</NavLink></li>

      </ul>

    </nav>

    <nav ref={navContainer} id='' className='sm:hidden w-[100vw] fixed relative z-[200] font-main h-[8vh] z-[2] p-2 text-[#1e1f21] font-second flex place-items-center bg-[#FCF7F8]  justify-between'>
      <div id='menu-button' onClick={handleMobileMenuClick} className='cursor-pointer p-5 z-[2] '><IoMdMenu size={25}/></div>

      <span id='mobilenav' className='fixed top-0 w-[100vw] h-[100dvh] bg-[#FCF7F8] z-10 flex place-items-center place-content-start '>
        <ul id='' className='flex flex-col gap-8 font-main'>
          <span className='p-3'  onClick={handleMobileMenuClick}>
            <IoMdClose size={45} id='close-menu' className='cursor-pointer absolute top-[3%] right-[5%] p-2 z-[3] '/>
          </span>
          <li onClick={handleMobileMenuClick} id=''><NavLink to="/" className='py-7'>Home</NavLink></li>
          {/* <li id=''><NavLink to="/Projects" className='p-3'>Projects</NavLink></li> */}
          <li onClick={handleMobileMenuClick} id=''><a href={resume} download className='py-7'>Resume</a></li>
          <li onClick={handleMobileMenuClick} id=''><NavLink to="/blog" className='py-7'>Blog</NavLink></li>
          <li onClick={handleMobileMenuClick} id=''><NavLink to="/Contact" className='py-7'>Contact</NavLink></li>
        </ul>
      </span>

    </nav>

    </>
  );
};

export default Navbar;