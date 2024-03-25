import React, { useState } from 'react';
import Homeicon from './home-icon';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
import { useRef } from 'react';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { toast } from "sonner";



// Define your functional component
const Slam = () => {
  const [problemText, setProblemText] = useState('')
  const [answerData, setAnswerData] = useState("");


  const handleInputChange = (event: any) => {
    setProblemText(event.target.value);
    console.log(problemText)
}

const handleSubmit = async (event: any) => {
        
  const theProblem = problemText // Assuming your textarea has the name 'input'
  console.log(theProblem)
  try {
      const response = await fetch('https://itwela-dev-backend.vercel.app/api/openai/slam', {
      // const response = await fetch('/api/openai/slam', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              input: theProblem,
          })
      });
  
      // if (!response.ok) {
      //     throw new Error('Failed to fetch data');
      // }
  
      const data = await response.json();
      const { text } = data;
      // console.log(text)
      
      setAnswerData(text); // Set the formatted text in your state variable

      toast("S.L.A.M!",{
          description: "Here's how you can solve your problem using S.L.A.M.",
          id: "slamsuccess",
        })

  } catch (error) {
      toast("Error",{
        description: `There was an error processing your request: ${error}.`,
        // description: `Coming Soon!`,
        id: "slamerror",
      })
    }


};
  
//   useGSAP(() => {

//     // const splitText = new SplitText('.intro-container-2 p', { type: "words" }); // Split each paragraph into lines
//     // const words = splitText.words;

//       const t1 = gsap.timeline()
//       t1.from(["#slam1", "#slam2"], {
//         opacity: 0,
//         yPercent: "-100",
//         duration: 1.3,
//         delay: 0.3,
//         ease: "back",
//       })
//   }, [])

  return (
    <>
    <section className='main-section px-5 py-3 w-[100vw] min-h-[100vh] grid  bg-[#fcf7f8] '>
        <div className="extra-space w-full relative flex flex-col gap-5 justify-start">
            <div className='w-full h-max'>
              <h1 id='slam1' className='font-main text-5xl'>S.L.A.M</h1>
              <div className=''>
                <h2 id='slam2' className='py-2 font-second'>An tool based on an acronym for learning how to solve technical interview questions!</h2>
                <h3>S - Structures</h3>
              <h3>L - Lexicon</h3>
              <h3>A - Algorithim</h3>
              <h3>M - Math</h3>
                <h2 id='slam2' className='py-2 font-second text-slate-400'>Instead of trying to memorize all the answers to each problem; <br />
                as engineers I belive we are hired come up with ways to solve problems we may not be familiar with.  <br />
                I belive if i can identify these four qualities in any given problem, I can better solve it.
                </h2>
              </div>
            </div>

            <div className='w-full min-h-screen flex flex-col gap-3'>
{/* question */}
                <div className='w-full h-max flex flex-col gap-3'>
                  <div className='flex w-full place-items-center justify-between'>
                    <h1 className='font-bold'>Insert your question:</h1>
                    <button onClick={handleSubmit} className='font-bold text-[#fcf7f8] bg-black rounded-lg px-2 py-2'>Submit Problem</button>
                  </div>
                  <textarea onChange={handleInputChange} className='outline-none w-full min-h-[200px] bg-white rounded-lg p-3'></textarea>
                </div>
{/* answer */}
                <div className='w-full min-h-[600px] flex flex-col gap-3 bg-white rounded-lg'>
                  <p className='p-3'>{answerData}</p>
                </div>
            </div>

        </div>
    </section>
    </>
    
    
  );
};

// Export the component
export default Slam;