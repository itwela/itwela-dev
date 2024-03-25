// Import necessary modules
const express = require('express');

// Create an instance of Express app
const app = express();

// Define your route
// app.use("/", (req, res) => {
//     res.send("Running server!");
// })


app.post('/api/openai/slam', (req, res) => {
    // Handle POST request to /api/openai/slam endpoint
    // You can process the request here and send back a response
    res.json({ text: "Response from the server" });
});

// Start the server
app.listen(5173, () => {
    console.log('Server is running on port 5173');
});
