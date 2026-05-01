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

// ✅ Modern Voting Methods
function getModernVotingMethods() {
    return `💻 **Modern & Digital Election Methods**

🌐 **Internet Voting (I-Voting)** - Estonia
• World's first country with nationwide internet voting (since 2005)
• Over 50% of votes cast online
• Uses digital ID cards with PIN codes

🔗 **Blockchain Voting**
• Votes recorded on tamper-proof blockchain
• Voters can verify their vote was counted
• Pilot tests in Switzerland, US, Russia

📱 **Mobile Voting Apps**
• Used for overseas/military voters
• Biometric authentication (face/fingerprint)

🧪 **Biometric EVMs** - India, Ghana
• Fingerprint/iris verification before voting

✉️ **Universal Postal Voting** - Switzerland, US states

🖥️ **Electronic Voting Machines (EVM)**
• Used in India (1M+ machines), Brazil, Philippines
• Results in hours, not days`;
}

// ✅ Old vs New Voting Technologies
function getOldVsNewVoting() {
    return `📊 **Traditional Voting vs Modern Voting**

┌─────────────────────────────────────────────────────────┐
│  🔹 TRADITIONAL VOTING METHODS 🔹                        │
├─────────────────────────────────────────────────────────┤
│ • Paper ballot system                                    │
│ • Manual counting (takes days/weeks)                    │
│ • Voters must visit polling stations                    │
│ • Physical ID verification                              │
│ • No remote voting option                               │
│ • Risk of ballot tampering                              │
│ • Used since 19th century                               │
├─────────────────────────────────────────────────────────┤
│  🔹 MODERN VOTING METHODS 🔹                             │
├─────────────────────────────────────────────────────────┤
│ • Electronic Voting Machines (EVM) - Results in hours   │
│ • Internet/I-Voting - Vote from home                    │
│ • Blockchain Voting - Tamper-proof records              │
│ • Biometric Verification - Fingerprint/face scan        │
│ • Mobile Voting Apps - For overseas citizens            │
│ • Postal/Mail-in Voting - Convenient & accessible       │
│ • VVPAT - Voter Verifiable Paper Audit Trail            │
└─────────────────────────────────────────────────────────┘

**📌 Key Improvements:**
✅ Faster results (hours vs days)
✅ More accessible (remote voting)
✅ Enhanced security (blockchain, biometrics)
✅ Reduced human error
✅ Better voter turnout

**Examples:**
🇮🇳 India - 1M+ EVMs with VVPAT
🇪🇪 Estonia - World leader in I-Voting
🇧🇷 Brazil - Fully electronic voting since 1996
🇨🇭 Switzerland - Experimenting with blockchain`;
}

// ✅ Estonia e-Voting
function getEstoniaInfo() {
    return `🇪🇪 **Estonia - World Leader in Digital Voting**

🔹 **I-Voting since 2005** (First in the world!)
🔹 **Over 50%** of votes cast online
🔹 How it works:
   1. Citizen logs in with digital ID card
   2. Votes from any computer with internet
   3. Can re-vote multiple times (last vote counts)
   4. Votes are encrypted and anonymized

✅ **Security measures:**
• Mobile ID + PIN verification
• End-to-end encryption
• Paper backup exists for audits

📌 Many countries are studying Estonia's model!`;
}

// ✅ Blockchain Voting
function getBlockchainInfo() {
    return `🔗 **Blockchain Voting - The Future?**

**What is it?**
• Voting records stored on a decentralized blockchain
• Once recorded, votes cannot be changed or deleted
• Every voter can verify their vote was counted

**Pilot Projects:**
🇨🇭 Switzerland (City of Zug)
🇺🇸 West Virginia (military overseas)
🇷🇺 Russia (2021 Moscow elections)

**Pros:**
• Tamper-proof
• Transparent (public can audit)
• No central point of failure

**Cons:**
• Voter privacy concerns
• Requires digital literacy
• Still experimental`;
}

// ✅ Complete Continent Data (All 7 Continents)
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

**Common election rules:** Voting age 18, Multi-party elections, Independent election commissions`,

        'europe': `🌏 **Europe** - Most common: Parliamentary Republics, Constitutional Monarchies

**Example countries:**
🇩🇪 Germany - Federal Parliamentary Republic
🇬🇧 United Kingdom - Constitutional Monarchy
🇫🇷 France - Semi-Presidential Republic
🇮🇹 Italy - Parliamentary Republic
🇪🇸 Spain - Constitutional Monarchy

**Common election rules:** Voting age 18 (16 in some countries), Proportional representation, Strong election monitoring`,

        'north america': `🌎 **North America** - Most common: Federal Republics

