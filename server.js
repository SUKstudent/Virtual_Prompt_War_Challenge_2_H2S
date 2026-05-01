const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));

// For any other route, serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ask', async (req, res) => {
    try {
        const { question, age, conversationHistory } = req.body;
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `You are CivicAssist, a friendly election education AI assistant.

User's age: ${age || 'Not provided'}

Previous conversation context: ${JSON.stringify(conversationHistory || [])}

User question: ${question}

INSTRUCTIONS:
1. Answer ONLY about elections, voting, democracy, and government
2. If question is not election-related, politely say: "I'm specialized in elections and voting. Please ask me something about elections!"
3. Keep answers helpful, accurate, and easy to understand (age-appropriate)
4. Include modern election methods like e-voting, internet voting, blockchain voting when relevant
5. Use emojis occasionally to be friendly
6. Be concise but informative (2-3 paragraphs max)

Remember: You are an expert on elections worldwide including traditional and modern methods.`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        
        res.json({ success: true, reply });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.json({ 
            success: false, 
            reply: '❌ Sorry, I encountered an error. Please try again in a moment.' 
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`CivicAssist server running on port ${PORT}`);
});
