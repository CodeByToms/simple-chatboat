const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

app.get("/", (req, res) => {
    res.send("Chatbot API is running");
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
        {
            role: "system",
            content: "Give concise answers only. Answer in 1-2 short sentences. Do not provide unnecessary explanations or extra details."
        },
        {
            role: "user",
            content: message
        }
    ]
});

        const reply = response.choices[0].message.content;

        res.json({
            reply
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to get response from AI"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});