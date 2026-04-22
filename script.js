let userAge = null;

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const backBtn = document.getElementById('backToWelcome');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatScreen = document.getElementById('chatScreen');

    if (startBtn) {
        startBtn.addEventListener('click', function() {
            welcomeScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            chatScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        });
    }
});

function addMessage(text, isUser = false) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.innerHTML = `<div class="bubble">${text}</div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
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
    addMessage("Thank you for your feedback!");
}

function processAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        addMessage("Please tell me your age.");
        return false;
    }
    
    userAge = ageNum;
    
    if (userAge < 18) {
        addMessage(`You are ${userAge}. Voting age is 18+ in most countries.`);
    } else {
        addMessage(`Got it. You're eligible to vote.`);
    }
    return true;
}

function getContinentInfo(continent) {
    const continentLower = continent.toLowerCase();
    
    const continentData = {
        'asia': `🌏 **Asia** - Most common government: Republic / Monarchy / One-Party State

**Common Election Rules followed in most Asian countries:**
• Voting age: 18 years
• Voter ID required
• Elections held every 4-5 years
• Secret ballot system

**Popular countries & their government types:**
🇮🇳 India - Federal Parliamentary Republic (Democracy)
🇨🇳 China - One-Party Socialist Republic (Communist State)
🇯🇵 Japan - Constitutional Monarchy (Parliamentary Democracy)
🇰🇷 South Korea - Presidential Republic (Democracy)
🇮🇩 Indonesia - Presidential Republic (Democracy)

*And many other Asian nations.*`,
        
        'africa': `🌍 **Africa** - Most common government: Presidential Republic

**Common Election Rules followed in most African countries:**
• Voting age: 18 years
• Multi-party democratic elections
• Independent election commissions
• Term limits for presidents (in many countries)

**Popular countries & their government types:**
🇳🇬 Nigeria - Federal Presidential Republic (Democracy)
🇿🇦 South Africa - Parliamentary Republic (Democracy)
🇰🇪 Kenya - Presidential Republic (Democracy)
🇬🇭 Ghana - Presidential Republic (Democracy)
🇪🇬 Egypt - Semi-Presidential Republic

*And many other African nations.*`,
        
        'north america': `🌎 **North America** - Most common government: Federal Republic / Democracy

**Common Election Rules followed in most North American countries:**
• Voting age: 18 years
• Voter registration required
• Regular federal, state, and local elections
• Secret ballot system

**Popular countries & their government types:**
🇺🇸 USA - Federal Presidential Republic (Democracy)
🇨🇦 Canada - Parliamentary Democracy (Constitutional Monarchy)
🇲🇽 Mexico - Federal Presidential Republic (Democracy)
🇨🇺 Cuba - One-Party Socialist Republic (Communist State)
🇯🇲 Jamaica - Parliamentary Democracy (Constitutional Monarchy)

*And many other North American nations.*`,
        
        'south america': `🌎 **South America** - Most common government: Presidential Republic

**Common Election Rules followed in most South American countries:**
• Voting age: 16-18 years (16 in some countries)
• Direct presidential elections
• Mandatory voting in some countries
• Independent electoral courts

**Popular countries & their government types:**
🇧🇷 Brazil - Federal Presidential Republic (Democracy)
🇦🇷 Argentina - Presidential Republic (Democracy)
🇨🇱 Chile - Presidential Republic (Democracy)
🇨🇴 Colombia - Presidential Republic (Democracy)
🇵🇪 Peru - Presidential Republic (Democracy)

*And many other South American nations.*`,
        
        'europe': `🌏 **Europe** - Most common government: Parliamentary Republic / Constitutional Monarchy

**Common Election Rules followed in most European countries:**
• Voting age: 18 years (16 in some like Austria)
• Proportional representation
• Strong election monitoring
• Postal voting available

**Popular countries & their government types:**
🇩🇪 Germany - Federal Parliamentary Republic (Democracy)
🇫🇷 France - Semi-Presidential Republic (Democracy)
🇬🇧 United Kingdom - Constitutional Monarchy (Parliamentary Democracy)
🇮🇹 Italy - Parliamentary Republic (Democracy)
🇪🇸 Spain - Constitutional Monarchy (Parliamentary Democracy)

*And many other European nations.*`,
        
        'australia': `🌏 **Australia/Oceania** - Most common government: Parliamentary Democracy

**Common Election Rules followed in most Oceanian countries:**
• Voting age: 18 years
• Compulsory voting in Australia
• Preferential voting system
• Regular elections every 3-4 years

**Popular countries & their government types:**
🇦🇺 Australia - Parliamentary Democracy (Constitutional Monarchy)
🇳🇿 New Zealand - Parliamentary Democracy (Constitutional Monarchy)
🇫🇯 Fiji - Parliamentary Republic (Democracy)
🇵🇬 Papua New Guinea - Parliamentary Democracy

*And other Oceanian nations.*`,
        
        'antarctica': `🧊 **Antarctica** - No permanent government

**Special Note:**
• Governed by Antarctic Treaty System (1959)
• No local elections
• Researchers vote in their home countries

**Countries active in Antarctica:**
🇺🇸 USA | 🇷🇺 Russia | 🇬🇧 UK | 🇨🇳 China | 🇦🇺 Australia

*All operate under international cooperation.*`
    };
    
    return continentData[continentLower] || `I can tell you about election rules in Asia, Africa, North America, South America, Europe, Australia, and Antarctica. Which continent would you like to know about?`;
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
        addMessage(getContinentInfo(continent));
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

Feel free to ask! 🗳️`);
        return;
    }
    
    // Basic election questions
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        addMessage("Elections are a formal process where citizens choose their representatives. They are the foundation of democracy.");
    }
    else if (lowerMsg.includes('register')) {
        addMessage("To register: Check eligibility (18+), find your local election office, fill application with ID, submit before deadline.");
    }
    else if (lowerMsg.includes('how to vote') || lowerMsg.includes('voting process')) {
        addMessage("Register → Find polling station → Show ID → Get ballot → Vote privately → Your vote is counted.");
    }
    else if (lowerMsg.includes('timeline')) {
        addMessage("Announcement → Nominations → Campaign → Registration deadline → Election Day → Counting → Results.");
    }
    else if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        if (userAge) {
            addMessage(userAge >= 18 ? "You are eligible to vote." : "You need to be 18+ to vote.");
        } else {
            addMessage("Please tell me your age first.");
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

Which continent are you interested in?`);
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        addMessage("Hello! Ask me about elections, voting, eligibility, or government types by continent!");
    }
    else {
        addMessage(`I can help with:
• What elections are
• How to register
• Voting process
• Election timelines
• Age eligibility
• Government types by continent

What would you like to know? 🗳️`);
    }
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true);
    input.value = '';
    
    setTimeout(() => {
        processResponse(message);
    }, 200);
}
