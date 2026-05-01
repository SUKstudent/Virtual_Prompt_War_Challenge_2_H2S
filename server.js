const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS - sab allow
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Serve static files from 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ API endpoint
app.post('/api/ask', async (req, res) => {
    console.log('Question:', req.body.question);
    
    try {
        const { question, age } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                success: false, 
                reply: '❌ API key missing. Please add GEMINI_API_KEY in environment variables.' 
            });
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `You are CivicAssist, a friendly election education AI assistant.
        
User's age: ${age || 'Not provided'}

User question: ${question}

Answer ONLY about elections, voting, and democracy. Be concise and helpful. Use emojis.`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        
        res.json({ success: true, reply });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            success: false, 
            reply: '❌ Error: ' + error.message 
        });
    }
});

// ✅ Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Railway ke liye - listen on PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 CivicAssist server running on port ${PORT}`);
    console.log(`✅ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Set ✓' : 'Missing ✗'}`);
});
