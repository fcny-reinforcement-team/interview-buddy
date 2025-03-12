import express, {Router} from 'express'
import {Request, Response} from 'express'
import dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config();

const router: Router = express.Router();

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
})

const sessions: { 
    [sessionId: string]: { 
        context: { language: string; topic: string; difficulty: string };
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
    } 
} = {};

router.post('/message', async (req: Request, res: Response) => {
    const { sessionId, language, topic, difficulty, userMessage } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: "Missing sessionId. Start a new session first." });
    }

    // If it's a new session, initialize it
    if (!sessions[sessionId]) {
        if (!language || !topic || !difficulty) {
            return res.status(400).json({ error: "First request must include language, topic, and difficulty." });
        }

        sessions[sessionId] = {
            context: { language, topic, difficulty },
            messages: [
                {
                    role: "system",
                    content: `You are an AI interviewer. Conduct a mock coding interview with Leetcode-style problems on ${topic} in ${language} with ${difficulty} difficulty. 
                              Ask questions one by one. Provide real-time feedback after each response.`
                }
            ]
        };
    }

    // Retrieve session and context
    const session = sessions[sessionId];
    
    // Add user's response
    session.messages.push({ role: "user", content: userMessage });

    try {
        // Generate AI response
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: session.messages, // Keep full conversation context
        });

        const aiMessage = response.choices[0].message.content;

        // Add AI response to conversation
        session.messages.push({ role: "assistant", content: aiMessage as string });

        res.json({
            message: aiMessage,
            history: session.messages, // Send full chat history to frontend
            context: session.context // Send interview details
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Failed to generate interview response." });
    }
});

        
    
export default router;