import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { blogposts as posts } from './🔵BlogPosts';
import ReactMarkdown from 'react-markdown'
import ItFooter from './footer';
import { IoMdArrowBack } from 'react-icons/io';
import rehypeRaw from 'rehype-raw';

const SingleBlogPost = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const post = posts.find(post => post.id === (id)); // Find the blog post with the matching id
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] flex flex-col  bg-[#fcf7f8] '>
        <div className="extra-space py-9 flex flex-col place-content-start w-full min-h-[100dvh] relative">
            <div className='flex gap-5 flex-col w-full h-max'>
                <span className='w-full place-items-center flex gap-2'>
                    <span>
                        <NavLink className="p-3" to="/blog">
                        <IoMdArrowBack />
                        </NavLink>
                    </span>
                    <span className='flex w-full justify-between'>
                        <h1 className='font-second'>{post.category} - {post.date.toLocaleDateString()}</h1>
                        <h1 className='font-second'>{post.lcNum}</h1>
                    </span>
                </span>
                <div className='flex flex-col gap-1 my-8'> 
                    <h1 className='font-second text-5xl font-bold'>{post.title}</h1>
                    <h2 className='font-second my-2'>{post.description}</h2>
                </div>
                {post.category === 'Leetcode & More' && (                    
                    <div style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className='w-[80%] flex place-self-center h-[300px] sm:h-[40vh]'></div>
                )}
                {post.category === 'Projects' && (                    
                    <div style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className='w-[80%] flex place-self-center h-[300px]'></div>
                )}
                {post.content && (  
                    <>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className="my-8 prose-lg">{post.content}</ReactMarkdown>
                    </>                  
                )}
                {post.content === '' && (
                    <div className='w-full h-max p-5 flex place-content-center'>
                        <p>Hey, Thanks for stopping by! Full breakdown coming soon...!</p>
                    </div>
                )}

                {post.codesolution && (
                    <div className='w-full h-max p-5 bg-[#1e1f21] text-[#fcf7f8] rounded-lg'>
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