**Example countries:**
🇺🇸 USA - Federal Presidential Republic
🇨🇦 Canada - Parliamentary Democracy (Constitutional Monarchy)
🇲🇽 Mexico - Federal Presidential Republic
🇨🇺 Cuba - One-Party Republic

**Common election rules:** Voting age 18, Voter registration required, Early voting available`,

        'south america': `🌎 **South America** - Most common: Presidential Republics

**Example countries:**
🇧🇷 Brazil - Federal Presidential Republic
🇦🇷 Argentina - Presidential Republic
🇨🇱 Chile - Presidential Republic
🇨🇴 Colombia - Presidential Republic
🇵🇪 Peru - Presidential Republic

**Common election rules:** Voting age 16-18, Mandatory voting in some countries (Brazil, Argentina), Electronic voting widespread`,

        'australia': `🌏 **Australia/Oceania** - Most common: Parliamentary Democracies

**Example countries:**
🇦🇺 Australia - Parliamentary Democracy (Constitutional Monarchy)
🇳🇿 New Zealand - Parliamentary Democracy
🇫🇯 Fiji - Parliamentary Republic
🇵🇬 Papua New Guinea - Parliamentary Democracy

**Common election rules:** Voting age 18, Compulsory voting in Australia (mandatory by law), Preferential voting system`,

        'antarctica': `🧊 **Antarctica** - No permanent government

🌍 **Special Status:**
• Governed by Antarctic Treaty System (1959)
• No native population, no local elections
• No permanent government or parliament
• Researchers and staff vote in their home countries
• 54 countries have signed the treaty

**Scientific cooperation** - No political elections, only research collaboration.`
    };
    
    return continentData[continent] || `🌍 I have information about all 7 continents:

• Asia
• Africa  
• Europe
• North America
• South America
• Australia/Oceania
• Antarctica

Which continent would you like to know more about?

Example: "Government types in Europe" or "Election rules in Africa"`;
}

// ✅ Voting Process
function getVotingProcess() {
    return `🗳️ **Step-by-Step Voting Process:**

**Before Election Day:**
• Register to vote before deadline
• Find your assigned polling station
• Check what ID you need to bring
• Research candidates and issues

**On Election Day:**
• Go to your polling station
• Show your ID and voter card
• Receive your ballot paper
• Go to a private voting booth
• Mark your choice clearly
• Fold and deposit ballot in the box
• Get your finger marked (in many countries)

**After Voting:**
• Your vote is counted with others
• Results announced after counting
• Winners take office on scheduled date

**Modern Methods:**
• Vote early in person
• Vote by mail (postal voting)
• Online voting (Estonia)
• Electronic voting machines (India, Brazil)`;
}

// ✅ Country Information
function getCountryInfo(country) {
    const countryData = {
        'india': `🗳️ **Election Rules of India:**

• Voting age: 18 years
• Voter ID card (EPIC) required
• Electronic Voting Machines (EVMs) with VVPAT
• Managed by Election Commission of India
• Lok Sabha elections every 5 years
• World's largest democracy with nearly 1 billion voters
• Over 1 million polling stations`,

        'usa': `🗳️ **Election Rules of USA:**

• Voting age: 18 years
• Voter registration required (varies by state)
• Early voting and mail-in ballots available
• Election Day: First Tuesday after first Monday in November
• Electoral College system for President
• Presidential elections every 4 years
• Over 200,000 polling places`,

        'uk': `🗳️ **Election Rules of United Kingdom:**

• Voting age: 18 years
• Photo ID now required (since 2023)
• Register online (takes 5 minutes)
• Postal voting available
• General elections every 5 years
• First-past-the-post voting system
• 650 constituencies`,

        'brazil': `🗳️ **Election Rules of Brazil:**

• Voting age: 16 years (optional), 18-70 (mandatory)
• Fully electronic voting nationwide (since 1996)
• Presidential elections every 4 years
• Runoff system if no candidate gets 50%+
• Voting is mandatory for citizens 18-70
• Biometric voter identification system`,

        'germany': `🗳️ **Election Rules of Germany:**

• Voting age: 18 years
• Mixed-member proportional system
• Federal elections every 4 years
• Two votes: one for candidate, one for party
• Strong election monitoring system
• Over 60 million eligible voters`,

        'australia': `🗳️ **Election Rules of Australia:**

