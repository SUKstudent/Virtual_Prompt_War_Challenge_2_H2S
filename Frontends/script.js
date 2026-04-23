let userAge = null;
let conversationHistory = [];
const API_URL = 'http://localhost:3000/api/chat';

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
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    showTypingIndicator();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                userAge: userAge,
                conversationHistory: conversationHistory.slice(-10)
            })
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
        console.error('Error:', error);
        addMessage("Unable to connect to AI service. Please make sure the backend is running on port 3000. 🗳️", false, true);
    } finally {
        sendBtn.disabled = false;
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

async function checkBackend() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            document.getElementById('statusBar').innerHTML = `
                <span>✅ AI Connected • Powered by Gemini</span>
                <a href="#" onclick="openFeedbackForm(); return false;">📊 Give feedback</a>
            `;
        }
    } catch (error) {
        document.getElementById('statusBar').innerHTML = `
            <span>⚠️ AI Offline • Run 'npm start' in backend folder</span>
            <a href="#" onclick="openFeedbackForm(); return false;">📊 Give feedback</a>
        `;
    }
}

setTimeout(checkBackend, 1000);
