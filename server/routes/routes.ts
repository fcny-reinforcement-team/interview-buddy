import express, {Router} from 'express'
import {Request, Response} from 'express'
import dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config();

const router: Router = express.Router();

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
})

const conversations: { 
    [sessionId: string]: { 
        context: { language: string; topic: string; difficulty: string };
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
    } 
} = {};

router.post('/message', async (req: Request, res: Response) => {
    const { sessionId, language, topic, difficulty, userMessage } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required to track conversation" });
    }

    // If session does not exist, create it & store context
    if (!conversations[sessionId]) {
        if (!language || !topic || !difficulty) {
            return res.status(400).json({ error: "First request must include language, topic, and difficulty" });
        }

        conversations[sessionId] = {
            context: { language, topic, difficulty },
            messages: [
                {
                    role: "system",
                    content: `You are an AI interviewer. Conduct a coding interview with a Leetcode-style problem on ${topic} in ${language} with ${difficulty} difficulty.`
                }
            ]
        };
    }

    // Retrieve stored context (so users don't need to resend it)
    const { language: storedLanguage, topic: storedTopic, difficulty: storedDifficulty } = conversations[sessionId].context;

    // Add user message
    conversations[sessionId].messages.push({ role: "user", content: userMessage });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversations[sessionId].messages, // Full conversation history
        });

        const aiMessage = response.choices[0].message.content;

        // Add AI response to history
        conversations[sessionId].messages.push({ role: "assistant", content: aiMessage as string });

        res.json({
            message: aiMessage,
            history: conversations[sessionId].messages, // Send updated history
            context: { language: storedLanguage, topic: storedTopic, difficulty: storedDifficulty }
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Failed to fetch interview response." });
    }
});

        
    
export default router;