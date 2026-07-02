import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Initialize Gemini API (Make sure GEMINI_API_KEY is saved in Vercel Environment Variables)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Fetch the model and inject the system instruction
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            systemInstruction: "You are a helpful, top-tier expert AI. Your goal is to solve the user's specific daily problem concisely, accurately, and beautifully formatted in markdown. Do not add unnecessary fluff."
        });

        // Generate the solution
        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        // Send the response back to the frontend
        return res.status(200).json({ result: textResponse });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: 'Failed to generate solution. Please try again later.' });
    }
}
