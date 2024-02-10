import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import resume from './assets/Itwela_2224.pdf';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  
  const [isHovered, setIsHovered] = useState(false);
  const [isCLicked, setIsCLicked] = useState(false);
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

  useEffect(() => {
    // GSAP animation to set opacity to 0 for each element
    gsap.set(["#home", "#projects", "#resume", "#contact", "#blog"], {
      display: 'none',
    });
  }, []); // Run once on component mount

  // useGSAP(() => {


  //   if (isHovered == true) {
  //     gsap.to(["#home", "#projects", "#resume", "#contact",], {
  //       stagger: 0.3,
  //       ease: "elastic.in",
  //       display: "flex"
  //     })
  //   }

  //   if (isHovered == false) {
  //     gsap.to(["#home", "#projects", "#resume", "#contact",], {
  //       stagger: 0.1,
  //       ease: "elastic.out",
  //       display: "none"
  //     })
  //   }
  // }, {dependencies: [isHovered, setIsHovered], scope: navContainer})
// --------------------------------

// click menu animation -----------------------
  
const handleMenuClick = () => {
    setIsCLicked(!isCLicked);
  }

  useGSAP(() => {
    if (isCLicked !=false) {
      gsap.to(["#home", "#projects", "#resume", "#contact", "#blog"], {
        stagger: 0.3,
        ease: "back",
        display: "flex",
        xPercent: "0",
        opacity: 1
      }),

      gsap.to("#menu-button", {
        stagger: 0.3,
        ease: "back",
        position: "absolute",
        top: "10",
      }),

      gsap.to("#menu-cont", {
        backdropFilter: "blur(10px)",
        height: "100vh",
        xPercent: '0'
      })

    }

    if (isCLicked != true) {
      gsap.to(["#home", "#projects", "#resume", "#contact", "#blog"], {
        xPercent: "-500",
        stagger: 0.1,
        ease: "back",
        opacity: 0,
        display: "none",
      }),

      gsap.to(["#menu-button"],{
        stagger: 0.1,
        ease: "back",
        position: "absolute",
        top: "10",
        }),

      gsap.to("#menu-cont",{
        stagger: 0.1,
        ease: "back",
        position: "absolute",
        duration: 2,
        top: "10",
        xPercent: '-100',
        backdropFilter: null,
        })
    }
  }, {dependencies: [isCLicked, setIsCLicked], scope: navContainer})
//  -------------------------------------------

  return (
    <nav ref={navContainer} id='menu-wrapper' className='w-[100vw] fixed z-[2] flex place-items-start'>
      {/* <ul onMouseOver={handleIsHoveredEnter} onMouseOut={handleIsHoveredExit} className='nav-bar-container items-center text-[0.7em] bottom-[3%] left-2 fixed z-[10] md:text-[1em] flex gap-4 md:gap-8 p-2 backdrop-blur rounded-[2em] w-[100vw] justify-evenly'> */}
      <div id='menu-button' onMouseDown={handleMenuClick} className='cursor-pointer p-2 pl-7 absolute z-[2] '>Menu</div>
      <ul id="menu-cont" className='nav-bar-container relative items-start p-6 z-[10] md:text-[1em] flex flex-col gap-[3em] md:gap-[3.5em] p-2 rounded-[2em] w-[100vw]'>
        <a id='back' className='back p-3 cursor-pointer' onMouseDown={handleMenuClick} >back</a> 
        <li id='home'><NavLink to="/" onClick={handleMenuClick} className='p-3 text-[3em]'>Home</NavLink></li>
        <li id='projects'><NavLink to="/Projects" onClick={handleMenuClick}  className='p-3 text-[3em]'>Projects</NavLink></li>
        <li id='resume'><a href={resume} download onClick={handleMenuClick}  className='p-3 text-[3em]'>Resume</a></li>
        <li id='blog'><NavLink to="/blog" onClick={handleMenuClick}  className='p-3 text-[3em]'>Blog</NavLink></li>
        <li id='contact'><NavLink to="/Contact" onClick={handleMenuClick}  className='p-3 text-[3em]'>Contact</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;