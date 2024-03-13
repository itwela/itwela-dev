import React, { forwardRef } from 'react';
import projects from './hp2ProjectData'



export default function HompageSecTwo() {
    return (
        <>
            <div  className="w-full h-max bg-[#fcf7f8]">
                <div  className="flex flex-col gap-8  w-full h-full place-items-start place-content-start">
                    <h2 className='font-second font-bold text-5xl text-[#1e1f21]'>Projects</h2>
                    
                    {projects.map(project => (
                        <div key={project.id} className='flex flex-col w-full h-max gap-5'>
                                <div id='pImg' style={{ backgroundImage: `url(${project.imageUrl})` }} className='w-full h-[60vh] relative flex flex-col justify-between'>
                                    <span id='pStatus' className='font-main outline outline-[1px] outline-[#1e1f21] px-3 py-1 h-max w-max rounded-full'>
                                        {project.status}
                                    </span>
                                    <span className='place-self-center'>
                                        Images coming soon..
                                    </span>
                                    <span id='pTools' className='flex flex-wrap gap-2 place-content-end place-self-end w-[50%]'>
                                        {project.toolsUsed.map((tool, index) => (
                                            <h3 key={index} className=' w-max my-2 rounded-full px-3 outline outline-[1px] outline-[#1e1f21]'>{tool}</h3>
                                        ))}
                                    </span>                               
                                </div>
                                <div id='pInfo' className='flex flex-col gap-2'>
                                    <h3 className=''>{project.description}</h3>
                                    <h3 className='text-[#1e1f21] font-main'>{project.name}</h3>
                                </div> 
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


