let userAge = null;
let recognition = null;
let isListening = false;

// Chat History (stored in localStorage)
let chatHistory = [];

// Load chat history from localStorage
function loadChatHistory() {
    const saved = localStorage.getItem('civicassist_chat_history');
    if (saved) {
        chatHistory = JSON.parse(saved);
        // Restore messages to chat area
        const chatArea = document.getElementById('chatArea');
        chatArea.innerHTML = '';
        chatHistory.forEach(msg => {
            addMessage(msg.text, msg.isUser, false);
        });
    }
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('civicassist_chat_history', JSON.stringify(chatHistory));
}

// Clear chat history
function clearChatHistory() {
    chatHistory = [];
    localStorage.removeItem('civicassist_chat_history');
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = '';
    // Add welcome message back
    addMessage("Hello! I'm CivicAssist. Ask me anything about elections, voting, or government types by continent.", false, false);
}

// Initialize voice recognition
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('userInput').value = transcript;
            sendMessage();
            isListening = false;
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) voiceBtn.classList.remove('listening');
        };
        
        recognition.onerror = function(event) {
            console.error('Voice recognition error:', event.error);
            isListening = false;
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) voiceBtn.classList.remove('listening');
            addMessage("Sorry, I couldn't hear you. Please try again or type your question.", false, true);
        };
        
        recognition.onend = function() {
            isListening = false;
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) voiceBtn.classList.remove('listening');
        };
    } else {
        console.warn('Voice recognition not supported');
    }
}

// Start voice input
function startVoiceInput() {
    if (!recognition) {
        addMessage("Voice input is not supported in your browser. Please type your question instead.", false, true);
        return;
    }
    
    if (isListening) {
        recognition.stop();
        isListening = false;
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('listening');
    } else {
        recognition.start();
        isListening = true;
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.classList.add('listening');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const backBtn = document.getElementById('backToWelcome');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatScreen = document.getElementById('chatScreen');
    const voiceBtn = document.getElementById('voiceBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (startBtn) {
        startBtn.addEventListener('click', function() {
            welcomeScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            loadChatHistory(); // Load saved history when entering chat
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            chatScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        });
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startVoiceInput);
    }
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Clear all chat history?')) {
                clearChatHistory();
                addMessage("Chat history cleared. Ask me anything about elections!", false, true);
            }
        });
    }
    
    // Initialize voice recognition
    initVoiceRecognition();
});

function addMessage(text, isUser = false, saveToHistory = true) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.innerHTML = `<div class="bubble">${text}</div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    if (saveToHistory) {
        chatHistory.push({ text: text, isUser: isUser });
        saveChatHistory();
    }
}

function askQuestion(question) {
    document.getElementById('userInput').value = question;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function openFeedbackForm() {
    // 🔴 REPLACE THIS LINK with your actual Google Forms link 🔴
    window.open('https://forms.gle/Udv1qZTdsv44aVjq9', '_blank');
    addMessage("Thank you for your feedback!", false, true);
}

function processAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        addMessage("Please tell me your age.", false, true);
        return false;
    }
    
    userAge = ageNum;
    
    if (userAge < 18) {
        addMessage(`You are ${userAge}. Voting age is 18+ in most countries.`, false, true);
    } else {
        addMessage(`Got it. You're eligible to vote.`, false, true);
    }
    return true;
}

