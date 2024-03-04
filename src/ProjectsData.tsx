// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function Timehandler(req: NextApiRequest, res: NextApiResponse) {

//     try {
//         // Fetch the date from the API
//         const response = await fetch("https://time-and-date-api.vercel.app/api/date");
        
//         // Check if the request was successful
//         if (!response.ok) {
//             throw new Error("Failed to fetch date");
//         }

//         // Parse the response JSON
//         const data = await response.json();

//         // Log the data to the console
//         console.log(data);

//         // Respond with a JSON message
//         res.json({ message: 'Hello NextJs Cors!' });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         // Respond with an error message
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
