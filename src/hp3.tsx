import { useRef, useState } from 'react';
import projectData from './ProjectsData';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap'
import { NavLink } from 'react-router-dom';
import leftvid from './assets/p3vid.mp4'
import leftbg from './assets/p3bgimg.png'

gsap.registerPlugin(ScrollTrigger);


// Define your functional component
const HomepageSecThree = () => {

    const [isHovered, setIsHovered] = useState(false);
    const [isPjHovered, setPjIsHovered] = useState(false);
    const [isPjTwoHovered, setPjTwoIsHovered] = useState(false);


    const handleIsHoveredEnter = () => {
        setIsHovered(true);
        console.log(isHovered, "It's hovered.");
      };
    
      const handleIsHoveredExit = () => {
        setIsHovered(false);
        console.log(isHovered, "It's not hovered.");
      };
  
    const triggerRef = useRef(null);
      
    useGSAP(() => {
      
    const trigger3 = triggerRef.current;

    const t1 = gsap.timeline({
      scrollTrigger: {
          trigger: trigger3,
          start: "-30% center",
          end: "35% center",
          toggleActions: 'play play reverse reverse',
        //   scrub: true,

        //   markers: true,
      },
      defaults: {
        duration: 0.4,
          ease: "expo.out",
      },
    });

    t1.from(("#pleft"), {
      x: '-200%',
      duration: 0.4,
    }).to("#menu-wrapper", {
      backgroundColor: '#fcf7f8',
      color: '#000'
    }).from('#pright',{
        x: '200%',
    }).from('#imagepj1', {
      x: '-200%',
    }).from('#imagepj2', {
      x: '200%',
    })
    

      })

      const handlePjIsHoveredEnter = () => {
        setPjIsHovered(true);
      };
      const handlePjIsHoveredExit = () => {
        setPjIsHovered(false);
      };

      const tl3 = gsap.timeline({
          defaults: {
            ease: 'back.in',
            duration: 0.1,
            }
      })

      if (isPjHovered != false) {
        tl3.to('#imagepj1',{
          scale: 0.97
        }).to('#vidpj1', {
            yPercent: '0',
            opacity: 1,
            scale: 1.03
        }).to('#blurpj1', {
          backdropFilter: "blur(20px)",
      })
      }

      if (isPjHovered != true) {
        tl3.to('#imagepj1',{
          scale: 1
        }).to('#vidpj1', {
          yPercent: '5',
          opacity: 0
      }).to('#blurpj1', {
            backdropFilter: "",
        })

      }

      
      const handlePjTwoIsHoveredEnter = () => {
        setPjTwoIsHovered(true);
      };
      const handlePjTwoIsHoveredExit = () => {
        setPjTwoIsHovered(false);
      };

      const tl4 = gsap.timeline({
        defaults: {
          ease: 'back.in',
          duration: 0.1,
  }
    })

      if (isPjTwoHovered != false) {
        tl3.to('#imagepj2',{
          scale: 0.97
        }).to('#vidpj2', {
            yPercent: '0',
            opacity: 1,
            scale: 1.03
        }).to('#blurpj2', {
          backdropFilter: "blur(20px)",
      })
      }
      if (isPjTwoHovered != true) {
        tl3.to('#imagepj2',{
          scale: 1
        }).to('#vidpj2', {
          yPercent: '5',
          opacity: 0
      }).to('#blurpj2', {
            backdropFilter: "",
        })
      }

    //   --------------- SPLIT ---------

  
  return (
    <>
                <section ref={triggerRef} className='third-section w-[100vw] flex place-content-center bg-[#fcf7f8]'>
                    <div className="extra-space w-[91.8vw] h-[100vh] flex justify-evenly flex-col relative font-main">
                      <div id='third-bottom' className="intro-container-2 h-[20vh] flex justify-between place-content-center place-items-center w-[95%] sm:w-[100%]">
                        
                      <p id='pleft' className='flex place-self-start sm:place-self-center story-3-t w-[20%]'>
                          projects
                        </p>

                        <p id='pright' className="story-3-p font-second text-right w-[50%]">
                            On this site you will find clear and in-depth
                            descriptions of <a href="/Projects" className='font-black'>projects</a> and case studies
                            I have worked on that I am passionate about. <br /> <br />   
                        </p>
                      </div>

                    
                      <div className='highlights w-[100%] h-full sm:h-[55vh] gap-2 sm:gap-0 flex flex-col sm:flex-row justify-between place-items-center'>
                        <div style={{ backgroundImage: `url(${leftbg})` }} onMouseEnter={handlePjIsHoveredEnter} onMouseLeave={handlePjIsHoveredExit} id='imagepj1' className='w-[99%] sm:w-[49%] bg-cover relative h-[100%] justify-center items-center flex'>
                            <div id='blurpj1' className='w-[100%] absolute sm:h-[100%] '></div>
                            <div id='vidpj1' className='opacity-0 flex place-items-center cursor-pointer w-[80%] absolute h-[70%]'>
                              <video id='vidpj1' className='opacity-0 w-[100%] h-[100%]' src={leftvid} autoPlay muted loop playsInline></video>
                        </div>
                        </div>
                        
                        <div style={{ backgroundImage: `url(${leftbg})` }} onMouseEnter={handlePjTwoIsHoveredEnter} onMouseLeave={handlePjTwoIsHoveredExit} id='imagepj2' className='w-[99%] sm:w-[49%] bg-cover relative h-[100%] justify-center place-items-center place-content-center justify-items-center justify-content-center flex'>
                            <div id='blurpj2' className='w-[100%] absolute h-[100%] '></div>
                            <div id='vidpj2' className=' flex place-items-center cursor-pointer w-[80%] absolute h-[70%]'>
                              <video id='' className=' w-[100%] h-[100%] ' src={leftvid} autoPlay muted loop playsInline></video>
                            </div>
                        </div>
                      </div>
{/* 
                      <div className='pjnameCont w-[100%] h-[10vh] hidden sm:flex justify-between'>
                            <div className="pname1 flex flex-col w-[49%] place-items-start text-left">
                                    {projectData.length > 0 && (
                                        <p className='font-main'>
                                        {projectData[0].title}
                                        </p>
                                    )}
                                    {projectData.length > 0 && (
                                        <p className='font-second'>
                                        {projectData[0].subtitle}
                                        </p>
                                    )}            
                            </div>
                            <div className="pname2 flex flex-col w-[49%] place-items-start text-left">
                                {projectData.length > 0 && (
                                    <p className='font-main'>
                                    {projectData[1].title}
                                    </p>
                                )}
                                {projectData.length > 0 && (
                                    <p className='font-second'>
                                    {projectData[1].subtitle}
                                    </p>
                                )}    
                            </div>
                      </div> */}


                      <div className="see-all w-[100%] pt-3">
                      <NavLink to="/Projects" className=''>
                        <p className="story-3-p  see-all-text flex flex-col place-items-end">
                            see all
                            <span id=''className=''>Projects</span>
                        </p>
                        </NavLink>
                      </div>
                      </div>
                </section>
    </>
    
    
  );
};

// Export the component
export default HomepageSecThree;