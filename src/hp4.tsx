import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'



// Define your functional component
const HomepageSecFour = () => {
  
  useGSAP(() => {


  }, [])


  
  return (
    <>
                <section className='fourth-section p-4 sm:p-8 w-full z-1 min-h-[50vh] flex place-content-center place-items-center '>
                      <div id='fourth-bottom' className="intro-container-2  flex flex-col place-items-center place-content-center ">
                        <p className="story-4-p">
                        Outside of programming and school, I enjoy 
                        producing music, green tea, trading and reading (memoirs, self-help, and manga are some of favorites).   
                        </p>
                      </div>
                </section>
    </>
    
    
  );
};

// Export the component
export default HomepageSecFour;