import { useRef, MouseEventHandler, useEffect, useState } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'
import blueg from './assets/gradients/blue-g.jpg'
import obg from './assets/gradients/o-bg.jpg'
import CSSRulePlugin from 'gsap/CSSRulePlugin';
import './Homepage.css'
import HomepageSecThree from './hp3';
import HomepageSecFour from './hp4';
import { Color } from './color';
import leftvid from './assets/p3vid.mp4'

// register
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

const offsetXAmount = window.innerWidth / 6;


// const moveCircle = (e: MouseEvent) => {

//   const circle = document.getElementsByClassName('ss') as HTMLCollectionOf<HTMLElement>;
  
//   if (!circle) return;


//   gsap.to(circle, {
//       x: (e.pageX - offsetXAmount) / 2,
//       ease: 'sine.outt'
//   });
  
// };


const moveCircle = (e: MouseEvent) => {
  const circle = document.getElementsByClassName('ss') as HTMLCollectionOf<HTMLElement>;
  const recent = document.getElementsByClassName('recent') as HTMLCollectionOf<HTMLElement>;

  if (circle.length > 0) {
    const firstCircle = circle[0];
    const left = firstCircle.offsetLeft;
    const top = firstCircle.offsetTop;
    const disX = e.pageX - offsetXAmount;
    const vidwidth = left + window.scrollX;
    const distance = Math.sqrt(disX ** 2 + vidwidth ** 2);

    // Check if the pageX is within the window outer width
    if (e.pageX < window.outerWidth) {
      const cwidth = circle[0].offsetWidth;

      gsap.to(circle, {
        x: -cwidth / 1.18 + e.pageX / 1.618,
        ease: 'sine.out'
      });

      gsap.to(recent, {
        x: -offsetXAmount / 16.18 + (-e.pageX + cwidth) / 18.618,
        ease: 'sine.out'
      });
    }
  }
};



