import React, { forwardRef, useEffect, useLayoutEffect } from 'react';
import projects from './🔵hp2ProjectData'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';


export default function HompageSecTwo() {

    useEffect(() => {
        resetPosition();

        return () => {
            gsap.killTweensOf('#theHovers');
            gsap.killTweensOf('#theHoversImg');
        };
    }, []);

    const [isClicked, setIsClicked] = React.useState(false);

    const handleHoverEnter = (e: any) => {
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
        }, 5000); // 5000 milliseconds = 5 seconds
    }; 

    const resetPosition = () => {
        try {
            gsap.to('#theHovers', {opacity: 0, y: 10});
            gsap.to('#theHoversImg', {backgroundSize: '130%'});
            setIsClicked(false)
        } catch (error) {
            console.error('An error occurred during resetPosition:', error);
        }
    };

    const clickAnimation = () => {
        try {
            gsap.to('#theHovers', {opacity: 1, y: 0});
            gsap.to('#theHoversImg', {backgroundSize: '115%'});
        } catch (error) {
            console.error('An error occurred during hoverAnimation:', error);
        }
    };

    const exitHoverAnimation = () => {
        try {
            gsap.from('#theHovers', {opacity: 0, y: 10});
            gsap.from('#theHoversImg', {backgroundSize: '130%'});
        } catch (error) {
            console.error('An error occurred during exitHoverAnimation:', error);
        }
    };

    if (isClicked !== false) {
        clickAnimation();
    }


    

   

   
    return (
        <>
            <div  className="hidden sm:flex flex-col w-full h-max bg-[#fcf7f8] ">
                <h2  id='projectheader' className='font-second cursor-pointer font-bold text-5xl text-[#1e1f21] mb-8'>Projects</h2>
                <div className="flex flex-col gap-8  w-full  place-items-start place-content-start">

                        
                    {projects.map((project, index) => (
                        <div key={index} className='flex flex-col w-full h-max gap-5'>
                            <div onClick={() => setIsClicked(true)} id='theHoversImg' style={{ backgroundImage: `url(${project.imageUrl})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} className='w-full h-[60vh] p-6 sm:p-8  relative flex flex-col justify-between bg-center'>
                                <span className='flex justify-between w-full h-max pointer-events-none py-[1.5em] md:py-0 place-items-center'>
                                    <span id='pStatus' className='select-none font-main bg-[#1e1f21] text-[#fcf7f8] px-3 py-1 h-max w-max rounded-full'>
                                        {project.status}
                                    </span>
                                    <span className='font-bold text-[#fcf7f8] w-max my-2 rounded-full px-3 bg-[#1e1f21]/40 bg-blur-lg'>
                                        {project.date}
                                    </span>

                                </span>
                                <span onClick={() => setIsClicked(false)} id='theHovers' className='pointer-events-none bg-[#1e1f21]/40 bg-blur-lg px-2 rounded-full  place-self-center text-[#fcf7f8] font-main'>
                                    {project.name}
                                </span>
                                <span id='theHovers' className='flex pointer-events-none flex-wrap gap-2 place-content-end place-self-end w-[50%]'>
                                    {project.toolsUsed.map((tool, toolIndex) => (
                                        <h3 key={toolIndex} className='font-bold text-[#fcf7f8] w-max my-2 rounded-full px-3 bg-[#1e1f21]/40 bg-blur-lg'>{tool}</h3>
                                    ))}
                                </span>                               
                            </div>
                            <div  onClick={() => resetPosition()} className='flex flex-col gap-2 w-full'>
                                <h3 className=''>{project.description}</h3>
                                <h3 className='text-[#1e1f21] font-main hover:opacity-70'><a href={project.projectLink}>{project.name}</a></h3>
                                <div className='w-full h-[1px] bg-[#1e1f21]/40'></div>
                            </div> 
                        </div>
                    ))}

                </div>
            </div>

            {/* Mobile */}
            <div  className="sm:hidden w-full bg-[#fcf7f8] ">
                <h2 className='font-second font-bold  text-5xl text-[#1e1f21] mb-8'>Projects</h2>
                <div   className="flex flex-col gap-8  w-full   place-items-start place-content-start">
                    {projects.map((project, index) => (
                        <div key={index}  className='flex flex-col w-full  gap-5'>
                                <div style={{ backgroundImage: `url(${project.imageUrl})` }} className='w-full h-[30vh] p-4 sm:p-8 relative flex flex-col justify-between bg-cover bg-center'>
                                    <span className='flex justify-between w-full h-max place-items-center'>
                                        <span id='pStatus' className='select-none font-main bg-[#1e1f21] text-[#fcf7f8] px-3 py-1 h-max w-max rounded-full'>
                                            {project.status}
                                        </span>
                                        <span className='font-bold text-[#fcf7f8] w-max my-2 rounded-full px-3 bg-[#1e1f21]/40 bg-blur-lg'>
                                            {project.date}
                                        </span>
                                    </span>
                                    <span id='pNameMobile' className='place-self-center text-[#fcf7f8] font-main'>
                                        <a href={project.projectLink} target='_blank'>{project.name}</a>
                                    </span>
                                    <span id='pToolsMobile' className='flex h-max flex-wrap scale-[80%] gap-2 place-content-end place-self-end w-full'>
                                            <h3  className='select-none text-[#fcf7f8] w-max my-2 rounded-full px-3 bg-[#1e1f21]/40 bg-blur-lg"'>{project.toolsUsed[0]} + {project.toolsUsed.length - 1}</h3>
                                    </span>                               
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h3 className=''>{project.description}</h3>
                                    <h3 className='text-[#1e1f21] font-main'><a href={project.projectLink}>{project.name}</a></h3>
                                </div> 
                                <div className='w-full h-[1px] bg-[#1e1f21]/40'></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


