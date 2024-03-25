import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ItFooter from './footer';
import { projectposts } from './codingRs';
import { codingposts } from './codingRs';

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
    <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] flex flex-col  bg-[#fcf7f8] '>
        <div className="extra-space flex flex-col place-content-start w-full min-h-[100dvh] relative">
            <h1 id='blog1' className='font-main text-5xl'>Blog</h1>
            <br />
            <h2 id='blog2' className='font-second'>Currently under construction... </h2> 
            
            {/* projects */}
            <div className='flex py-5 flex-col w-full gap-8 place-items-center overflow-x-scroll no-scroll'>
              <div className='w-max h-max flex flex-col'>
                <span className='w-full h-[1px] bg-slate-500'></span>
                <span className='font-bold'>Projects</span>
              </div>
              <div className='w-full flex'>
                {projectposts.map((projectpost) => (
                  <>
                  <div className='py-5 backdrop-blur-sm bg-red  w-full h-max flex gap-2  '>
                    <div
                    className='w-[400px] h-[400px] place-items-center p-5 rounded-lg flex relative flex-col gap-2 justify-between place-content-center'>
                      <div className='w-full flex place-items-center justify-between'>
                        <h1 className='font-bold text-4xl'>{projectpost.title}</h1>
                        <p className='underline text-slate-500 select-none' >Read More</p>
                      </div>
                      <img src={projectpost.imageUrl} className='w-[300px] h-[60%]' alt="" />
                      <p className='flex place-self-end'>{projectpost.date.toLocaleDateString()}</p>
                    </div>
                  <div className='h-[400px] w-[1px] bg-slate-500'></div>
                  </div>
                  </>
                ))}
              </div>
            </div>

            {/* coding */}
            <div className='flex py-5 flex-col w-full gap-8 place-items-center overflow-x-scroll no-scroll'>
              <div className='w-max h-max flex flex-col'>
                <span className='w-full h-[1px] bg-slate-500'></span>
                <span className='font-bold'>Leetcode & More</span>
              </div>
              <div className='w-full flex'>
                {codingposts.map((codingpost) => (
                  <>
                  <div className='py-5 backdrop-blur-sm bg-red  w-full h-max flex gap-2  '>
                    <div
                    className='w-[400px] h-[400px] place-items-center p-5 rounded-lg flex relative flex-col gap-2 justify-between place-content-center'>
                      <div className='w-full flex place-items-center justify-between'>
                        <h1 className='font-bold text-4xl'>{codingpost.title}</h1>
                        <p className='underline text-slate-500 select-none' >Read More</p>
                      </div>
                      <img src={codingpost.imageUrl} className='w-[300px] h-[60%]' alt="" />
                      <p className='flex place-self-end'>{codingpost.date.toLocaleDateString()}</p>
                    </div>
                  <div className='h-[400px] w-[1px] bg-slate-500'></div>
                  </div>
                  </>
                ))}
              </div>
            </div>
        </div>
        <ItFooter />
    </section>
    </>
    
    
  );
};

// Export the component
export default Blog;