import { useGSAP } from '@gsap/react';
import leftvid from './assets/p3vid.mp4'
import ReactPlayer from 'react-player/lazy'
import gsap from 'gsap';
import { useRef } from 'react';
import HompageSecTwo from './hp2';
import HomepageSecFour from './hp4';
import ItFooter from './footer';
import React from 'react';
import TextTransition, { presets } from 'react-text-transition';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function HomepageSecOne({triggerRef, availwRef, circleRef, mobileTriggerRef }: any) {
  
  
  const triggReferSec = useRef(null);
   
  const TEXTS = ['full-stack-developer', 'software engineer', 'passion for learning'];
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      2618, // every 2 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
      
  useGSAP(() => {
      
    const trigger = triggReferSec.current;


    const t1 = gsap.timeline({
      scrollTrigger: {
          trigger: trigger,
          start: "0% center",
          end: "10% center",
          scrub: true,
      },
      defaults: {
        duration: 2,
          ease: 'power1.in',
      },
    });

    t1.to('#overlap', {
       y: '-7%'
    })

  })

  
  return (
        <>
        <div className='bg-[#fcf7f8] flex flex-col place-items-center ' ref={triggerRef}>
                  <section id='ccol' className="pt-[10vh] sm:pt-[0vh] h-max first-section flex flex-col justify-between w-[100vw] sm:w-[80vw] p-4 sm:p-8 bg-[#fcf7f8]">
                    <div ref={availwRef} id='new-vp' className=" extra-space  flex flex-col  place-content-center relative ">
                        <div className="title-wrapper  flex flex-col gap-8  ">
                            
                            
                            <div id='hello' className="title-container  sm:h-[60vh] place-content-center  relative flex flex-col">
                                
                                <div className='flex flex-col gap-5 '>
                                  
                                  <svg id='myname' width="100%" height="100%" viewBox="0 0 1240 243" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='xMidYMid meet'>
                                    <path d="M50.6 0.299995V243H0.800001V0.299995H50.6ZM66.7367 0.299995H289.637V48.9H205.037V243H151.337V48.9H66.7367V0.299995ZM582.373 -1.85966e-05H633.373L558.373 243H500.773L456.673 89.1L412.573 243H354.973L279.973 0.299995H330.973L383.773 175.8L431.173 0.299995H482.173L529.573 175.5L582.373 -1.85966e-05ZM645.331 0.299995H818.731V48.9H697.831V92.1L798.631 92.7V141L697.831 140.7V194.7H818.731V243H645.331V0.299995ZM900.301 194.4H1018.8V243H846.601V0.299995H900.301V194.4ZM1188.55 243L1169.65 192.9H1080.25L1061.35 243H1010.35L1099.45 0.299995H1155.85L1239.85 243H1188.55ZM1097.05 148.2H1152.85L1124.95 74.4L1097.05 148.2Z" fill="#1e1f21"/>
                                  </svg>
                                  
                                  <div className='w-full h-max'>

                                    <div className='w-full flex justify-between'>
                                      <p id='pron1' className=" font-second"><TextTransition className="" springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>.</p>
                                      <p id='pron2' className=" font-second">(ee - tway - la)</p>
                                    </div>
                                   

                                  </div>

                                </div>
                                
                            </div>

                            <div id='aboutslide'  ref={triggReferSec} className='hidden sm:flex flex-col text-[#1e1f21]/80 relative  gap-5 w-full h-full justify-between  font-second '>
                                <div className='flex flex-col  gap-5 text-left sm:text-left place-content-start w-full h-max'>
                                  <div className='flex justify-between'>
                                  <p className=''>About Me</p>
                                  <p className='font-second hidden sm:flex '>scroll</p>
                                  </div>
                                  <h2 className='font-second font-bold text-5xl text-[#1e1f21]'>Hi,</h2>
                                  <div id='overlap' className='z-1 h-max bg-[#fcf7f8] flex flex-col gap-8'>
                                      <div className='mb-[6.18em] flex flex-col gap-8'>
                                        <div className='w-full h-[1px] bg-[#1e1f21]/80'></div>
                                        <p className="intro-story ">
                                        My name is Itwela Ibomu.
                                        I am proud to say I am currently a Software Engineering Fellow @ <a href="https://headstarter.co/" target='_blank' className="font-black"> Headstarter. </a> 
                                        <br /> <br /> 
                                        I am deeply immersed in the world of tech,
                                        with experience using frontend tools like <a className="spec-link font-black" href="" target="blank">TypeScript, </a> <a href="https://reactjs.org/" target="blank" className="spec-link font-black">React</a>, and <a className="spec-link font-black" href="https://nextjs.org/" target="blank">Next.js</a>,
                                        backend frameworks like <a className="spec-link font-black" href="https://nodejs.org/en/" target="blank">Node</a>, <a className="spec-link font-black" href="https://www.postgresql.org/" target="blank">PostgreSQL</a>, and programming languages such as <a className="spec-link font-black" href="https://www.python.org/" target="blank">Python</a>, and <a className="spec-link font-black" href="https://www.java.com/en/" target="blank">Java</a>.
                                        Majority of my work is open-source and available on <a className="spec-link font-black" href="https://github.com/itwela" target="blank">Github</a>. You can also connect with me on <a className="spec-link font-black" href="https://www.linkedin.com/in/itwela/" target="blank">Linkedin </a> and <a className="spec-link font-black" href="https://www.tiktok.com/@twezo?_t=8oGzCbss0q2&_r=1" target="blank">TikTok</a> where I post about my professional journey and growth as a developer. 
                                        </p>
                                        <p>Scroll further to see some of my projects I've been working on recently.</p>
                                      </div>
                                      <HompageSecTwo />
                                  </div>
                                </div>
                            </div>

                            <div   className='sm:hidden flex flex-col text-[#1e1f21]/80 relative  gap-5 w-full h-max justify-between   font-second '>
                                <div className='flex flex-col  gap-5 text-left sm:text-left place-content-start w-full h-max'>
                                  <div className='flex justify-between'>
                                  <p className=''>About Me</p>
                                  <p className='font-second hidden sm:flex '>scroll</p>
                                  </div>
                                  <h2 className='font-second font-bold text-5xl text-[#1e1f21]'>Hi,</h2>
                                  <div  className='z-1 h-max bg-[#fcf7f8] flex flex-col gap-8'>
                                      <div className='mb-[6.18em] flex flex-col gap-8'>
                                        <div className='w-full h-[1px] bg-[#1e1f21]/80'></div>
                                        <p className="intro-story ">
                                        My name is Itwela Ibomu.
                                        I am proud to say I am currently a Software Engineering Fellow @ <a href="https://headstarter.co/" target='_blank' className="font-black"> Headstarter. </a>
                                        <br /> <br /> 
                                        I am deeply immersed in the world of tech,
                                        with experience using frontend tools like <a className="spec-link font-black" href="" target="blank">TypeScript, </a> <a href="https://reactjs.org/" target="blank" className="spec-link font-black">React</a>, and <a className="spec-link font-black" href="https://nextjs.org/" target="blank">Next.js</a>,
                                        backend frameworks like <a className="spec-link font-black" href="https://nodejs.org/en/" target="blank">Node</a>, <a className="spec-link font-black" href="https://www.postgresql.org/" target="blank">PostgreSQL</a>, and programming languages such as <a className="spec-link font-black" href="https://www.python.org/" target="blank">Python</a>, and <a className="spec-link font-black" href="https://www.java.com/en/" target="blank">Java</a>.
                                        Majority of my work is open-source and available on <a className="spec-link font-black" href="https://github.com/itwela" target="blank">Github</a>. You can also connect with me on <a className="spec-link font-black" href="https://www.linkedin.com/in/itwela/" target="blank">Linkedin </a> and <a className="spec-link font-black" href="https://www.tiktok.com/@twezo?_t=8oGzCbss0q2&_r=1" target="blank">TikTok</a> where I post about my professional journey and growth as a developer. 
                                        </p>
                                        <p>Scroll further to see some of my projects I've been working on recently.</p>

                                      </div>
                                      <HompageSecTwo />
                                  </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>



                        
                        



                      
                    <HomepageSecFour />

                    <ItFooter/>

                  </section>    
        </div>
        </>
    )
}