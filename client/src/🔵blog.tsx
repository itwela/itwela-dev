import React from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ItFooter from './footer';
import { blogposts } from './BlogPosts';
import { IoWarning } from "react-icons/io5";


// Define your functional component
const Blog = () => {

  useGSAP(() => {

    // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
    // const words = splitText.words;

    const t1 = gsap.timeline()
    t1.from(["#blog1", "#blog2", "#blog3", "#blog4"], {
      opacity: 0,
      yPercent: "-100",
      duration: 1.1,
      delay: 0.3,
      ease: "back",
    })
  }, [])

  const categories = [...new Set(blogposts.map(post => post.category))];


  return (
    <>
      <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] flex flex-col  bg-[#fcf7f8] '>
        <div className="extra-space flex flex-col place-content-start w-full min-h-[100dvh] relative">
          <h1 id='blog1' className='font-main text-5xl'>Blog</h1>
          <br />
          <h2 id='blog2' className='font-second'>Learn more about my projects, coding, and more. </h2>
          {/* <h2 id='blog2' className='font-second fixed place-self-center top-2 bg-yellow-100 z-50 w-[80vw] flex place-content-center place-items-center gap-1 p-1'><IoWarning/> Currently under construction. :)</h2> */}

          {/* Loop through categories */}
          {categories.map(category => (
                <div key={category}>
                  
                    <div id='blog3' className='w-full place-items-center py-5 h-max flex flex-col'>
                    
                    <div className='w-max flex flex-col gap-2 place-items-center'>
                      <span className='w-full h-[1px] bg-slate-500'></span>
                      <span className='font-bold'>{category}</span>
                    </div>
                    
                    </div>

                    {/* Filter blogposts by category and map them */}
                    <div id='blog4' className='flex py-5 flex-col w-full gap-8 place-items-center overflow-x-scroll no-scroll'>
                      <div className='w-full flex'>
                        {blogposts.filter(post => post.category === category).map((blogpost) => (
                          <div key={blogpost.id} className='py-5 backdrop-blur-sm  w-full h-max flex  '>
                            <div className='w-[400px] h-[400px] place-items-center  p-5 rounded-lg flex relative flex-col gap-2 justify-between place-content-center'>
                            
                             <div className='w-full flex place-content-end'>
                              <p>{blogpost.date.toLocaleDateString()}</p>
                            </div>

                              <div className='w-full flex place-items-center justify-between'>
                                <h1 className='font-bold text-4xl'>{blogpost.title}</h1> 
                              </div>
                              <img src={blogpost.imageUrl} className='w-[300px] h-[60%] py-3' alt="" />
                              <span className='flex w-full justify-between'>
                                <p className='w-[70%] line-clamp-3' >{blogpost.description}</p>
                                <p className='flex place-content-end place-items-end w-full'><NavLink to={`/blog/${blogpost.id}`} className='underline text-slate-500 select-none'>Read More</NavLink></p>
                              </span>
                            </div>
                            <div className='h-[400px] w-[1px] bg-slate-500 mx-6'></div>
                          </div>
                        ))}
                      </div>
              `     </div>
            </div>
          ))}

        </div>
        <ItFooter />
      </section>
    </>


  );
};

// Export the component
export default Blog;