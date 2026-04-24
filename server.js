const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow frontend to call backend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// System prompt
const SYSTEM_PROMPT = `You are CivicAssist, an election education assistant. 
Your role is to help users understand:
- What elections are and why they matter
- Voter eligibility requirements
- How to register to vote
- Voting processes and methods
- Election timelines
- Government types across continents
- Election rules for any country or continent

Guidelines:
1. Be helpful, accurate, and educational
2. Keep responses concise (2-3 paragraphs max)
3. Use bullet points for clarity when helpful
4. If asked about non-election topics, politely redirect to election topics
5. Use emojis sparingly (🗳️ ✅ 📝 🌍) - max 3 per response`;

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'CivicAssist API is running!',
        endpoints: {
            chat: 'POST /api/chat',
            health: 'GET /api/health'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CivicAssist API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userAge, conversationHistory } = req.body;
        
        let context = SYSTEM_PROMPT + '\n\n';
        
        if (userAge) {
            context += `User age: ${userAge}. ${userAge >= 18 ? 'User is eligible to vote.' : 'User is not yet eligible to vote (needs to be 18+).'}\n\n`;
        }
        
        if (conversationHistory && conversationHistory.length > 0) {
            context += `Previous conversation:\n`;
            conversationHistory.slice(-5).forEach(msg => {
                context += `${msg.role}: ${msg.content}\n`;
            });
            context += `\n`;
        }
        
        context += `User: ${message}\n\nAssistant:`;
        
        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();
        
        res.json({ success: true, response: text });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            success: false, 
            response: "I'm having trouble connecting right now. Please try again. 🗳️" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CivicAssist backend running on http://localhost:${PORT}`);
});
