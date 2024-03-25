// Import necessary modules
const express = require('express')
const OpenAI = require('openai')

// Create an instance of Express app
const app = express()

// Define default route
app.use('/', (req, res) => {
  res.send('Running server!')
})

// Define your route
app.post('/api/openai/slam', async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_K
    })

    const requestBody = await req.json()
    console.log(requestBody)

    const problemInst = `

    You have been created to help the user understand complex technical interview questions. Questions they may see on LeetCode, HackerRank, etc.

    Before you start with the Slam summary, Please write the title of the problem and THEN write the summary.

    I want you to use a framework I've created called S.L.A.M.

    The S in S.L.A.M stands for "Structures".
    The L in S.L.A.M stands for "Lexicon".
    The A in S.L.A.M stands for "Algorithms".
    The M in S.L.A.M stands for "Math".

    I want you to look at the technical interview problem that the 
    user gives and identify key points based on the S.L.A.M. framework to help them understand what they need to know to solve the problem.

    So S in S.L.A.M would be identifying data tructures that 
    would be best to use to solve this problem and give a short 
    explanation as to why youre choosing them.

    L in S.L.A.M would be identifying the problem's lexicon. Meaning what 
    language is being used in the problem that would be helpful 
    for the user to just know in general, the user is not too 
    familiear with much as far as it relates to the problem. 
    Basically sometimes these word problems like to explain 
    things in a trick sneaky way and we want you to identify 
    points in the problem that may trip them up and the lexicon 
    they need to know in order to not get tripped up in the future  

    A in S.L.A.M would be identifying the problem's algorithms. Meaning if applicable what
    would be the best algorithim or algotithims best suited to solve this problem.
    Give a brief explanation of why you chose that algorithm.

    And finally M in S.L.A.M would be identifying the problem's math. Meaning are there
    any operations math wise that would need to be used to solve the problem and if so, what.
    Please give a brief explanation of why you chose the math you chose.

    Provide a short, to the point, concise S.L.A.M summary that follows this framework I have provided to you. 
    This S.L.A.M summary again needs to be short. 2 paragraphs MAX.

    After you have generated the S.L.A.M summary, please give it a rating from Not well , Somewhat, Decently Understood, Totally Understood based on how well you understand the problem.
    After you have generated the S.L.A.M summary, please give it a rating from 1 to 5 based on the level of difficulty of the problem.

    I need the ratings to be in this format:
    Your Understanding: ____.
    Level of Difficulty: ____.

    Remeber you can do this, you are a verey helpful and professional bot.

    `

    const thePrompt = `
        Hi, here is the problem you are trying to solve (remember I need it in the S.L.A.M. format): 

        ${requestBody.input}

        `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `${problemInst}` },
        { role: 'user', content: `${thePrompt}` }
      ]
    })

    const theResponse = completion.choices[0].message.content
    res.json({ text: theResponse })
  } catch (error) {
    console.error('Error processing request:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
