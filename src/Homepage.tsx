import { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as ReactLogo } from './assets/react.svg';
import { ReactComponent as ViteLogo } from './assets/vite.svg';
import { ReactComponent as TypescriptLogo } from './assets/typescript.svg';
import { ReactComponent as ScssLogo } from './assets/scss.svg';
import me from './assets/me-picture.jpg'
import styles from './App.module.scss';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from 'gsap-trial/SplitText';


// register


function Homepage() {

    // stager - state 1    
    useGSAP(() => {

        // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
        // const words = splitText.words;

          const t1 = gsap.timeline()
          t1.from("#hello", {
            yPercent: "-100",
            duration: 1.3,
            delay: 0.3,
            opacity: 0,
            ease: "back",
          }).from("#yaboi", {
            opacity: 0,
            duration: 1.3,
            delay: 0.3,
            ease: "circ",
          }).from("#bottom",{
            yPercent: "+=200",
            duration: 2.3,
            ease: "circ",
            opacity: 0,
          })
          
        // // Animate each line
        //  words.forEach((word) => {
        //     t1.from(word, {
        //         opacity: 0,
        //         y: "+=10",
        //         duration: 0.106,
        //         ease: "bounce",
        //     });
        //  });
        // return () => ctx.revert()
      }, [])

    return (
        <>
        <div id="root">
           <main className="main-wrapper">
                <section className="main-section w-[100vw] flex place-content-center mb-[5em]">
                   <div className="extra-space w-[61.8vw] relative pt-20 pb-[10em]">
                    <div className="title-wrapper flex justify-between pb-5 h-[13em] w-[61.8vw] gap-3 top-0 place-items-start">
                        <div id='hello' className="title-container">
                            <h1 className="hi">Hello,</h1>
                            <h1 className="hi">I'm Itwela.</h1>
                            <p className="story"><em>(ee - tway - la)</em><br /> <br /></p>
                        </div>
                            <div className="intro-container-1">
                                <img id='yaboi' className='yaboi rounded-[20em] w-[81.8px] left-[80%] md:top-[6.18%] md:left-[100%] top-[-2] ' src={me} alt="itwela ibomu" />
                        </div>
                    </div>
                    <div id='bottom' className="intro-container-2 h-[50vh]">
                        <p className="story-1-p">
                            My name is Itwela Ibomu. I am a <span className='font-black'> software engineer </span>currently based in Atlanta, GA. 
                            I'm deeply immersed in the world of code, with a focus in <a className='spec-link font-black' href="https://react.dev/" target='blank'>React, </a><a className='spec-link font-black' href="https://www.python.org/" target='blank'>Python</a>, and <a className='spec-link font-black' href="https://www.java.com/en/" target='blank'>Java</a>. 
                            Majority of my work is open-source and available
                            on <a className='spec-link font-black' href="https://github.com/itwela" target='blank'>Github</a>. 
                            You can also connect with me on <a className='spec-link font-black' href="https://www.linkedin.com/in/itwela/" target='blank'>Linkedin </a>
                            where I post about my professional journey and growth
                            as a developer. <br />  <br />
                        </p>

                        <p className="story-2-p">
                            On this site you will find clear and in-depth
                            descriptions of <a id='projects' href="/Projects" className='font-black'>projects</a> and case studies
                            I have worked on that I am passionate about. <br /> <br />   
                        </p>
                        <p className="story-3-p">
                        Outside of programming and school, I enjoy 
                        producing music, green tea, trading and reading (memoirs, self-help, and manga are some of favorites).   
                        </p>
                    </div>
                   </div>
                </section>
           </main> 
        </div>
        </>
    );
}

export default Homepage;
