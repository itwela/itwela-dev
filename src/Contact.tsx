import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'



// Define your functional component
const Contact = () => {
  
  const fadeLeft = useRef(null);
  useGSAP(() => {
      gsap.from(fadeLeft.current, {
          x: -100, // Starting position (above the screen)
          opacity: 0, // Starting opacity (completely transparent)
          duration: 1, // Duration of the animation
          ease: "sine.out", // Easing function for smoother animation
      })
  })

  
  return (
    <>
    <section ref={fadeLeft} className='main-section w-[100vw] h-[100vh] grid place-content-center'>
        <div className="extra-space w-[61.8vw] relative">
            <h1>Contact</h1>
            <br />
            <h2><strong>Email:</strong> <a href="mailto:iibomu@wgu.edu">iibomu@wgu.edu</a></h2> 
            <h2><strong>Linkedin:</strong> <a href="linkedin.com/in/itwela/">linkedin.com/in/itwela/</a></h2>
        </div>
    </section>
    </>
    
    
  );
};

// Export the component
export default Contact;