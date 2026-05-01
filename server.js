const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS setup - sab allow
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Health check endpoint (Render ke liye)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CivicAssist is running' });
});

// ✅ API endpoint
app.post('/api/ask', async (req, res) => {
    console.log('📥 Request received:', req.body.question); // Log for debugging
    
    try {
        const { question, age, conversationHistory } = req.body;
        
        // ✅ Check if API key exists
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY is missing!');
            return res.json({ 
                success: false, 
                reply: '❌ API key missing. Please check Render environment variables.' 
            });
        }
        
        // ✅ Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `You are CivicAssist, a friendly election education AI assistant.
        
User's age: ${age || 'Not provided'}

User question: ${question}

INSTRUCTIONS:
1. Answer ONLY about elections, voting, democracy, and government
2. Keep answers helpful, accurate, and easy to understand
3. Use emojis occasionally to be friendly
4. Be concise (2-3 paragraphs max)`;

        console.log('📤 Calling Gemini API...');
        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        console.log('✅ Gemini response received');
        
        res.json({ success: true, reply });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.json({ 
            success: false, 
            reply: `❌ Error: ${error.message}. Please try again.` 
        });
    }
});

// ✅ Serve index.html for all other routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 CivicAssist server running on port ${PORT}`);
    console.log(`📂 Serving frontend from: ${path.join(__dirname, 'frontend')}`);
    console.log(`✅ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Set ✓' : 'Missing ✗'}`);
});
