import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SiLeetcode } from "react-icons/si";
import { LiaHackerrank } from "react-icons/lia";
import TextTransition, { presets } from 'react-text-transition';



// Define your functional component
const HomepageSecFour = () => {
  
  const TEXTS = ['S - Structures', 'L - Lexicon', 'A - Algorithims', 'M - Math'];
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      2618, // every 2 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  useGSAP(() => {
  }, [])


  
  return (
    <>
                <section className='fourth-section p-2  w-full z-1 min-h-[50vh] flex place-content-center place-items-center '>
                      
                      <div id='fourth-bottom' className="intro-container-2 justify-evenly min-h-[50vh] w-full  flex flex-col place-items-center place-content-center ">
                        
                      <div className='w-full h-[50vh] flex flex-col gap-5 place-content-center place-items-start w-full'>
                            <h2 className='text-6xl flex  gap-3 flex-wrap  place-items-center'>Check out <NavLink to="/slam"><span className='font-bold text-black'>S.L.A.M.</span></NavLink></h2>
                            <div className='w-full'> 
                              <div className=' flex flex-col place-content-center'>
                                <h2 className=''>A Tool I am using to help me master platforms like</h2>
                                 <span className='flex gap-2 py-2'>
                                   <a href="https://leetcode.com/itwela/" target='_blank'><span className='font-bold flex gap-1'>Leetcode <SiLeetcode /></span></a>
                                   and
                                   <a href="https://www.hackerrank.com/profile/deanandnostrand" target='_blank'><span className='font-bold flex gap-1'>HackerRank <LiaHackerrank />.</span></a>
                                 </span>
                              </div>
                              <div className='flex place-content-start w-full place-items-center '>
                                  
                                  <span className='flex w-full  gap-2 place-items-center place-content-start'>
                                    <TextTransition className="" springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>.
                                  </span>               
                                </div>
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