• Voting age: 18 years
• Compulsory voting (mandatory by law since 1924)
• Preferential voting system
• Federal elections every 3 years
• Fine for not voting (~$20 AUD)
• Over 90% voter turnout (among world's highest)`
    };
    
    for (let key in countryData) {
        if (country.toLowerCase().includes(key)) {
            return countryData[key];
        }
    }
    
    return `🗳️ **Election information for ${country.charAt(0).toUpperCase() + country.slice(1)}**

Most countries follow common election principles:
• Voting age: 18 years
• Voter registration required
• Secret ballot system
• Regular elections every 4-5 years
• Independent election commission

For specific rules, check your country's official Election Commission website!`;
}

// ✅ Main Response Function
function getResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Age handling
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        userAge = parseInt(message);
        if (userAge < 18) {
            return `👋 You are ${userAge} years old. In most countries, voting age is 18. While you cannot vote yet, you can learn about elections! Ask me anything about elections, voting methods, or government types.`;
        } else {
            return `✅ Got it! You are ${userAge} years old and eligible to vote in most countries. Ask me anything about elections!`;
        }
    }
    
    // Modern voting methods
    if (lowerMsg.includes('modern voting') || lowerMsg.includes('modern election') || lowerMsg.includes('digital voting')) {
        return getModernVotingMethods();
    }
    
    // Old vs New voting
    if (lowerMsg.includes('old vs new') || lowerMsg.includes('traditional vs modern') || lowerMsg.includes('voting technology')) {
        return getOldVsNewVoting();
    }
    
    // Estonia e-voting
    if (lowerMsg.includes('estonia')) {
        return getEstoniaInfo();
    }
    
    // Blockchain voting
    if (lowerMsg.includes('blockchain')) {
        return getBlockchainInfo();
    }
    
    // Continent questions - ALL 7 CONTINENTS
    const continents = ['asia', 'africa', 'europe', 'north america', 'south america', 'australia', 'antarctica'];
    for (let continent of continents) {
        if (lowerMsg.includes(continent)) {
            return getContinentInfo(continent);
        }
    }
    
    // Country questions
    const countries = ['india', 'usa', 'america', 'united states', 'uk', 'united kingdom', 'canada', 'brazil', 'germany', 'australia', 'south korea', 'japan', 'china', 'france', 'italy', 'spain'];
    for (let country of countries) {
        if (lowerMsg.includes(country)) {
            return getCountryInfo(country);
        }
    }
    
    // Basic election responses
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        return "🗳️ **What are Elections?**\n\nElections are a formal process where citizens choose their representatives. They are the foundation of democratic societies, allowing peaceful transfer of power and giving people a voice in government.\n\n**Key features:**\n• Regular intervals (every 4-5 years in most countries)\n• Secret ballot to protect voter privacy\n• Universal adult suffrage (citizens 18+)\n• Independent election commissions";
    }
    
    if (lowerMsg.includes('how does voting work') || lowerMsg.includes('voting process')) {
        return getVotingProcess();
    }
    
    if (lowerMsg.includes('register')) {
        return "📝 **How to Register to Vote:**\n\n1. Check eligibility (18+ in most countries)\n2. Find your local election office or website\n3. Fill registration form (online or paper)\n4. Provide ID and address proof\n5. Submit before deadline (usually 2-4 weeks before election)\n6. Receive voter ID card or confirmation\n\n**Tip:** Many countries now offer online registration!";
    }
    
    if (lowerMsg.includes('timeline')) {
        return "📅 **Election Timeline:**\n\n📢 Announcement → 📝 Nominations → 🎪 Campaign → 📋 Registration deadline → 🗳️ Early voting → ✅ Election Day → 🔢 Counting → 📊 Results\n\n**Duration:** Typically 2-6 months depending on the country.";
    }
    
    if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        if (userAge) {
            return userAge >= 18 ? "✅ You are eligible to vote in most countries! Make sure to register before the deadline." : "📝 You need to be 18+ to vote in most countries. You'll be eligible when you turn 18. Until then, learn about elections!";
        } else {
            return "📝 Please tell me your age first! I'll check your eligibility.";
        }
    }
    
    // Default response
    return `🗳️ **CivicAssist - Your Election Guide**

I can help you understand:

📌 **What elections are**
📝 **How to register to vote**
🗳️ **Step-by-step voting process**
📅 **Election timelines**
🌍 **Government types across 7 continents**
💻 **Modern voting methods** (E-voting, Blockchain)
🇪🇪 **Estonia's digital voting system**
📊 **Traditional vs Modern voting**
✅ **Age eligibility check**

**Try asking me:**
• "What are elections?"
• "How does voting work?"
• "Modern voting methods"
• "Old vs New voting technologies"
• "Government types in Europe"
• "Election rules in India"
• "Internet voting in Estonia"
• "What is blockchain voting?"

Let's make elections easy to understand! 🗳️`;
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
    window.open('https://forms.gle/GOOGLE_FORMS_LINK', '_blank');
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
