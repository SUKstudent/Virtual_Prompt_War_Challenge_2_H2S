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

function addMessage(text, isUser = false) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.innerHTML = `<div class="bubble">${text.replace(/\n/g, '<br>')}</div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
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
    
    // Modern Voting Methods
    if (lowerMsg.includes('modern voting') || lowerMsg.includes('modern election')) {
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

🖥️ **Electronic Voting Machines (EVM)**
• Used in India (1M+ machines), Brazil, Philippines
• Results in hours, not days`;
    }
    
    // Estonia e-Voting
    if (lowerMsg.includes('estonia')) {
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
    
    // Blockchain Voting
    if (lowerMsg.includes('blockchain')) {
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
    
    // Elections explanation
    if (lowerMsg.includes('what are elections')) {
        return `🗳️ **What are Elections?**

Elections are a formal process where citizens choose their representatives. They are the foundation of democratic societies, allowing peaceful transfer of power and giving people a voice in government.

**Key features:**
• Regular intervals (every 4-5 years in most countries)
• Secret ballot to protect voter privacy
• Universal adult suffrage (citizens 18+)
• Independent election commissions`;
    }
    
    // Voting process
    if (lowerMsg.includes('how does voting work') || lowerMsg.includes('voting process')) {
        return `🗳️ **Step-by-Step Voting Process:**

**Before Election Day:**
• Register to vote before deadline
• Find your assigned polling station
• Check what ID you need to bring

**On Election Day:**
• Go to your polling station
• Show your ID and voter card
• Receive your ballot paper
• Go to a private voting booth
• Mark your choice clearly
• Fold and deposit ballot in the box

**After Voting:**
• Get your finger marked (in many countries)
• Your vote is counted with others
• Results announced after counting`;
    }
    
    // Registration
    if (lowerMsg.includes('register')) {
        return `📝 **How to Register to Vote:**

1. Check eligibility (18+ in most countries)
2. Find your local election office
3. Fill registration form (online or paper)
4. Provide ID and address proof
5. Submit before deadline
6. Receive voter ID card

**Tip:** Many countries now offer online registration!`;
    }
    
    // India elections
    if (lowerMsg.includes('india')) {
        return `🇮🇳 **Election Rules of India:**

• Voting age: 18 years
• Voter ID card (EPIC) required
• Electronic Voting Machines (EVMs) with VVPAT
• Managed by Election Commission of India
• Lok Sabha elections every 5 years
• World's largest democracy with nearly 1 billion voters
• Over 1 million polling stations!`;
    }
    
    // Continent info
    if (lowerMsg.includes('asia')) {
        return `🌏 **Asia** - Government types: Republics, Monarchies, One-Party States

**Example countries:**
🇮🇳 India - Federal Parliamentary Republic
🇨🇳 China - One-Party Socialist Republic
🇯🇵 Japan - Constitutional Monarchy
🇰🇷 South Korea - Presidential Republic
🇸🇦 Saudi Arabia - Absolute Monarchy

**Common election rules:** Voting age 18, Voter ID required, Elections every 4-5 years`;
    }
    
    // Eligible check
    if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        if (userAge) {
            return userAge >= 18 ? "✅ You are eligible to vote!" : "📝 You need to be 18+ to vote. You'll be eligible when you turn 18.";
        } else {
            return "📝 Please tell me your age first!";
        }
    }
    
    // Timeline
    if (lowerMsg.includes('timeline')) {
        return `📅 **Election Timeline:**

Announcement → Nominations → Campaign → Registration deadline → Early voting → Election Day → Counting → Results

Typically 2-6 months depending on the country.`;
    }
    
    // Default response
    return `🗳️ I can help with:
• What elections are
• How to register to vote
• Voting process (step by step)
• Modern voting methods (E-voting, Blockchain)
• Election timelines
• Age eligibility
• Estonia's e-voting system
• Country election rules (India, USA, UK, etc.)

Try asking: "What are modern voting methods?" or "Estonia e-Voting" or "How does voting work?"`;
}

function processResponse(message) {
    showTypingIndicator();
    setTimeout(() => {
        const response = getResponse(message);
        hideTypingIndicator();
        addMessage(response, false);
    }, 500);
}

function askQuestion(question) {
    document.getElementById('userInput').value = question;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message === '') return;
    
    addMessage(message, true);
    input.value = '';
    processResponse(message);
}
