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
import HompageSecTwo from './hp2';
import HomepageSecOne from './hp1';

// register
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

const offsetXAmount = window.innerWidth / 6;


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

          gsap.from(['#pron1', '#pron2', '#pron3', '#pron4'], {
              opacity: 0,
              y: '-30',
              stagger: 0.3
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

    

    })
  })


    return (
        <>
        {/* <div id="canvas" className='fixed z-[100000000] w-[100vw] h-[100vh]'></div> */}
        {/* <Color/> */}
        <div id="root">
          {/* <div className="gradient absolute min-h-screen w-full"></div> */}
           <main className="main-wrapper w-[100vw] max-h-max">
               
              <HomepageSecOne refs={[triggerRef, availwRef, circleRef, mobileTriggerRef ]}/>

              <HompageSecTwo/>

               <HomepageSecFour/>
           </main> 
        </div>
        </>
    );
}

export default Homepage;
