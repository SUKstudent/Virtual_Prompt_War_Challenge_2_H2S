let userAge = null;
let conversationHistory = [];

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

function getContinentInfo(continent) {
    const continentData = {
        'asia': `🌏 **Asia** - Government types: Republics, Monarchies, One-Party States

**Example countries:**
🇮🇳 India - Federal Parliamentary Republic (Democracy)
🇨🇳 China - One-Party Socialist Republic
🇯🇵 Japan - Constitutional Monarchy
🇰🇷 South Korea - Presidential Republic
🇸🇦 Saudi Arabia - Absolute Monarchy

**Common election rules:** Voting age 18, Voter ID required, Elections every 4-5 years`,

        'africa': `🌍 **Africa** - Most common: Presidential Republics

**Example countries:**
🇳🇬 Nigeria - Federal Presidential Republic
🇿🇦 South Africa - Parliamentary Republic
🇰🇪 Kenya - Presidential Republic
🇬🇭 Ghana - Presidential Republic
🇪🇬 Egypt - Semi-Presidential Republic

**Common election rules:** Voting age 18, Multi-party elections`,

        'europe': `🌏 **Europe** - Most common: Parliamentary Republics, Constitutional Monarchies

**Example countries:**
🇩🇪 Germany - Federal Parliamentary Republic
🇬🇧 United Kingdom - Constitutional Monarchy
🇫🇷 France - Semi-Presidential Republic
🇮🇹 Italy - Parliamentary Republic
🇪🇸 Spain - Constitutional Monarchy

**Common election rules:** Voting age 18 (16 in some), Proportional representation`,

        'north america': `🌎 **North America** - Most common: Federal Republics

**Example countries:**
🇺🇸 USA - Federal Presidential Republic
🇨🇦 Canada - Parliamentary Democracy
🇲🇽 Mexico - Federal Presidential Republic
🇨🇺 Cuba - One-Party Republic

**Common election rules:** Voting age 18, Voter registration required`,

        'south america': `🌎 **South America** - Most common: Presidential Republics

**Example countries:**
🇧🇷 Brazil - Federal Presidential Republic
🇦🇷 Argentina - Presidential Republic
🇨🇱 Chile - Presidential Republic
🇨🇴 Colombia - Presidential Republic

**Common election rules:** Voting age 16-18, Mandatory voting in some`,

        'australia': `🌏 **Australia/Oceania** - Most common: Parliamentary Democracies

**Example countries:**
🇦🇺 Australia - Parliamentary Democracy
🇳🇿 New Zealand - Parliamentary Democracy
🇫🇯 Fiji - Parliamentary Republic

**Common election rules:** Voting age 18, Compulsory voting in Australia`,

        'antarctica': `🧊 **Antarctica** - No permanent government

Governed by Antarctic Treaty System (1959). No local elections. Researchers vote in their home countries.`
    };
    
    return continentData[continent] || `I have information about Asia, Africa, Europe, North America, South America, Australia, and Antarctica. Which continent would you like to know about?`;
}

function getResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Age handling
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        userAge = parseInt(message);
        if (userAge < 18) {
            return `👋 You are ${userAge} years old. In most countries, voting age is 18. While you cannot vote yet, you can learn about elections! Ask me anything.`;
        } else {
            return `✅ Got it! You are ${userAge} years old and eligible to vote in most countries. Ask me anything about elections!`;
        }
    }
    
    // Check for continent questions
    const continents = ['asia', 'africa', 'europe', 'north america', 'south america', 'australia', 'antarctica'];
    for (let continent of continents) {
        if (lowerMsg.includes(continent)) {
            return getContinentInfo(continent);
        }
    }
    
    // Basic election responses
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        return "🗳️ **What are Elections?**\n\nElections are a formal process where citizens choose their representatives. They are the foundation of democratic societies, allowing peaceful transfer of power and giving people a voice in government.";
    }
    
    if (lowerMsg.includes('register')) {
        return "🗳️ **How to Register to Vote:**\n\n1. Check eligibility (18+ in most countries)\n2. Find your local election office\n3. Fill registration form (online or paper)\n4. Provide ID and address proof\n5. Submit before deadline\n6. Receive voter ID card";
    }
    
    if (lowerMsg.includes('voting process') || lowerMsg.includes('how to vote')) {
        return "🗳️ **Step-by-Step Voting Process:**\n\n**Before Election Day:** Register, find polling station\n**On Election Day:** Show ID, get ballot, vote privately\n**After Voting:** Your vote is counted with others";
    }
    
    if (lowerMsg.includes('timeline')) {
        return "📅 **Election Timeline:**\n\nAnnouncement → Nominations → Campaign → Registration deadline → Early voting → Election Day → Counting → Results\n\nTypically 2-6 months depending on the country.";
    }
    
    if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        if (userAge) {
            return userAge >= 18 ? "✅ You are eligible to vote!" : "📝 You need to be 18+ to vote. You'll be eligible when you turn 18.";
        } else {
            return "📝 Please tell me your age first!";
        }
    }
    
    if (lowerMsg.includes('government types') || lowerMsg.includes('government')) {
        return `🌍 **Government Types by Continent:**\n\n• Asia: Republics, Monarchies, One-Party States\n• Africa: Presidential Republics\n• Europe: Parliamentary Republics, Constitutional Monarchies\n• North America: Federal Republics\n• South America: Presidential Republics\n• Australia: Parliamentary Democracies\n• Antarctica: No government (Treaty system)\n\nWhich continent would you like to know more about?`;
    }
    
    // Default response
    return `🗳️ I can help with:\n• What elections are\n• How to register to vote\n• Voting process\n• Election timelines\n• Age eligibility\n• Government types across 7 continents\n\nWhat would you like to know?`;
}

function processResponse(message) {
    showTypingIndicator();
    setTimeout(() => {
        const response = getResponse(message);
        hideTypingIndicator();
        addMessage(response, false, true);
    }, 500);
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
    processResponse(message);
}
