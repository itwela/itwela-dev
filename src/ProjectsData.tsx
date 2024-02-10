import stockgif from './assets/stock-ticker.gif'
import basketballapigif from './assets/basketball-api.gif'
import bitezgif from './assets/bitez.gif'
import simplclaimgif from './assets/simplclaim.gif'
import React, { useState, useEffect } from "react";
// import "react-notion/src/styles.css";
// import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting
import { NotionRenderer } from "react-notion";


const SfxNotionArticle = () => {
    const [blockMap, setBlockMap] = useState(null);
  
    useEffect(() => {
      const fetchNotionData = async () => {
        try {
          const response = await fetch(
            "https://notion-api.splitbee.io/v1/page/35382c0ab9234fc9a0902ca564a7046c"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data from Notion API");
          }
          const data = await response.json();
          setBlockMap(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchNotionData();
    }, []);
  

    return (
      <div className='notion-itwela-sfx md:w-[91.8vw]'>
        <br />
        {blockMap && (
          <NotionRenderer blockMap={blockMap} fullPage hideHeader />
        )}
      </div>
    );
  };

  // ---------------------------------
  
  const BasketballArticle = () => {
    const [blockMap, setBlockMap] = useState(null);
  
    useEffect(() => {
      const fetchNotionData = async () => {
        try {
          const response = await fetch(
            "https://notion-api.splitbee.io/v1/page/109d8a6360ee4f49a56f46a987c864e4"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data from Notion API");
          }
          const data = await response.json();
          setBlockMap(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchNotionData();
    }, []);
  

    return (
      <div className='notion-itwela-bball md:w-[91.8vw] flex place-content-start'>
        <div className=''>
        <br />
        {blockMap && (
          <NotionRenderer blockMap={blockMap} fullPage hideHeader />
        )}
        </div>
      </div>
    );
  };

  // -------------

  const BitezofLoveArticle = () => {
    const [blockMap, setBlockMap] = useState(null);
  
    useEffect(() => {
      const fetchNotionData = async () => {
        try {
          const response = await fetch(
            "https://notion-api.splitbee.io/v1/page/09a85d706c61498687700047920f0c20"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data from Notion API");
          }
          const data = await response.json();
          setBlockMap(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchNotionData();
    }, []);
  

    return (
      <div className='notion-itwela-bitez md:w-[91.8vw] flex place-content-start'>
        <div className=''>
        <br />
        {blockMap && (
          <NotionRenderer blockMap={blockMap} hideHeader />
        )}
        </div>
      </div>
    );
  };

  //  --------------

  const SimplClaimArticle = () => {
    const [blockMap, setBlockMap] = useState(null);
  
    useEffect(() => {
      const fetchNotionData = async () => {
        try {
          const response = await fetch(
            "https://notion-api.splitbee.io/v1/page/c666c8c686774c20bedf0d259988077b"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data from Notion API");
          }
          const data = await response.json();
          setBlockMap(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchNotionData();
    }, []);
  

    return (
      <div className='notion-itwela-simpl md:w-[91.8vw] flex place-content-start'>
        <div className=''>
        <br />
        {blockMap && (
          <NotionRenderer blockMap={blockMap} hideHeader />
        )}
        </div>
      </div>
    );
  };

  // {
  //   gif: stockgif,
  //   number: '1',
  //   title: 'MyAssignmentHelp Website',
  //   subtitle: 'new project update coming soon...',
  //   description: (
  //     <>
  //         <div>
  //             <p className=''>
  //                 <div className='flex justify-between place-items-start'>
  //                 <h2 className="initial-interest text-[1.5rem] pb-3 md:pb-0 md:text-[2rem] font-black">Initial Interest <br /></h2>
  //                 </div>
  //                 <div className='opacity-0'>
  //                     <span className="font-black">What sparked my interest </span>in the concept of creating an automated trading algorithm is my experiences and successes manually trading. I have been trading on and off since high school and have had some very high moments in that time.
  //                     After my biggest trade, I started feeling like there has to be a way to automate the process just due to the sheer amount of time I had to be in front of the chart just for the right moment to press the buy button...
  //                     <br />
  //                     <br />
  //                     <span className="font-black">Going into this project</span>, the only coding I had preformed up to that point was
  //                     developing a small game in Unity using C#. I had a basic concept of variables and
  //                     some experience writing functions. I wanted to learn what was neccesary to automate my process. Looking back on it,
  //                     it was a very ambitious goal. 
  //                 </div>
  //                 <br /> 
  //                 <br />
                  
  //                 <h2 className="research text-[1.5rem] md:text-[2rem] font-black">Research Phase<br /> </h2>
                  
  //                 <div className='opacity-0'>
  //                     Here you will find an article I wrote on alot of my reserch, findings and development of this trading system. 
  //                     <br />
  //                     If you just want the <strong>key take aways</strong>, here they are: 
  //                     <br />
  //                     <br />
  //                     <ul className="custom-list font-black">
  //                         <li>Learned Tradingview's scripting language called Pinescript.</li>
  //                         <li>Transfered years of data into a working automated strategy.</li>
  //                         <li>This project made me very comfortable with manipulating arrays.</li>
  //                     </ul>
  //                     <br />
  //                     You will find more in depth research below:
  //                 </div>
  //                 <span className="font-black"></span>
  //             </p> 
  //         </div>
  //     </>
  //   ),  
  //   blog: (
  //     <div>
  //         {/* <SfxNotionArticle/> */}
  //     </div>
  //   ),   
  //   link: '',
  // },

  const projectData = [
    {
      gif: stockgif,
      number: '1',
      // number: '2',
      title: 'The SFX Algo',
      subtitle: 'A trading algorithim that buys and sells stocks for you automatically.',
      description: (
        <>
            <div>
                <p className=''>
                    <div className='flex justify-between place-items-start'>
                    <h2 className="initial-interest text-[1.5rem] pb-3 md:pb-0 md:text-[2rem] font-black">Initial Interest <br /></h2>
                    </div>
                    <span className="font-black">What sparked my interest </span>in the concept of creating an automated trading algorithm is my experiences and successes manually trading. I have been trading on and off since high school and have had some very high moments in that time.
                    After my biggest trade, I started feeling like there has to be a way to automate the process just due to the sheer amount of time I had to be in front of the chart just for the right moment to press the buy button...
                    <br />
                    <br />
                    <span className="font-black">Going into this project</span>, the only coding I had preformed up to that point was
                    developing a small game in Unity using C#. I had a basic concept of variables and
                    some experience writing functions. I wanted to learn what was neccesary to automate my process. Looking back on it,
                    it was a very ambitious goal. 
                    <br /> 
                    <br />
                    <h2 className="research text-[1.5rem] md:text-[2rem] font-black">Research Phase<br /> </h2>
                    Here you will find an article I wrote on alot of my reserch, findings and development of this trading system. 
                    <br />
                    If you just want the <strong>key take aways</strong>, here they are: 
                    <br />
                    <br />
                    <ul className="custom-list font-black">
                        <li>Learned Tradingview's scripting language called Pinescript.</li>
                        <li>Transfered years of data into a working automated strategy.</li>
                        <li>This project made me very comfortable with manipulating arrays.</li>
                    </ul>
                    <br />
                    You will find more in depth research below:
                    <span className="font-black"></span>
                </p> 
            </div>
        </>
      ),  
      blog: (
        <div>
            <SfxNotionArticle/>
        </div>
      ),   
      link: '',
    },
    {
      gif: basketballapigif,
      number: '2',
      // number: '3',
      title: 'Basketball Dashboard',
      subtitle: 'a case study on API connections to display basketball data.',
      description: (
        <div>
            <p className=''>
                <h2 className="initial-interest text-[1.5rem] md:text-[2rem] font-black">Initial Interest <br /></h2>
                <span className="font-black">What sparked my interest </span>in connecting apis in my dashboard
                was the ease of being able to add a feature I wanted into the project that way. I have leasurely betted
                on basketball games and one day had an idea that what if I could use ai to help me choose the best 
                picks for the night. In pursuing that idea I learned about apis and have come to really like them.
                <br />
                <br />
                <span className="font-black">Going into this project</span>, I had already made several websites but never getting this
                sort of exposre where I needed to type up the requests myself and such. I really wanted to learn how to interact with
                API's because after doing some research, I realized I had been using them in alot of the "no code" website builders I used 
                to use without even realizing. Learning how to interact with them myself would allow for so much more customization with the data
                I want to display.
                <br /> 
                <br />
                <h2 className="research text-[1.5rem] md:text-[2rem] font-black">Research Phase<br /></h2>
\                Here you will find an article I wrote on a case study of how I implimented an API into my dashboard. 
                <br />
                If you just want the <strong>key take aways</strong>, here they are: 
                <br />
                <br />
                <ul className="custom-list font-black">
                    <li>Learned how to interact with API's.</li>
                    <li>Manipulated data after calling the API's.</li>
                    <li>Displayed the data in a clear and readable way.</li>
                </ul>
                <br />
                You will find more in depth research below:
                <br />          
            </p> 
        </div>
      ),
      blog: (
        <div>
            <BasketballArticle/>
        </div>
      ),  
      link: '',
    },
    {
      gif: bitezgif,
      number: '3',
      // number: '4',
      title: 'Bitez of Love',
      subtitle: 'A total revamp of a businesses website using react.',
      description: (
        <div>
            <p className=''>
                <h2 className="initial-interest text-[1.5rem] md:text-[2rem] font-black">Initial Interest <br /></h2>
                <span className="font-black">What sparked my interest </span>in this project was a friend of mine saying
                he needed some help with his family's website. I thought this would be a great opportunity to
                build my experience in web design and development so I took the gig.
                <br />
                <br />
                <span className="font-black">Going into this project</span>, I had built several landing pages before but this was my first project
                I was going to build that I knew a small audience would actually use regularly. I was familiar with setting up my neccesary libraries,
                deploying and adding custom domains so I was confident and excited to do the job.   
                <br />
                <br /> 
                <h2 className="research text-[1.5rem] md:text-[2rem] font-black">Research Phase<br /> </h2>
                If you just want the <strong>key take aways</strong>, here they are: 
                <br />
                <br />
                <ul className="custom-list font-black">
                    <li>Created a website using react for a business.</li>
                    <li>Learned and implimented the Software Development Life Cycle in the process.</li>
                    <li>Implimented Figma and wireframes into the design process.</li>
                    <li>Went above and beyond to meet the needs of the client.</li>
                </ul>
                <br />
                You will find more in depth research below:
                <br />          
            </p> 
        </div>
      ),
      blog: (
        <div>
            <BitezofLoveArticle/>
        </div>
      ), 
      link: '-' + 'https://www.bitezoflove.com/',
    },
    {
      gif: simplclaimgif,
      number: '4',
      // number: '5',
      title: 'SimplClaim',
      subtitle: 'A web app that speeds up the data entry process with the help of AI.',
      description: (
        <div>
            <p className=''>
               <h2 className="initial-interest text-[1.5rem] md:text-[2rem] font-black">Initial Interest <br /></h2>
                <span className="font-black">What sparked my interest</span> in this project was my dad. He
                said he needed a tool to help him enter a lot of data into a spreadsheet for his insurance. He also
                said if there was a way to use ai to help him fill in some of the price columns, that would be a
                lifesaver because for some of the items he didn't know how to estimate a price for them. I felt like
                this would be a great project for me and I wanted to get a lot more familiar with dataframes so this
                was great.   
                <br />
                <br />
                <span className="font-black">Going into this project</span>, I had more experience manipulating ai responses
                than I did with an excel sheet or dataframes ironically. I made a small project before where I was generating responses
                from ChatGPT based on some inputs so I felt like I could build on that knowledge in this project. I was excited to bridge the
                gaps in my knowledge however in gpt-3.5 and in dataframes.                
                <br />
                <br />
                <h2 className="research text-[1.5rem] md:text-[2rem] font-black">Research Phase<br /></h2>
                If you just want the <strong>key take aways</strong>, here they are: 
                <br />
                <br />
                <ul className="custom-list font-black">
                    <li>Learned the basics of creating and editing dataframes.</li>
                    <li>Deployed a python application to the cloud.</li>
                    <li>Generated custom responses from ai through a creative use of variables.</li>
                    <li>Created a product to help someone in my family's life easier.</li>
                </ul>
                <br />
                You will find more in depth research below:
                <br />  
            </p> 
        </div>
      ),       
      blog: (
        <div>
            <SimplClaimArticle />
        </div>
      ), 
      link: '-' + 'https://simplclaim.streamlit.app',
    },
    // Add more projects as needed
  ];
  
  export default projectData;
  