import { useRef, MouseEventHandler, useEffect, useState } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

import blueg from './assets/gradients/blue-g.jpg'
import obg from './assets/gradients/o-bg.jpg'
import CSSRulePlugin from 'gsap/CSSRulePlugin';
import './Homepage.css'
import HomepageSecThree from './hp3';
import HomepageSecFour from './hp4';
import { Color } from './color';
import HompageSecTwo from './hp2';
import HomepageSecOne from './hp1';
import { InView } from 'react-intersection-observer';
import {
  mockAllIsIntersecting,
  mockIsIntersecting,
  intersectionMockInstance,
} from 'react-intersection-observer/test-utils'
import Lenis from '@studio-freight/lenis';
import ItFooter from './footer';
import TextTransition, { presets } from 'react-text-transition';
import React from 'react';

// register

const offsetXAmountX = window.innerWidth / 6;
const offsetXAmountY = window.innerHeight / 6;




function Homepage() {



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


        

    }, [])

    // -------------------


     
  const triggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  const availwRef = useRef(null);
  const circleRef = useRef<HTMLDivElement>(null);


    return (
        <>
          <div id="root">
            <main className="main-wrapper text-[#1e1f21]/80 w-[100vw] min-h-[100svh]   ">  
                <HomepageSecOne refs={[triggerRef, availwRef, circleRef, mobileTriggerRef ]}/>

            </main> 
          </div>
        </>
    );
}

export default Homepage;
