// Screen switching
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatScreen = document.getElementById('chatScreen');

    if (startBtn) {
        startBtn.addEventListener('click', function() {
            welcomeScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
        });
    }
});

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

function getVotingProcess() {
    return `🗳️ **Step-by-Step Voting Process:**\n\n**Before Election Day:**\n• Register to vote before deadline\n• Find your assigned polling station\n• Check what ID you need to bring\n\n**On Election Day:**\n• Go to your polling station\n• Show your ID and voter card\n• Receive your ballot paper\n• Go to a private voting booth\n• Mark your choice clearly\n• Fold and deposit ballot in the box\n\n**After Voting:**\n• Get your finger marked (in many countries)\n• Your vote is counted with others\n• Results announced after counting`;
}

function getCountryInfo(country) {
    const countryData = {
        'south korea': `🗳️ **Election Rules of South Korea:**\n\n• Voting age: 18 years (lowered from 19 in 2020)\n• Managed by National Election Commission (NEC)\n• Voting hours: 6 AM to 6 PM\n• Electronic voting systems used\n• Presidential elections every 5 years\n• National Assembly elections every 4 years\n• Overseas voting available\n• Election day is a national holiday`,
        
        'korea': `🗳️ **Election Rules of South Korea:**\n\n• Voting age: 18 years\n• Managed by National Election Commission (NEC)\n• Presidential elections every 5 years\n• National Assembly elections every 4 years\n• Election day is a national holiday`,
        
        'brazil': `🗳️ **Election Rules of Brazil:**\n\n• Voting age: 16 years (optional), 18-70 (mandatory)\n• Fully electronic voting nationwide\n• Presidential elections every 4 years\n• Runoff system if no candidate gets 50%+\n• Voting is mandatory for citizens 18-70\n• Biometric voter identification system`,
        
        'india': `🗳️ **Election Rules of India:**\n\n• Voting age: 18 years\n• Voter ID card (EPIC) required\n• Electronic Voting Machines (EVMs) with VVPAT\n• Managed by Election Commission of India\n• Lok Sabha elections every 5 years\n• World's largest democracy with nearly 1 billion voters`,
        
        'usa': `🗳️ **Election Rules of USA:**\n\n• Voting age: 18 years\n• Voter registration required (varies by state)\n• Early voting and mail-in ballots available\n• Election Day: First Tuesday after first Monday in November\n• Electoral College system for President\n• Presidential elections every 4 years`,
        
        'canada': `🗳️ **Election Rules of Canada:**\n\n• Voting age: 18 years\n• Voter ID required (one piece of government ID)\n• Elections Canada runs federal elections\n• Advance voting available\n• Fixed election dates every 4 years`,
        
        'uk': `🗳️ **Election Rules of United Kingdom:**\n\n• Voting age: 18 years\n• Photo ID now required\n• Register online (takes 5 minutes)\n• Postal voting available\n• General elections every 5 years\n• First-past-the-post voting system`,
        
        'germany': `🗳️ **Election Rules of Germany:**\n\n• Voting age: 18 years\n• Mixed-member proportional system\n• Federal elections every 4 years\n• Two votes: one for candidate, one for party\n• Strong election monitoring system`,
        
        'australia': `🗳️ **Election Rules of Australia:**\n\n• Voting age: 18 years\n• Compulsory voting (mandatory by law)\n• Preferential voting system\n• Federal elections every 3 years\n• Fine for not voting (~$20 AUD)`
    };
    
    for (let key in countryData) {
        if (country.toLowerCase().includes(key)) {
            return countryData[key];
        }
    }
    
    return `🗳️ **Election information for ${country.charAt(0).toUpperCase() + country.slice(1)}**\n\nMost countries follow common election principles:\n\n• Voting age: 18 years\n• Voter registration required\n• Secret ballot system\n• Regular elections every 4-5 years\n• Independent election commission\n\nFor specific rules, check your country's official Election Commission website!`;
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
    
    // Check for specific country questions
    const countries = ['india', 'china', 'japan', 'south korea', 'korea', 'usa', 'america', 'united states', 
                      'uk', 'united kingdom', 'canada', 'brazil', 'germany', 'france', 'italy', 'spain', 
                      'australia', 'nigeria', 'south africa', 'mexico', 'argentina', 'chile', 'peru'];
    
    for (let country of countries) {
        if (lowerMsg.includes(country)) {
            return getCountryInfo(country);
        }
    }
    
    // Basic election responses
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        return "🗳️ **What are Elections?**\n\nElections are a formal process where citizens choose their representatives. They are the foundation of democratic societies, allowing peaceful transfer of power and giving people a voice in government.";
    }
    
    if (lowerMsg.includes('how does voting work') || lowerMsg.includes('voting process')) {
        return getVotingProcess();
    }
    
    if (lowerMsg.includes('register')) {
        return "🗳️ **How to Register to Vote:**\n\n1. Check eligibility (18+ in most countries)\n2. Find your local election office\n3. Fill registration form (online or paper)\n4. Provide ID and address proof\n5. Submit before deadline\n6. Receive voter ID card";
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
    return `🗳️ I can help with:\n• What elections are\n• How to register to vote\n• Voting process\n• Election timelines\n• Age eligibility\n• Government types across 7 continents\n\nTry asking: "Election rules in India" or "Government types in Asia"`;
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