function Homepage() {

  const lenis = new Lenis()

lenis.on('scroll', (e: number) => {
  console.log(e)
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

  // const lenis = new Lenis()

  // lenis.on('scroll', () => {
  // })
  
  // lenis.on('scroll', ScrollTrigger.update)
  
  // gsap.ticker.add((time)=>{
  //   lenis.raf(time * 1000)
  // })
  
  // gsap.ticker.lagSmoothing(0)


    // onload gsap   
    useGSAP(() => {

          gsap.from("#myname", {
            yPercent: "10",
            duration: 1.3,
            delay: 0.3,
            opacity: 0,
            ease: "back",
          })

          gsap.from('.intro-story', {
            opacity: 0,
            y: '10%',
            duration: 2,
          })

          gsap.set('#hi-im', {
            display: 'none'
          })
          

      }, [])

      // -------------------

    // Add event listener for mousemove when component mounts
    useEffect(() => {
        // Add event listener for mousemove
        document.addEventListener('mousemove', moveCircle);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('mousemove', moveCircle);
        };
    }, []);
     
    const triggerRef = useRef(null);
    const mobileTriggerRef = useRef(null);
    const availwRef = useRef(null);
    const circleRef = useRef<HTMLDivElement>(null);
   
    let mm = gsap.matchMedia();
   
    mm.add("(min-width: 640px)", () => {
        useGSAP(() => {
          
        const trigger = triggerRef.current;
        const circle = document.getElementById('ss') as HTMLDivElement;

        const targetElement = document.querySelector<HTMLDivElement>('#coordinate-container'); // Get the coordinate container element
        const targetTop = targetElement?.getBoundingClientRect()?.top || 0; // Get the top position of the coordinate container


        const t1 = gsap.timeline({
          scrollTrigger: {
              trigger: trigger,
              start: "30% center",
              end: "61.8% center",
              scrub: true,
              // markers: true,
              ontouchstart: () => {
                gsap.set('#yellow-ss', {
                  borderRadius: '0.5em',
                  width: '30vw',
                  height: '10em'
                })
              }
          },
          defaults: {
            duration: 2,
              ease: 'power1.in',
          },
        });

        gsap.set('#ss', {
          top: '10em'
        })



        t1.to(("#ss"), {
          y: '90dvh',
          x: 0,
          position: 'absolute',
          // bottom: '50%'
        })
        .fromTo('#yellow-ss',{
          borderRadius: '1em',
          width: '30vw',
          height: '10em'
        }, {
          width: '70vw',
          height: '60vh'
        }).to('#rpid', {
          backgroundColor: '#1b1c1c'
          }).to('#ccol', {
          color: '#fcf7f8',
          backgroundColor: '#1b1c1c'     
        }).to("#menu-wrapper", {
          backgroundColor: '#1b1c1c',
          color: '#fcf7f8'
        })
      })
    })

    mm.add("(min-width: 800px)", () => {
        useGSAP(() => {
          
        const trigger = triggerRef.current;
        const circle = document.getElementById('ss') as HTMLDivElement;

        const targetElement = document.querySelector<HTMLDivElement>('#coordinate-container'); // Get the coordinate container element
        const targetTop = targetElement?.getBoundingClientRect()?.top || 0; // Get the top position of the coordinate container


        const t1 = gsap.timeline({
          scrollTrigger: {
              trigger: trigger,
              start: "30% center",
              end: "61.8% center",
              scrub: true,
              // markers: true,
              ontouchstart: () => {
                gsap.set('#yellow-ss', {
                  borderRadius: '0.5em',
                  width: '30vw',
                  height: '10em'
                })
              }
          },
          defaults: {
            duration: 2,
              ease: 'power1.in',
          },
        });

        gsap.set('#ss', {
          top: '10em'
        })
        t1.to(("#ss"), {
          y: '70dvh',
          x: 0,
          position: 'absolute',
          // bottom: '50%'
        })
        .fromTo('#yellow-ss',{
          borderRadius: '1em',
          width: '30vw',
          height: '10em'
        }, {
          width: '70vw',
          height: '60vh'
        }).to('#rpid', {
          backgroundColor: '#1b1c1c'
          }).to('#ccol', {
          color: '#fff',
          backgroundColor: '#1b1c1c'     
        }).to("#menu-wrapper", {
          backgroundColor: '#1b1c1c',
          color: '#fff'
        })
      })
    })

    // mobile

    mm.add("(max-width: 639px)", () => {
      useGSAP(() => {
        
      const mobileTrigger = mobileTriggerRef.current;

      const targetElement = document.querySelector<HTMLDivElement>('#coordinate-container'); // Get the coordinate container element


      const t1mobile = gsap.timeline({
        scrollTrigger: {
            trigger: mobileTrigger,
            start: "-10% center",
            end: "41.8% center",
            scrub: true,
            // markers: true,
        },
        defaults: {
          duration: 2,
            ease: 'power1.in',
        },
      });

      t1mobile.from(['#yellow-ss','#rpid'], {
        scale: 0.2,
        yPercent: '-50',
        opacity: 0
      })
    })
  })


    return (
        <>
        {/* <div id="canvas" className='fixed z-[100000000] w-[100vw] h-[100vh]'></div> */}
        {/* <Color/> */}
        <div id="root">
          {/* <div className="gradient absolute min-h-screen w-full"></div> */}
           <main className="main-wrapper">
              <div ref={triggerRef}>
                  <section id='ccol' className="first-section w-[100vw] bg-[#fcf7f8] flex flex-col place-items-center place-content-center">
                    <div ref={availwRef} id='new-vp' className="extra-space flex flex-col  place-content-start w-[91.8vw] place-items-center font-main relative h-[200vh]">
                        <div className="title-wrapper pb-5">
                            <div id='hello' className="title-container relative flex flex-col place-items-center place-content-center justify-content-center justify-items-center w-[91.8vw] ">
                                <h1 id='hi-im' className="hi">Hello, I'm</h1>
                                {/* <h1 id='myname' className="hi">ITWELA</h1> */}
                                
                                <svg id='myname' width="100%" height="100%" viewBox="0 0 1240 243" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='xMidYMid meet'>
                                <path d="M50.6 0.299995V243H0.800001V0.299995H50.6ZM66.7367 0.299995H289.637V48.9H205.037V243H151.337V48.9H66.7367V0.299995ZM582.373 -1.85966e-05H633.373L558.373 243H500.773L456.673 89.1L412.573 243H354.973L279.973 0.299995H330.973L383.773 175.8L431.173 0.299995H482.173L529.573 175.5L582.373 -1.85966e-05ZM645.331 0.299995H818.731V48.9H697.831V92.1L798.631 92.7V141L697.831 140.7V194.7H818.731V243H645.331V0.299995ZM900.301 194.4H1018.8V243H846.601V0.299995H900.301V194.4ZM1188.55 243L1169.65 192.9H1080.25L1061.35 243H1010.35L1099.45 0.299995H1155.85L1239.85 243H1188.55ZM1097.05 148.2H1152.85L1124.95 74.4L1097.05 148.2Z" fill="black"/>
                                </svg>

                                <div className='w-[91.8vw] flex justify-between pt-2'>
                                  <h1 id='pronnn' className="text-[3vw] font-second">software engineer</h1>
                                  <h1 id='pronnn' className="text-[3vw] font-second">(ee - tway - la)</h1>
                                </div>
                                <div className='w-[91.8vw] flex justify-between pt-2'>
                                  <h1 id='pronnn' className="text-[3vw] font-second">web developer</h1>
                                </div>
                                <div className='w-[91.8vw] flex justify-between pt-2'>
                                  <h1 id='pronnn' className="text-[3vw] font-second">passion for learning</h1>
                                </div>
                                {/* <p className="pron"><em>(ee - tway - la)</em></p> */}
                            </div>
                      
                            <div className='sm:hidden w-[91.8vw] h-[100vh] absolute z-[1] top-0 flex place-items-center'>
                              <div className='flex w-[100%] text-left text-[0.6em] place-items-center'>
                                <p className="intro-story font-second">My name is Itwela Ibomu. I am a <span className="font-black"> software engineer </span>deeply immersed in the world of code, with a focus in <a className="spec-link font-black" href="" target="blank">React, </a><a className="spec-link font-black" href="https://www.python.org/" target="blank">Python</a>, and <a className="spec-link font-black" href="https://www.java.com/en/" target="blank">Java</a>. Majority of my work is open-source and available on <a className="spec-link font-black" href="https://github.com/itwela" target="blank">Github</a>. You can also connect with me on <a className="spec-link font-black" href="https://www.linkedin.com/in/itwela/" target="blank">Linkedin </a>where I post about my professional journey and growth as a developer. </p>
                              </div>
                            </div>

                            
                            <div className='absolute hidden sm:flex flex sm:w-[50vw] text-left sm:text-left place-content-center sm:bottom-[60%] text-[0.7em] sm:text-[0.4em]'>
                              <p className="intro-story font-second w-[90%]">My name is Itwela Ibomu. I am a <span className="font-black"> software engineer </span>deeply immersed in the world of code, with a focus in <a className="spec-link font-black" href="" target="blank">TypeScript, </a><a className="spec-link font-black" href="https://www.python.org/" target="blank">Python</a>, and <a className="spec-link font-black" href="https://www.java.com/en/" target="blank">Java</a>. Majority of my work is open-source and available on <a className="spec-link font-black" href="https://github.com/itwela" target="blank">Github</a>. You can also connect with me on <a className="spec-link font-black" href="https://www.linkedin.com/in/itwela/" target="blank">Linkedin </a>where I post about my professional journey and growth as a developer. </p>
                            </div>
                        
                          
                            <div className='absolute bottom-[60%] right-0 text-[0.4em]'>
                             <p className='font-second'>scroll for more</p>
                            </div>

                        </div>
                        
                        <div ref={circleRef} id='ss' className='ss absolute z-[1]'>
                          {/* <div id='yellow-ss' className='bg-[#ffcc00] rounded-[1.6em]'></div> */}
                          <div id='yellow-ss' className='hidden sm:flex rounded-[1.6em] flex flex-col gap-2 cursor-pointer relative p-2 flex place-items-end'>
                          <p id='rpid' className='recent p-3 rounded-[0.5em] mix-blend-difference bg-[#fcf7f8]'>recent projects</p>
                            <video id='' className=' w-[90%] rounded-[1.2em] ' src={leftvid} autoPlay muted loop playsInline></video>
                          </div>
                        </div>

{/* mobile stuff */}
                        <div ref={mobileTriggerRef} className='h-[100vh] absolute bottom-0 flex w-[100vw] justify-self-end place-items-center place-content-center'>
                           <div id='yellow-ss' className='sm:hidden w-[90vw] rounded-[1.6em] flex flex-col gap-2 cursor-pointer relative p-2 flex place-items-end'>
                          <p id='rpid' className=' p-3 rounded-[0.5em] mix-blend-difference bg-[#fcf7f8]'>recent projects</p>
                            <video id='' className=' w-[100%] rounded-[1.2em] ' src={leftvid} autoPlay muted loop playsInline ></video>
                          </div>
                        </div>

                    </div>
                 
                  </section>
            

              </div> 

                {/* <HomepageSecThree/> */}

               <HomepageSecFour/>
           </main> 
        </div>
        </>
    );
}

export default Homepage;
