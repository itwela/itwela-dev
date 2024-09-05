import { NavLink } from 'react-router-dom';
import resume from './assets/Itwela_Codebase.pdf';


export default function ItFooter() {

    const thisyear = new Date().getFullYear()

    return (
        <div id="footer p-4  sm:p-8 w-[100vw] h-max ">
            <div className="min-h-[50vh] flex flex-col justify-between">

                <span className="py-8">
                <div className='w-full h-[1px] bg-[#1e1f21]/40 mb-8'></div>
                    <h2 className='font-main font-bold text-5xl text-[#1e1f21]'>
                    Itwela <br /> Ibomu
                </h2></span>
                <span className="w-full flex flex-col gap-5 h-max ">
                    
                    {/* pages links */}
                    <span>
                        <p>Pages</p>
                        <ul>
                            <li><NavLink to="/" className=''>Home</NavLink></li> 
                            <li><a href="https://drive.google.com/file/d/1xYYdMP0V83De-odSxcc4IxeIcbKFbUO8/view" target='_blank' className=''>Resume</a></li>
                            <li><NavLink to="/blog" className=''>Blog</NavLink></li> 
                            <li><NavLink to="/slam" className=''>Slam</NavLink></li> 
                            <li><NavLink to="/Contact" className=''>Contact</NavLink></li>
                        </ul>
                    </span>

                    {/* socails links */}
                    <span>
                        <p>Socials</p>
                        <ul>
                            <li><a className="spec-link " href="https://www.linkedin.com/in/itwela/" target="blank">LinkedIn</a></li>
                            <li><a className="spec-link" href="https://twitter.com/itwelai" target="blank">Twitter</a></li>
                            <li><a className='' href="https://github.com/itwela/" target="_blank">Github</a></li>
                        </ul>
                    </span>
                
                    {/* built with */}
                    <span>
                        <p>Built itwela.dev with:</p>
                        <ul>
                            <li>React</li>
                            <li>TypeScript</li>
                            <li>Gsap</li>
                            <li>Node.Js</li>
                            <li>Vercel</li>
                        </ul>
                    </span>

                </span>
                <span className="w-full flex place-content-end">
                    {thisyear}
                </span>
            </div>
        </div>
    )
}