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
    
    // Simulate AI response for demo (remove this when backend connects)
    setTimeout(() => {
        hideTypingIndicator();
        
        let responseText = '';
        
        if (message.toLowerCase().includes('register')) {
            responseText = `🗳️ **How to Register to Vote:**\n\n1. Check your eligibility (18+ in most countries)\n2. Find your local election office or website\n3. Fill out a registration form (online or paper)\n4. Provide ID and address proof\n5. Submit before the deadline\n6. Receive your voter ID card\n\nWould you like to know about voting process next?`;
        } 
        else if (message.toLowerCase().includes('election')) {
            responseText = `🗳️ Elections are a formal process where citizens choose their representatives. They are the foundation of democracy, allowing peaceful transfer of power and giving people a voice in government.`;
        }
        else if (message.toLowerCase().includes('eligible')) {
            responseText = `🗳️ To be eligible to vote in most countries:\n• Must be 18 years or older\n• Must be a citizen\n• Must be registered to vote\n\nBased on your age${userAge ? ` (${userAge})` : ''}, ${userAge && userAge >= 18 ? 'you ARE eligible to vote!' : userAge && userAge < 18 ? 'you will be eligible when you turn 18.' : 'tell me your age and I can check!'}`;
        }
        else {
            responseText = `🗳️ Thanks for asking: "${message}"\n\nCivicAssist helps explain election processes, voter eligibility, registration, voting steps, and timelines. For specific rules in any country or continent, the AI backend provides detailed, accurate responses.`;
        }
        
        addMessage(responseText, false, true);
    }, 1000);
    
    /* === UNCOMMENT WHEN BACKEND IS READY ===*/
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, userAge, conversationHistory: conversationHistory.slice(-10) })
        });
        const data = await response.json();
        hideTypingIndicator();
        if (data.success) {
            addMessage(data.response, false, true);
        } else {
            addMessage("I'm having trouble connecting. Please check if the backend is running. 🗳️", false, true);
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage("Unable to connect to AI service. Please make sure the backend is running. 🗳️", false, true);
    }
    
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
