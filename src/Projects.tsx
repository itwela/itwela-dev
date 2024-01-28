import React, {useState} from 'react';
import projectData from './ProjectsData';
import Homeicon from './home-icon';
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


// Define your functional component
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(projectData[0]);

    const fadeLeftOne = useRef(null);
    const fadeLeftTwo = useRef(null);
    useGSAP(() => {
        gsap.from(fadeLeftOne.current, {
            x: -100, // Starting position (above the screen)
            opacity: 0, // Starting opacity (completely transparent)
            duration: 1, // Duration of the animation
            ease: "sine.out", // Easing function for smoother animation
        })
    })
    useGSAP(() => {
        gsap.from(fadeLeftTwo.current, {
            x: -100, // Starting position (above the screen)
            opacity: 0, // Starting opacity (completely transparent)
            duration: 1, // Duration of the animation
            ease: "sine.out", // Easing function for smoother animation
        })
    })

  return (
    <>

    <section className='main-section w-[100vw] grid place-items-center'>
        <div className="extra-space w-[61.8vw] pt-10 relative">
          <Homeicon />
            <div ref={fadeLeftOne} className="title-container flex flex-col place-content-between w-[61.8vw]">
                <div className='project-buttons flex place-self-end pr-2 pb-2'>
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
                <div className="title-text">
                    <h1>Projects</h1>
                    <h2><em>& case studies.</em></h2>
                    <br />
                </div>
            </div>
            <div ref={fadeLeftTwo} className='project-container flex flex-col'>
          {/* Project buttons for toggling */}
          {/* Display selected project details */}
          <div className='project-details'>
            <div className="h-[50px] md:h-[100px] bg-cover bg-center w-[100%] pb-2" style={{backgroundImage: `url(${selectedProject.gif})`}}> </div>
            <h3 className='text-2xl'><br /> Title: <strong> {selectedProject.title} </strong> <br /></h3>
            <h3 className='text-md'><em>{selectedProject.subtitle}</em>
             <a className="plink h-[4em] mb-10" href={selectedProject.link}> {selectedProject.link} </a> 
            <br /> <br />
            </h3>
          </div>
        </div>
        </div>
        <div className="blog-start w-[61.8vw]">
          <p className=''>{selectedProject.description}
              <br />
          </p>
        </div>
        <div className="blog-middle w-[61.8vw] flex place-content-center relative text-left">
          {selectedProject.blog}
        </div>
    </section>
    </>
  );
};

// Export the component
export default Projects;