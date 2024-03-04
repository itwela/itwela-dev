import React, {useState} from 'react';
import projectData from './ProjectsData';
import Homeicon from './home-icon';
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from 'gsap-trial/SplitText';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CSSRulePlugin from 'gsap/CSSRulePlugin';

 // register 
gsap.registerPlugin(ScrollTrigger);


// Define your functional component
const Projects = () => {
  // const [selectedProject, setSelectedProject] = useState(projectData[0]);


    useGSAP(() => {

        const t1 = gsap.timeline()

        t1.from(["#homeicon", "#projectid", "#casestudyid", "#bgimgid", "#articletitleid", "#articlesubid", "#articlelinkid"], {
          xPercent: "-100",
          duration: 1.3,
          delay: 0.3,
          stagger: 0.2,
          opacity: 0,
          ease: "bounce.in",
        }).from(["#blog-1", "#blog-2"], {
          opacity: 0,
          yPercent: "100",
          duration: 1.618,
          delay: 0.3,
          ease: "circ",
        }).from("#projectbuttonsid", {
          opacity: 0,
          xPercent: "100",
          duration: 0.3,
          delay: 0.3,
          ease: "circ",
        })
        
    }, [])

    const triggerRef = useRef(null);
      
    useGSAP(() => {
    
    const trigger = triggerRef.current;

    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "+=100",
        end: "+=500",
        scrub: true,
        // markers: true,
      },
      defaults: {
        duration: 2,
        ease: 'linear',
      }
    });
    t1.to((".main-wrapper"),{
      // opacity: 0.2, // Set your desired opacity value here
    })
    })

  return (
    <>

    <section className='main-wrapper w-[100vw] grid place-items-center bg-[#fcf7f8]'>
        <div className="extra-space w-[91.8vw] pt-20 relative">
            
          <div ref={triggerRef}></div>

            <div className="title-container flex flex-col place-content-between w-[91.8vw]">
                
                {/* <div id='projectbuttonsid' className='project-buttons font-second flex place-self-end pr-2 pb-2'>
                    {projectData.map((project, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedProject(project)}
                        className={selectedProject === project ? 'active' : ''}
                    >
                        {project.number}
                    </button>
                    ))}
                </div> */}

                <div className="title-text no-sb">
                    <h1 id='projectid' className='font-main'>Projects</h1>
                    <h2 id='casestudyid' className='font-second'><em>& case studies.</em></h2>
                    <br />
                </div>
            </div>
            <div className='project-container no-sb flex flex-col'>
          {/* Project buttons for toggling */}
          {/* Display selected project details */}


          {/* <div className='project-details font-second'>
            <div id='bgimgid' className="h-[50px] md:h-[100px] bg-cover bg-center w-[100%] pb-2" style={{backgroundImage: `url(${selectedProject.gif})`}}> </div>
            <h3 id='articletitleid' className='text-2xl'><br /> Title: <span className='font-main'><strong> {selectedProject.title} </strong></span> <br /></h3>
            <h3 id='articlesubid' className='text-md'><em>{selectedProject.subtitle}</em>
             <a id='articlelinkid' className="plink h-[4em] mb-10" href={selectedProject.link}> {selectedProject.link} </a> 
            <br /> <br />
            </h3>
          </div> */}


        </div>
        </div>

        {/* <div id='blog-1' className="blog-start w-[91.8vw] font-second">
          <p className='project-desc'>{selectedProject.description}
              <br />
          </p>
        </div> */}
        
        {/* <div id='blog-2' className="blog-middle w-[91.8vw] flex place-content-start relative text-left font-second">
          {selectedProject.blog}
        </div> */}

        {/* <div id='slideshow' className="sshow w-[91.8vw] flex place-content-start relative text-left translate-y-[-8rem]">
          {selectedProject.slideshow}
        </div> */}


        {/* <div id='projectbuttonsid' className='project-buttons font-second flex place-self-center md:place-self-end pb-[2em] md:pr-[4em] '>
                    {projectData.map((project, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedProject(project)}
                        className={selectedProject === project ? 'active' : ''}
                    >
                        {project.number}
                    </button>
                    ))}
        </div> */}


    </section>
    </>
  );
};

// Export the component
export default Projects;