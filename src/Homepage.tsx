import { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as ReactLogo } from './assets/react.svg';
import { ReactComponent as ViteLogo } from './assets/vite.svg';
import { ReactComponent as TypescriptLogo } from './assets/typescript.svg';
import { ReactComponent as ScssLogo } from './assets/scss.svg';
import me from './assets/me-picture.jpg'
import styles from './App.module.scss';

function Homepage() {

    return (
        <>
        <div id="root">
           <main className="main-wrapper">
                <section className="main-section w-[100vw] flex place-content-center mb-[5em]">
                   <div className="extra-space w-[61.8vw] relative pt-20 pb-[10em]">
                    <div className="title-wrapper flex justify-between pb-5  w-[61.8vw] top-0">
                        <div className="title-container">
                            <h1 className="hi">Hello,</h1>
                            <h1 className="hi">I'm Itwela.</h1>
                            <p className="story"><em>(ee - tway - la)</em><br /> <br /></p>
                        </div>
                            <div className="intro-container-1">
                                <img className='yaboi rounded-[20em] w-[81.8px] left-[80%] top-[6.18%] md:left-[100%] absolute scale-x-[-1] ' src={me} alt="itwela ibomu" />
                        </div>
                    </div>
                    <div className="intro-container-2 h-[50vh]">
                        <p className="story-1-p">
                            I am a <span className='font-black'> software engineer </span>currently based in Atlanta, GA. 
                            I'm deeply immersed in the world of code, 
                            with a focus in <a className='spec-link font-black' href="https://react.dev/" target='blank'>React</a>,  
                            <a className='spec-link font-black' href="https://www.python.org/" target='blank'> Python</a>, and <a className='spec-link font-black' href="https://www.java.com/en/" target='blank'>Java</a>. 
                            Majority of my work is open-source and available
                            on <a className='spec-link font-black' href="https://github.com/itwela" target='blank'>Github</a>. 
                            You can also connect with me on <a className='spec-link font-black' href="https://www.linkedin.com/in/itwela/" target='blank'>Linkedin </a>
                            where I post about my professional journey and growth
                            as a developer. <br />  <br />
                        </p>
                        <p className="story-2-p">
                            On this site you will find clear and in-depth
                            descriptions of projects and case studies
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
