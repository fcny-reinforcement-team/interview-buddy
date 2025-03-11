import express, {Router} from 'express'
import {Request, Response} from 'express'
import dotenv from 'dotenv'
import OpenAI from 'openai';
dotenv.config();

const router: Router = express.Router();
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
})

let assistantId: string | null = null;  // Store assistant ID
let threadId: string | null = null;     // Store thread ID

router.post('/start-interview', async (req: Request, res: Response) => {
  const { language, topic, difficulty } = req.body;

  try {
    // Create the Assistant with instructions to simulate a coding interview
    const assistant = await openai.beta.assistants.create({
      name: "Coding Interview Assistant",
      instructions: `You are a helpful assistant simulating a technical interview. You will ask coding questions in ${language} on the topic of ${topic} with a difficulty level of ${difficulty}. Do not give the answer directly, only provide hints if the user asks for help.`,
      tools: [], // No tools for this example
      model: "gpt-4", // Use GPT model
    });

    assistantId = assistant.id;  // Save assistant ID

    // Create a Thread for the interview
    const thread = await openai.beta.threads.create();
    threadId = thread.id;  // Save the thread ID

    // Send initial greeting message
    const greetingMessage = "Hello, my name is Chet Gipeeti, and I will be giving you your coding interview. Are you ready?";
    
    // Add the initial greeting to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "assistant",
      content: greetingMessage,
    });

    res.status(200).json({
      message: "Conversation started! Waiting for the user to confirm readiness.",
      assistantId,
      threadId
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ error: "Error starting interview" });
  }
});

router.post('/ask-question', async (req: Request, res: Response) => {
  const { userMessage } = req.body;

  if (!assistantId || !threadId) {
    return res.status(400).json({ error: "Conversation not started yet. Please start the interview first." });
  }

  try {
    // Add the user's message (whether they said "yes" or not) to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage
    });

    // Check if the user is ready (responded with "yes")
    if (userMessage.toLowerCase().includes("yes")) {
      // Provide the first coding question
      const firstQuestion = "Great! Here's your first question: What is a binary search tree and how does it work?";
      
      // Add the first question to the thread
      await openai.beta.threads.messages.create(threadId, {
        role: "assistant",
        content: firstQuestion,
      });

      res.json({ message: firstQuestion });
    } else {
      // If user did not confirm readiness, ask again
      const prompt = "I need your confirmation to proceed. Are you ready to begin your coding interview?";
      
      await openai.beta.threads.messages.create(threadId, {
        role: "assistant",
        content: prompt,
      });

      res.json({ message: prompt });
    }

  } catch (error) {
    console.error("Error during conversation:", error);
    res.status(500).json({ error: "Error during conversation" });
  }
});
        
    
export default router;