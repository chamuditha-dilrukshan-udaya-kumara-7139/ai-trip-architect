const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate', async (req, res) => {
    const { destination, days } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a professional Sri Lankan Travel Architect. 
                    Your job is to create logical road trip itineraries. 
                    You must distinguish between a single city (e.g., "Kandy") and a route (e.g., "Colombo to Ella").
                    Always respond with a valid JSON object only.` 
                },
                { 
                    role: "user", 
                    content: `Plan a ${days}-day trip for: ${destination}.
                    
                    STRICT GUIDELINES:
                    1. ROUTE LOGIC: If input is a route (A to B), suggest the best scenic path and places to stop ALONG the way.
                    2. GEOGRAPHY: Only include landmarks within a logical travel radius. No hallucinations.
                    3. BUDGET: Provide an estimated total cost in LKR for "Budget" (public transport) and "Luxury" (private car/hotels).
                    4. WEATHER: Give a brief 1-sentence general weather forecast for this destination/route during this season.
                    5. ACTIVITIES: For every activity, provide a short 1-line description.

                    JSON STRUCTURE:
                    {
                      "trip_name": "Name of the adventure",
                      "route_summary": "Briefly describe the route or city focus",
                      "weather_info": "Weather forecast",
                      "budget_estimate": { "cheap": "LKR amount", "luxury": "LKR amount" },
                      "itinerary": [
                        { 
                          "day": 1, 
                          "stay_at": "City name for the night",
                          "activities": [
                            { "name": "Place Name", "desc": "Brief info" }
                          ] 
                        }
                      ]
                    }` 
                }
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.2, // Factually accurate වෙන්න temperature එක අඩු කළා
            response_format: { type: "json_object" }
        });

        // AI එකෙන් එන JSON එක Parse කරලා Frontend එකට යවනවා
        const tripData = JSON.parse(completion.choices[0].message.content);
        res.json(tripData);
        
    } catch (error) {
        console.error("Groq Error:", error.message);
        res.status(500).json({ error: "ට්‍රිප් එක ප්ලෑන් කරන්න බැරි වුණා. පසුව උත්සාහ කරන්න." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 AI Trip Server running on port ${PORT}`));