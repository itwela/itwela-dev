import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'



// Define your functional component
const Contact = () => {
  
  useGSAP(() => {

    // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
    // const words = splitText.words;

      const t1 = gsap.timeline()
      t1.from(["#contact1", "#contact2", "#contact3"], {
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
            <h1 id='contact1' className='font-main'>Contact</h1>
            <br />
            <h2 id='contact2' className='font-second'><strong>Email:</strong> <a href="mailto:iibomu@wgu.edu">iibomu@wgu.edu</a></h2> 
            <h2 id='contact3' className='font-second'><strong>Linkedin:</strong> <a href="linkedin.com/in/itwela/">linkedin.com/in/itwela/</a></h2>
        </div>
    </section>
    </>
    
    
  );
};

// Export the component
export default Contact;