import React, {useState} from 'react';
import projectData from './ProjectsData';
import Homeicon from './home-icon';
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from 'gsap-trial/SplitText';
import { ScrollTrigger } from "gsap/ScrollTrigger";


// register 

// Define your functional component
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(projectData[0]);


    useGSAP(() => {

        const t1 = gsap.timeline()

        t1.from(["#homeicon", "#projectid", "#casestudyid", "#bgimgid", "#articletitleid", "#articlesubid", "#articlelinkid"], {
          xPercent: "-100",
          duration: 1.3,
          delay: 0.3,
          stagger: 0.2,
          opacity: 0,
          ease: "back",
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

  return (
    <>

    <section className='main-section w-[100vw] grid place-items-center'>
        <div className="extra-space w-[91.8vw] pt-20 relative">
            <div className="title-container flex flex-col place-content-between w-[91.8vw]">
                <div id='projectbuttonsid' className='project-buttons flex place-self-end pr-2 pb-2'>
                    {projectData.map((project, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedProject(project)}
                        className={selectedProject === project ? 'active' : ''}
                    >
                        {project.number}
                    </button>
                    ))}
                </div>
                <div className="title-text no-sb">
                    <h1 id='projectid'>Projects</h1>
                    <h2 id='casestudyid'><em>& case studies.</em></h2>
                    <br />
                </div>
            </div>
            <div className='project-container no-sb flex flex-col'>
          {/* Project buttons for toggling */}
          {/* Display selected project details */}
          <div className='project-details'>
            <div id='bgimgid' className="h-[50px] md:h-[100px] bg-cover bg-center w-[100%] pb-2" style={{backgroundImage: `url(${selectedProject.gif})`}}> </div>
            <h3 id='articletitleid' className='text-2xl'><br /> Title: <strong> {selectedProject.title} </strong> <br /></h3>
            <h3 id='articlesubid' className='text-md'><em>{selectedProject.subtitle}</em>
             <a id='articlelinkid' className="plink h-[4em] mb-10" href={selectedProject.link}> {selectedProject.link} </a> 
            <br /> <br />
            </h3>
          </div>
        </div>
        </div>
        <div id='blog-1' className="blog-start w-[91.8vw]">
          <p className='project-desc'>{selectedProject.description}
              <br />
          </p>
        </div>
        <div id='blog-2' className="blog-middle w-[91.8vw] flex place-content-start relative text-left">
          {selectedProject.blog}
        </div>
    </section>
    </>
  );
};

// Export the component
export default Projects;