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
                <section className='fourth-section p-2  w-full z-1 min-h-[50vh] flex place-content-center place-items-center '>
                      
                      <div id='fourth-bottom' className="intro-container-2 justify-evenly min-h-[50vh] w-full  flex flex-col place-items-center place-content-center ">
                        
                      <div className='w-full h-[50vh] flex flex-col gap-5 place-content-center place-items-center'>
                            <h2 className='text-6xl flex sm:flex-row gap-3 flex-col place-items-center'>Check out <NavLink to="/slam"><span className='font-bold text-black'>S.L.A.M.</span></NavLink></h2>
                            <div className='flex flex-col place-items-center'> 
                              <h2>A Tool I am using to help me master <span className='font-bold'>Leetcode</span>.</h2>
                              <h2>
                                <span className='font-bold'>S</span> - Structures 
                                <span className='font-bold'> L</span> - Lexicon, 
                                <span className='font-bold'> A </span>- Algorithms,
                                <span className='font-bold'> M</span> - Methods</h2>
                            </div>
                      </div>

                      <div className='w-full h-[1px] bg-[#1e1f21]/40 mb-8'></div>

                      <div className='w-full flex flex-col h-[50vh] place-items-center place-content-center'>
                        <h2>Outside of programming and school, I enjoy producing music, green tea, trading and reading (memoirs, self-help, and manga are some of favorites).</h2>
                      </div>
                      </div>
                      
                </section>
    </>
    
    
  );
};

// Export the component
export default HomepageSecFour;