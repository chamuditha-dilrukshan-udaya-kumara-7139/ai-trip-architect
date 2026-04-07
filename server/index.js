const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk'); // මෙතන Groq import කරන්න ඕනේ

dotenv.config(); // මේක හැමතිස්සෙම මුලින්ම තියෙන්න ඕනේ

const app = express();
app.use(cors());
app.use(express.json());

// Groq setup එක කරමු (.env file එකේ තියෙන key එක ගන්නවා)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI එකෙන් Trip එක ඉල්ලන තැන
app.post('/api/generate', async (req, res) => {
    const { destination, days } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional travel planner. Give me a structured itinerary." },
                { role: "user", content: `Plan a ${days} day trip to ${destination}. Give me a short list of places to visit.` }
            ],
            model: "llama3-8b-8192",
        });

        res.json({ plan: completion.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "වැරැද්දක් වුණා! API Key එක හරිද කියලා බලන්න." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server එක Port ${PORT} හි වැඩ කරයි!`));