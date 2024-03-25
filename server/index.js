const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();

// Enable CORS
app.use(cors());

// Define default route
app.use('/', (req, res) => {
  res.send('Running server!');
});

// Define your route
app.post('/api/openai/slam', async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_K
    });

    const requestBody = await req.json();
    console.log(requestBody);

    const problemInst = `
      // Your problem statement here...
    `;

    const thePrompt = `
      Hi, here is the problem you are trying to solve (remember I need it in the S.L.A.M. format): 

      ${requestBody.input}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `${problemInst}` },
        { role: 'user', content: `${thePrompt}` }
      ]
    });

    const theResponse = completion.choices[0].message.content;
    res.json({ text: theResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