function getContinentInfo(continent) {
    const continentLower = continent.toLowerCase();
    
    const continentData = {
        'asia': `🌏 **Asia** - Most common governments: Republic, Monarchy, One-Party State

**Government types found in Asia:**
• 🇮🇳 India - Federal Parliamentary Republic (Democracy)
• 🇨🇳 China - One-Party Socialist Republic (Communist State)
• 🇯🇵 Japan - Constitutional Monarchy
• 🇸🇦 Saudi Arabia - Absolute Monarchy
• 🇰🇵 North Korea - Totalitarian Dictatorship
• 🇮🇷 Iran - Theocratic Republic

**Common Election Rules:** Voting age 18, Voter ID required, Elections every 4-5 years`,
        
        'africa': `🌍 **Africa** - Most common government: Presidential Republic

**Government types found in Africa:**
• 🇳🇬 Nigeria - Federal Presidential Republic (Democracy)
• 🇿🇦 South Africa - Parliamentary Republic (Democracy)
• 🇸🇩 Sudan - Transitional Government
• 🇪🇷 Eritrea - One-Party State
• 🇲🇦 Morocco - Constitutional Monarchy

**Common Election Rules:** Voting age 18, Multi-party elections, Independent commissions`,
        
        'north america': `🌎 **North America** - Most common government: Federal Republic

**Government types found in North America:**
• 🇺🇸 USA - Federal Presidential Republic (Democracy)
• 🇨🇦 Canada - Parliamentary Democracy (Constitutional Monarchy)
• 🇲🇽 Mexico - Federal Presidential Republic (Democracy)
• 🇨🇺 Cuba - One-Party Socialist Republic

**Common Election Rules:** Voting age 18, Voter registration required, Secret ballot`,
        
        'south america': `🌎 **South America** - Most common government: Presidential Republic

**Government types found in South America:**
• 🇧🇷 Brazil - Federal Presidential Republic (Democracy)
• 🇻🇪 Venezuela - Federal Presidential Republic
• 🇦🇷 Argentina - Presidential Republic (Democracy)
• 🇨🇱 Chile - Presidential Republic (Democracy)

**Common Election Rules:** Voting age 16-18, Mandatory voting in some countries`,
        
        'europe': `🌏 **Europe** - Most common governments: Parliamentary Republic, Constitutional Monarchy

**Government types found in Europe:**
• 🇩🇪 Germany - Federal Parliamentary Republic (Democracy)
• 🇬🇧 United Kingdom - Constitutional Monarchy
• 🇫🇷 France - Semi-Presidential Republic (Democracy)
• 🇷🇺 Russia - Federal Semi-Presidential Republic
• 🇻🇦 Vatican City - Theocratic Absolute Monarchy

**Common Election Rules:** Voting age 18 (16 in some), Proportional representation`,
        
        'australia': `🌏 **Australia/Oceania** - Most common government: Parliamentary Democracy

**Government types found in Oceania:**
• 🇦🇺 Australia - Parliamentary Democracy (Constitutional Monarchy)
• 🇳🇿 New Zealand - Parliamentary Democracy
• 🇫🇯 Fiji - Parliamentary Republic (Democracy)
• 🇹🇴 Tonga - Constitutional Monarchy

**Common Election Rules:** Voting age 18, Compulsory voting in Australia`,
        
        'antarctica': `🧊 **Antarctica** - No permanent government

**Special Note:** Governed by Antarctic Treaty System (1959)
• No native population, only research stations
• No elections held
• Researchers vote in their home countries`
    };
    
    return continentData[continentLower] || `I can tell you about government types and election rules in Asia, Africa, North America, South America, Europe, Australia, and Antarctica. Which continent would you like to know about?`;
}

function detectContinent(message) {
    const continents = ['asia', 'africa', 'north america', 'south america', 'europe', 'australia', 'antarctica', 'oceania'];
    for (let continent of continents) {
        if (message.includes(continent)) {
            if (continent === 'oceania') return 'australia';
            return continent;
        }
    }
    return null;
}

function processResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Handle age
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        processAge(message);
        return;
    }
    
    // Handle continent-based questions
    const continent = detectContinent(lowerMsg);
    if (continent && (lowerMsg.includes('government') || lowerMsg.includes('election') || lowerMsg.includes('vote') || lowerMsg.includes('rules') || lowerMsg.includes('system'))) {
        addMessage(getContinentInfo(continent), false, true);
        return;
    }
    
    // Check if question is election-related
    const electionKeywords = ['election', 'vote', 'register', 'ballot', 'poll', 'candidate', 'democracy', 'citizen', 'voting', 'eligibility', 'timeline', 'process', 'how to', 'what is'];
    const isElectionRelated = electionKeywords.some(keyword => lowerMsg.includes(keyword));
    
    if (!isElectionRelated) {
        addMessage(`I'm designed to help with election and voting questions.

I can help you with:
• What elections are
• Voter eligibility
• How to register to vote
• Voting process
• Election timelines
• Government types by continent

Feel free to ask! 🗳️`, false, true);
        return;
    }
    
    // Basic election questions
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        addMessage("Elections are a formal process where citizens choose their representatives. They are the foundation of democracy.", false, true);
    }
    else if (lowerMsg.includes('register')) {
        addMessage("To register: Check eligibility (18+), find your local election office, fill application with ID, submit before deadline.", false, true);
    }
    else if (lowerMsg.includes('how to vote') || lowerMsg.includes('voting process')) {
        addMessage("Register → Find polling station → Show ID → Get ballot → Vote privately → Your vote is counted.", false, true);
    }
    else if (lowerMsg.includes('timeline')) {
        addMessage("Announcement → Nominations → Campaign → Registration deadline → Election Day → Counting → Results.", false, true);
    }
    else if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        if (userAge) {
            addMessage(userAge >= 18 ? "You are eligible to vote." : "You need to be 18+ to vote.", false, true);
        } else {
            addMessage("Please tell me your age first.", false, true);
        }
    }
    else if (lowerMsg.includes('continent') || lowerMsg.includes('government type')) {
        addMessage(`🌍 I can tell you about government types and election rules in:
• Asia
• Africa
• North America
• South America
• Europe
• Australia/Oceania
• Antarctica

Which continent are you interested in?`, false, true);
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        addMessage("Hello! Ask me about elections, voting, eligibility, or government types by continent!", false, true);
    }
    else {
        addMessage(`I can help with:
• What elections are
• How to register
• Voting process
• Election timelines
• Age eligibility
• Government types by continent

What would you like to know? 🗳️`, false, true);
    }
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true, true);
    input.value = '';
    
    setTimeout(() => {
        processResponse(message);
    }, 200);
}
