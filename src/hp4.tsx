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

    // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
    // const words = splitText.words;

      const t1 = gsap.timeline()

  }, [])


  
  return (
    <>
                <section className='fourth-section w-[100vw] flex place-content-center bg-[#fcf7f8]'>
                    <div className="extra-space w-[91.8vw] relative font-second">
                      <div id='fourth-bottom' className="intro-container-2 h-[100vh] flex flex-col place-content-center ">
                        <p className="story-4-p">
                        Outside of programming and school, I enjoy 
                        producing music, green tea, trading and reading (memoirs, self-help, and manga are some of favorites).   
                        </p>
                      </div>
                    </div>
                </section>
    </>
    
    
  );
};

// Export the component
export default HomepageSecFour;