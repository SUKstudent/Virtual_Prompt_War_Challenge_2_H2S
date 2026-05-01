const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS - Sab kuch allow (Render ke liye)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// ✅ Body parser
app.use(express.json());

// ✅ Serve frontend files from "frontend" folder
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CivicAssist is running',
        apiKeySet: !!process.env.GEMINI_API_KEY
    });
});

// ✅ Main API endpoint
app.post('/api/ask', async (req, res) => {
    console.log('📥 Request received at /api/ask');
    console.log('📥 Question:', req.body.question);
    
    try {
        const { question, age, conversationHistory } = req.body;
        
        // Check if question exists
        if (!question) {
            return res.json({ 
                success: false, 
                reply: '❌ Please ask a question.' 
            });
        }
        
        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY missing!');
            return res.json({ 
                success: false, 
                reply: '❌ API key configuration error. Please contact support.' 
            });
        }
        
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Build prompt
        const prompt = `You are CivicAssist, a friendly election education AI assistant.
        
User's age: ${age || 'Not provided'}

User question: ${question}

INSTRUCTIONS:
1. Answer ONLY about elections, voting, democracy, and government
2. If question is not election-related, say: "I'm specialized in elections and voting. Please ask me something about elections!"
3. Keep answers helpful, accurate, and easy to understand (for all ages)
4. Include modern election methods (e-voting, internet voting, blockchain) when relevant
5. Use emojis occasionally to be friendly
6. Be concise - 2 to 3 paragraphs maximum
7. If user asks about age/eligibility, tell them voting age is 18 in most countries`;

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

// ✅ Handle preflight requests
app.options('/api/ask', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

// ✅ Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 CivicAssist server running on port ${PORT}`);
    console.log(`📂 Serving frontend from: ${path.join(__dirname, 'frontend')}`);
    console.log(`✅ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Set ✓' : 'Missing ✗'}`);
});
