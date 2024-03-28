import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ItFooter from './footer';
import { blogposts } from './🔵BlogPosts';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { IoMdArrowBack } from 'react-icons/io';


const AllLeetCodeProblems = () => {

    useGSAP(() => {

        // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
        // const words = splitText.words;

        const t1 = gsap.timeline()
        t1.from([
            "#lcs1", "#lcs2", "#lcs3", "#lcs4",], {
            opacity: 0,
            yPercent: "-100",
            duration: 1.1,
            delay: 0.3,
            ease: "back",
        })
    }, [])

    // Filter blogposts to include only those with lcNum defined (LeetCode number)
    const leetCodePosts = blogposts.filter(post => post.lcNum !== undefined);
    const leetcodePlatforms = [...new Set(leetCodePosts.map(post => post.platform))];
    // State to manage search query
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search query change
    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    // Filtered posts based on search query
    const filteredPosts = leetCodePosts.filter(post =>
        (post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.lcNum !== undefined && post.lcNum.toString().includes(searchQuery)) ||
        (post.platform && post.platform.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const [thePlatform, setThePlatform] = useState('');

    const handlePlatformChange = (platform: string) => {
        setSearchQuery(platform);
    }

    return (
        <>
            <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] flex flex-col  bg-[#fcf7f8] '>
                <div className="extra-space flex flex-col place-content-start w-full min-h-[100dvh] relative">
                    <NavLink className='flex gap-3 w-full place-items-center my-5 ' to="/blog"><IoMdArrowBack className='p-2 hover:text-[#fcf7f8] hover:bg-[#1e1f21] rounded-lg w-max h-max' /> <p>Blog</p></NavLink>

                    <div className='flex  flex-col w-full h-max '>
                        <h1 id='lcs1' className='font-main text-5xl'>Coding Interview Solutions</h1>
                        <br />
                        <h2 id='lcs2' className='font-second'>Browse all of my coding solutions:</h2>
                        
                        <div className='my-5 flex gap-3 flex-col'>
                            {searchQuery === "" && (
                            <>  
                                <p className='italic '>Or choose platform:</p>
                                {leetcodePlatforms.map(platform => (
                                    <div className='flex gap-3'>
                                        <span onClick={() => handlePlatformChange("Leetcode")} className='py-1 px-3 rounded-full cursor-pointer outline outline-[1px] outline-[#1e1f21]'>{leetcodePlatforms}</span>
                                    </div>
                                ))}
                            </>
                            ) }

                            {searchQuery !== "" && (
                                <>
                                    <p onClick={() => setSearchQuery("")} className='underline cursor-pointer font-bold'>Clear</p>
                                    {leetcodePlatforms.map(platform => (
                                        <div className='flex gap-3'>
                                            <span onClick={() => handlePlatformChange("Leetcode")} className='py-1 px-3 rounded-full cursor-pointer outline outline-[1px] outline-[#1e1f21]'>{leetcodePlatforms}</span>
                                        </div>
                                    ))}
                                </>
                                
                            )}
                        </div>

                        </div>

                    {/* Search input */}
                    <input
                        id='lcs3'
                        type="text"
                        placeholder="Search by title or problem number"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="outline-none rounded-lg px-3 py-2 "
                    />

                    {filteredPosts.length > 0 && (
                        <>

                            {/* Map over the filtered blogposts to render them */}
                            {filteredPosts.map(post => (
                                <div id='lcs4' key={post.id} className="blog-post font-bold py-3 flex w-full justify-between">
                                    {/* Render post content here */}
                                    <NavLink to={`/blog/${post.id}`}>
                                        <h2 className='underline'>{post.title}</h2>
                                    </NavLink>
                                    <span className='flex gap-2'>
                                        <p>{post.platform}</p> - <p className=''>{post.lcNum}</p>
                                    </span>
                                    {/* Add other content rendering as needed */}
                                </div>
                            ))}

                        </>
                    )}

                    {filteredPosts.length < 1 && (
                        <>

                        {/* Map over the filtered blogposts to render them */}
                            <div id='lcs4'  className="blog-post font-bold py-3 flex w-full justify-between">
                                {/* Render post content here */}
                                <span>No results found.</span>
                                {/* Add other content rendering as needed */}
                            </div>

                        </>
                    )}

                </div>
                <ItFooter />
            </section>
        </>
    );
};

// Export the component
export default AllLeetCodeProblems;
