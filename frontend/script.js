let userAge = null;
let conversationHistory = [];
const API_URL = 'https://civic-agent.onrender.com/api/chat';

function addMessage(text, isUser = false, saveToHistory = true) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.innerHTML = `<div class="bubble">${text.replace(/\n/g, '<br>')}</div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    if (saveToHistory) {
        conversationHistory.push({
            role: isUser ? 'user' : 'assistant',
            content: text
        });
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }
    }
}

function showTypingIndicator() {
    const chatArea = document.getElementById('chatArea');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function sendToAI(message) {
    showTypingIndicator();
    
    // Simulate AI response for demo
    setTimeout(() => {
        hideTypingIndicator();
        
        let responseText = '';
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('register')) {
            responseText = `🗳️ **How to Register to Vote:**\n\n1. Check your eligibility (18+ in most countries)\n2. Find your local election office or website\n3. Fill out a registration form (online or paper)\n4. Provide ID and address proof\n5. Submit before the deadline\n6. Receive your voter ID card\n\nWould you like to know about voting process next?`;
        } 
        else if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
            responseText = `🗳️ Elections are a formal process where citizens choose their representatives. They are the foundation of democracy, allowing peaceful transfer of power and giving people a voice in government.`;
        }
        else if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
            responseText = `🗳️ To be eligible to vote in most countries:\n• Must be 18 years or older\n• Must be a citizen\n• Must be registered to vote\n\nBased on your age${userAge ? ` (${userAge})` : ''}, ${userAge && userAge >= 18 ? 'you ARE eligible to vote!' : userAge && userAge < 18 ? 'you will be eligible when you turn 18.' : 'tell me your age and I can check!'}`;
        }
        else if (lowerMsg.includes('vote process') || lowerMsg.includes('how to vote')) {
            responseText = `🗳️ **Voting Process:**\n\n1. Register before deadline\n2. Find your polling station\n3. Bring ID and voter card\n4. Go to voting booth\n5. Mark your choice\n6. Submit your ballot\n\nYour vote is counted privately and securely.`;
        }
        else if (lowerMsg.includes('timeline')) {
            responseText = `🗳️ **Election Timeline:**\n\n• Announcement → Nominations → Campaign → Registration deadline → Early voting → Election Day → Counting → Results\n\nTypically takes 2-6 months depending on the country.`;
        }
        else {
            responseText = `🗳️ Civicoin: "${message}"\n\nI can help with:\n• What elections are\n• How to register\n• Voting process\n• Election timelines\n• Age eligibility\n• Government types\n\nWhat would you like to know?`;
        }
        
        addMessage(responseText, false, true);
    }, 800);
}

function processResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        userAge = parseInt(message);
        if (userAge < 18) {
            addMessage(`👋 You are ${userAge} years old. In most countries, voting age is 18. While you cannot vote yet, you can learn about elections! Ask me anything.`, false, true);
        } else {
            addMessage(`✅ Got it! You are ${userAge} years old and eligible to vote in most countries. Ask me anything about elections!`, false, true);
        }
        return;
    }
    
    sendToAI(message);
}

function askQuestion(question) {
    document.getElementById('userInput').value = question;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

function openFeedbackForm() {
    window.open('https://forms.gle/Udv1qZTdsv44aVjq9', '_blank');
    addMessage("📝 Thank you for your feedback! It helps make CivicAssist better.", false, true);
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message === '') return;
    
    addMessage(message, true, true);
    input.value = '';
    setTimeout(() => processResponse(message), 100);
}

// Check backend connection on load (optional)
async function checkBackend() {
    try {
        const response = await fetch(API_URL.replace('/chat', '/health'));
        if (response.ok) {
            const statusBar = document.getElementById('statusBar');
            if (statusBar) {
                statusBar.innerHTML = `
                    <span>✅ AI Connected • Powered by Gemini</span>
                    <a href="#" onclick="openFeedbackForm(); return false;">📊 Give feedback</a>
                `;
            }
        }
    } catch (error) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.innerHTML = `
                <span>⚠️ AI Offline • Mock mode active</span>
                <a href="#" onclick="openFeedbackForm(); return false;">📊 Give feedback</a>
            `;
        }
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkBackend();
});
