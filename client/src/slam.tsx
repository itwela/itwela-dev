import React, { useState } from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { toast } from "sonner";
import ItFooter from './footer';



// Define your functional component
const Slam = () => {

  useGSAP(() => {

    // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
    // const words = splitText.words;

      const t1 = gsap.timeline()
      t1.from([
        "#slam1", "#slam2", "#slam3", 
        "#slam4", "#slam5", "#slam6", "#slam7",
      "#slam8", "#slam9"], {
        opacity: 0,
        yPercent: "-100",
        duration: 1.1,
        delay: 0.3,
        ease: "back",
      })
  }, [])


  const [problemText, setProblemText] = useState('')
  const [answerData, setAnswerData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: any) => {
    setProblemText(event.target.value);
    console.log(problemText)
}

const handleSubmit = async (event: any) => {
        
  setIsLoading(true);
  const theProblem = problemText // Assuming your textarea has the name 'input'
  console.log(theProblem)
  try {
      const response = await fetch('https://itwela-dev-backend.vercel.app/api/openai/slam', {
        // const response = await fetch('http://localhost:5000/api/openai/slam', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              input: theProblem,
          })
      });
  
      const data = await response.json();
      const { text } = data;
      // console.log(text)
      
      setAnswerData(text); // Set the formatted text in your state variable
      setIsLoading(false);
      toast("S.L.A.M!",{
          description: "Here's how you can solve your problem using S.L.A.M.",
          id: "slamsuccess",
        })

  } catch (error) {
      toast("Error",{
        description: `Uhoh! There was an error: ${error}.`,
        id: "slamerror",
      })
    }


};

// Function to format the response text
const formatResponse = () => {
  if (!answerData) return null;

  const sections = answerData.split(/Problem Summary:|S.L.A.M Summary:|My \(the Ai's\) Understanding:|Level of Difficulty:/);
  if (sections.length < 4) return null;

  const [title, problemSummary, slamsummary, understanding, levelOfDifficulty] = sections.map(section => section.trim());

  return (
    <>
      <div>
        <h2 className='font-bold py-2 text-xl'>{title}</h2>
        <div className='py-2'>
          <h2>Problem Summary:</h2>
          <p>{problemSummary}</p>
        </div>
      </div>
      <div className='text-xl'>
        <h2 className='font-bold py-2'>S.L.A.M Summary:</h2>
        <p>{slamsummary}</p>
      </div>
      <div className='flex gap-3'>
        <h2>My Understanding (the A.i):</h2>
        <p>{understanding}</p>
      </div>
      <div className='flex gap-3'>
        <h2>Level of Difficulty:</h2>
        <p>{levelOfDifficulty}</p>
      </div>
    </>
  );
};


  return (
    <>
    <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] grid  bg-[#fcf7f8] '>
        <div className="extra-space w-full relative flex flex-col gap-5 justify-start">
            <div className='w-full h-max'>
              <h1 id='slam1' className='font-main text-5xl'>S.L.A.M</h1>
              <div className=''>
                <h2 id='slam2' className='py-2 font-second'>An tool based on an acronym for learning how to solve technical interview questions!</h2>
                <h2 id='slam3' className=' font-second text-slate-600'>Instead of trying to memorize every answer to each problem; <br />
                as engineers I belive we are hired to come up with ways to solve problems we may not be familiar with.  <br />
                I belive if I can identify these four qualities in any given problem, I can better solve it.
                </h2>
                  <div className='py-2'>
                    <h3 id='slam6'>S - Structures</h3>
                    <h3 id='slam7'>L - Lexicon</h3>
                    <h3 id='slam8'>A - Algorithim</h3>
                    <h3 id='slam9'>M - Math</h3>
                  </div>
              </div>
            </div>

            <div id='slam4' className='w-full min-h-screen flex flex-col gap-3'>
{/* question */}
                <div className='w-full h-max flex flex-col gap-3'>
                  <div className='flex w-full place-items-center justify-between'>
                    <h1 className='font-bold'>Insert your question:</h1>
                    {isLoading === true && (
                        <button onClick={handleSubmit} className='animate-pulse font-bold text-[#fcf7f8] bg-[#1e1f21]/80 rounded-lg px-2 py-2'>Loading...</button>
                    )}
                    {isLoading === false && (  
                        <button onClick={handleSubmit} className='font-bold text-[#fcf7f8] bg-black rounded-lg px-2 py-2'>Submit</button>
                    )}
                  </div>
                  <textarea onChange={handleInputChange} className='no-scroll outline-none w-full min-h-[200px] bg-white rounded-lg p-3'></textarea>
                </div>
{/* answer */}
              <div id='slam5' className='p-3 w-full min-h-[600px] flex flex-col gap-3 bg-white rounded-lg'>
                {isLoading === true && (
                  <p className='animate-pulse'>Your response is loading...</p>
                )}

                {isLoading === false && (
                  formatResponse()
                )}
              </div>
            </div>

        </div>
    <ItFooter />
    </section>
    </>
    
    
  );
};

// Export the component
export default Slam;