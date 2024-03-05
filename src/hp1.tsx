import leftvid from './assets/p3vid.mp4'

export default function HomepageSecOne({triggerRef, availwRef, circleRef, mobileTriggerRef }: any) {
    return (
        <>
        <div ref={triggerRef}>
                  <section id='ccol' className="first-section w-[100vw] bg-[#fcf7f8] flex flex-col place-items-center place-content-center">
                    <div ref={availwRef} id='new-vp' className="extra-space flex flex-col  place-content-start w-[91.8vw] place-items-center font-main relative h-[100vh]">
                        <div className="title-wrapper pb-5 flex flex-col justify-between h-full">
                            
                            
                            <div id='hello' className="title-container relative flex flex-col place-items-center place-content-center justify-content-center justify-items-center w-[91.8vw] ">
                                <h1 id='hi-im' className="hi">Hello, I'm</h1>
                                
                                <svg id='myname' width="100%" height="100%" viewBox="0 0 1240 243" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='xMidYMid meet'>
                                <path d="M50.6 0.299995V243H0.800001V0.299995H50.6ZM66.7367 0.299995H289.637V48.9H205.037V243H151.337V48.9H66.7367V0.299995ZM582.373 -1.85966e-05H633.373L558.373 243H500.773L456.673 89.1L412.573 243H354.973L279.973 0.299995H330.973L383.773 175.8L431.173 0.299995H482.173L529.573 175.5L582.373 -1.85966e-05ZM645.331 0.299995H818.731V48.9H697.831V92.1L798.631 92.7V141L697.831 140.7V194.7H818.731V243H645.331V0.299995ZM900.301 194.4H1018.8V243H846.601V0.299995H900.301V194.4ZM1188.55 243L1169.65 192.9H1080.25L1061.35 243H1010.35L1099.45 0.299995H1155.85L1239.85 243H1188.55ZM1097.05 148.2H1152.85L1124.95 74.4L1097.05 148.2Z" fill="black"/>
                                </svg>

                                <div className='w-[91.8vw] flex justify-between pt-2'>
                                  <h1 id='pron1' className="text-[3vw] font-second">software engineer</h1>
                                  <h1 id='pron2' className="text-[3vw] font-second">(ee - tway - la)</h1>
                                </div>

                                <span className='flex flex-col text-[0.7em] sm:text-[0.4em]'>
                                  <div className='w-[91.8vw] flex justify-between pt-2'>
                                    <h1 id='pron3' className="text-[3vw] font-second">web developer</h1>
                                  </div>
                                  <div className='w-[91.8vw] flex justify-between pt-2'>
                                    <h1 id='pron4' className="text-[3vw] font-second">passion for learning</h1>
                                  </div>
                                </span>
                            </div>
                                            
                            <span className='flex w-full justify-between pb-[10vh]'>
                              <div className='flex flex sm:w-[50vw] text-left sm:text-left place-content-center sm:bottom-[60%] text-[0.7em] sm:text-[0.4em]'>
                                <p className="intro-story font-second w-[90%]">My name is Itwela Ibomu. I am a <span className="font-black"> software engineer </span>deeply immersed in the world of code, with a focus in <a className="spec-link font-black" href="" target="blank">TypeScript, </a><a className="spec-link font-black" href="https://www.python.org/" target="blank">Python</a>, and <a className="spec-link font-black" href="https://www.java.com/en/" target="blank">Java</a>. Majority of my work is open-source and available on <a className="spec-link font-black" href="https://github.com/itwela" target="blank">Github</a>. You can also connect with me on <a className="spec-link font-black" href="https://www.linkedin.com/in/itwela/" target="blank">Linkedin </a>where I post about my professional journey and growth as a developer. </p>
                              </div>
                              <div className='place-self-end'>
                               <p className='font-second text-[0.7em] sm:text-[0.4em]'>scroll for more</p>
                              </div>
                            </span>

                        </div>
                        
                        <div ref={circleRef} id='ss' className='ss absolute z-[1]'>
                          {/* <div id='yellow-ss' className='bg-[#ffcc00] rounded-[1.6em]'></div> */}
                          <div id='yellow-ss' className='hidden scale-[50%] md:scale-[30%] translate-x-[50%] translate-y-[-20%] sm:flex rounded-[1.6em] flex flex-col gap-2 cursor-pointer relative p-2 flex place-items-end'>
                            <p id='rpid' className='recent p-3 rounded-[0.5em] scale-[50%] mix-blend-difference bg-[#fcf7f8]'>recent projects</p>
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
        </>
    )
}