import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { blogposts as posts } from './🔵BlogPosts';
import ReactMarkdown from 'react-markdown'
import ItFooter from './footer';
import { IoMdArrowBack } from 'react-icons/io';
import rehypeRaw from 'rehype-raw';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { IoClose } from 'react-icons/io5';


const SingleBlogPost = () => {
    
  useGSAP(() => {

        // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
        // const words = splitText.words;

            const t1 = gsap.timeline()
            t1.from([
            "#dj1", "#dj2", "#dj3",], {
            opacity: 0,
            yPercent: "-100",
            duration: 1.1,
            delay: 0.3,
            ease: "back",
            })
    }, [])


  const [slamOpen, setSlamOpen] = React.useState(false);

  const { id } = useParams(); // Get the id parameter from the URL
  const post = posts.find(post => post.id === (id)); // Find the blog post with the matching id
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] flex flex-col  bg-[#fcf7f8] '>
        <div className="extra-space py-9 flex flex-col place-content-start w-full min-h-[100dvh] relative">
            <div className='flex gap-5 flex-col w-full h-max'>
                <span className='w-full place-items-center flex gap-3'>
                    <span id='dj1'>
                        <NavLink className="p-3" to="/blog">
                        <IoMdArrowBack className='p-2 hover:text-[#fcf7f8] hover:bg-[#1e1f21] rounded-lg w-max h-max' />
                        </NavLink>
                    </span>
                    <span id='dj1' className='flex w-full justify-between'>
                        <h1 className='font-second'>{post.category} - {post.date.toLocaleDateString()}</h1>
                        <h1 className='font-second'>{post.lcNum}</h1>
                    </span>
                </span>
                <div id='dj3' className='flex flex-col gap-1 my-8'> 
                    <h1 className='font-second text-5xl font-bold'>{post.title}</h1>
                    <div>
                        <h2 className='font-second my-2'>{post.description}</h2>
                        {post.lcNum && (
                            <p className='flex place-items-end w-full'><NavLink to={`/blog/allLeetCodeProblems`} className='underline py-1'>All Leetcode Solutions Here</NavLink></p>   
                        )}
                    </div>
                </div>
                {post.category === 'Leetcode & More' && (                    
                    <div id='dj3.5' style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className='w-[80%] flex place-self-center h-[300px] sm:h-[40vh]'></div>
                )}
                {post.category === 'Projects' && (                    
                    <div id='dj3.5' style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className='w-[80%] flex place-self-center h-[300px]'></div>
                )}
                {post.category === 'Life' && (                    
                    <div id='dj3.5' style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'top' }} className='w-[80%] flex place-self-center h-[300px]'></div>
                )}

                {post.slamsummary !== '' && (

                    <>

                    {slamOpen === false && (
                        <div id='dj4' onClick={() => setSlamOpen(true)} className='my-5 flex flex-col cursor-pointer '>
                            <span className='rounded-lg'>Click for:</span>
                            <span className='py-1 rounded-lg font-main'>S.L.A.M. Summary</span>
                        </div>                      
                    )}

                    {slamOpen === true && ( 
                        
                        <>
                        <div id='dj4' onClick={() => setSlamOpen(false)} className='cursor-pointer'>
                            <div className='flex w-max gap-3 place-items-center'>
                                <p className='underline'>Close S.L.A.M. Summary</p>
                            </div>
                        </div>  

                        <div id='dj4'>
                            <ReactMarkdown rehypePlugins={[rehypeRaw]} className="my-8 prose-lg">{post.slamsummary}</ReactMarkdown>
                            <div className='w-full h-[1px] bg-[#1e1f21] my-3'></div>
                        </div>       
                        </>
                         
                    )}
                    </>

                )}

                {post.content && (  
                    <div id='dj4'>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose-lg">{post.content}</ReactMarkdown>
                    </div>
                )}


                {post.content === '' && (
                    <div id='dj3.5' className='w-full h-max p-5 flex place-content-center'>
                        <p>Hey, Thanks for stopping by! Full breakdown coming soon...!</p>
                    </div>
                )}

                {post.codesolution && (
                    <div id='dj5' className='w-full overflow-scroll h-max p-5 bg-[#1e1f21] text-[#fcf7f8] rounded-lg'>
                        <ReactMarkdown>{post.codesolution}</ReactMarkdown>
                    </div>
                )}
                <p>{post.date.toLocaleDateString()}</p>
            </div>
        </div>
        <ItFooter />
    </section>
  );
};

export default SingleBlogPost;
