const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// System prompt to keep AI focused on elections
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
5. For country/continent-specific rules, provide general information and suggest checking official election commissions
6. Use emojis sparingly (🗳️ ✅ 📝 🌍) - max 3 per response

Stay focused on election education only.`;

// ========== ROOT ROUTE (Fixes "Cannot GET /") ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CivicAssist API</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                }
                h1 { margin-top: 0; }
                .endpoint {
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 10px;
                    margin: 10px 0;
                    font-family: monospace;
                }
                a {
                    color: #ffd700;
                    text-decoration: none;
                }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🗳️ CivicAssist API</h1>
                <p>Your AI-powered election education assistant backend is running!</p>
                
                <h2>📡 Available Endpoints:</h2>
                <div class="endpoint">POST /api/chat - Send your election questions</div>
                <div class="endpoint">GET /api/health - Check API status</div>
                <div class="endpoint">GET / - This page</div>
                
                <h2>📝 Example Usage:</h2>
                <div class="endpoint">
                    POST /api/chat<br>
                    Content-Type: application/json<br>
                    { "message": "What are election rules of India?" }
                </div>
                
                <p style="margin-top: 30px;">🔗 <a href="/api/health">Check API Health</a></p>
                <p>✨ Your CivicAssist frontend should connect to this API.</p>
            </div>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CivicAssist API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userAge, conversationHistory } = req.body;
        
        // Build context-aware prompt
        let context = SYSTEM_PROMPT + '\n\n';
        
        if (userAge) {
            context += `User age: ${userAge}. ${userAge >= 18 ? 'User is eligible to vote in most countries.' : 'User is not yet eligible to vote (needs to be 18+).'}\n\n`;
        }
        
        if (conversationHistory && conversationHistory.length > 0) {
            context += `Previous conversation:\n`;
            conversationHistory.slice(-5).forEach(msg => {
                context += `${msg.role}: ${msg.content}\n`;
            });
            context += `\n`;
        }
        
        context += `User: ${message}\n\nAssistant:`;
        
        // Generate response from Gemini
        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();
        
        res.json({ success: true, response: text });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            success: false, 
            response: "I'm having trouble connecting right now. Please try again in a moment. 🗳️" 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CivicAssist backend running on http://localhost:${PORT}`);
    console.log(`📝 Test the API: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Root endpoint: http://localhost:${PORT}/`);
});
