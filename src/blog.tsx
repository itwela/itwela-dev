import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'



// Define your functional component
const Blog = () => {
  
  useGSAP(() => {

    // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
    // const words = splitText.words;

      const t1 = gsap.timeline()
      t1.from(["#blog1", "#blog2"], {
        opacity: 0,
        yPercent: "-100",
        duration: 1.3,
        delay: 0.3,
        ease: "back",
      })
  }, [])


  
  return (
    <>
    <section className='main-section w-[100vw] h-[100vh] grid place-content-center bg-[#fcf7f8] '>
        <div className="extra-space w-[61.8vw] relative">
            <h1 id='blog1' className='font-main'>Blog</h1>
            <br />
            <h2 id='blog2' className='font-second'>Currently under construction... </h2> 
        </div>
    </section>
    </>
    
    
  );
};

// Export the component
export default Blog;