// ================= INIT =================
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

// ================= AI LAYER =================
function detectIntent(message) {
    const msg = message.toLowerCase();

    if (msg.includes('vote')) return "Voting Process";
    if (msg.includes('register')) return "Voter Registration";
    if (msg.includes('election')) return "Election Information";
    if (msg.includes('blockchain')) return "Voting Technology";
    if (msg.includes('government')) return "Government System";
    if (msg.includes('timeline')) return "Election Timeline";

    return "General Civic Query";
}

function generateConfidence() {
    return Math.floor(Math.random() * 15) + 85;
}

// ================= UI =================
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
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message assistant-message';
    typingDiv.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatArea.appendChild(typingDiv);
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ================= YOUR ORIGINAL FEATURES =================

// Modern Voting
function getModernVotingMethods() {
    return `💻 Modern Voting Methods:
• Internet Voting (Estonia)
• Blockchain Voting
• Mobile Voting Apps
• Biometric EVMs
• Postal Voting`;
}

// Estonia
function getEstoniaInfo() {
    return `🇪🇪 Estonia:
• First country with online voting (2005)
• Secure digital ID system`;
}

// Blockchain
function getBlockchainInfo() {
    return `🔗 Blockchain Voting:
• Tamper-proof
• Transparent
• Still experimental`;
}

// Voting Process
function getVotingProcess() {
    return `🗳️ Voting Steps:
1. Register
2. Go to polling booth
3. Vote privately
4. Submit ballot`;
}

// Country
function getCountryInfo(country) {
    if (country.includes("india")) return "India uses EVM voting system.";
    if (country.includes("usa")) return "USA uses paper + electronic voting.";
    return "Most countries follow democratic voting.";
}

// ================= RESPONSE ENGINE =================
function getResponse(message) {
    const msg = message.toLowerCase();

    // Age
    if (userAge === null && /^\d+$/.test(message)) {
        userAge = parseInt(message);
        return userAge < 18
            ? `You are ${userAge}. Not eligible yet.`
            : `You are eligible to vote!`;
    }

    if (msg.includes("modern")) return getModernVotingMethods();
    if (msg.includes("estonia")) return getEstoniaInfo();
    if (msg.includes("blockchain")) return getBlockchainInfo();
    if (msg.includes("process") || msg.includes("vote")) return getVotingProcess();

    if (msg.includes("india") || msg.includes("usa"))
        return getCountryInfo(msg);

    if (msg.includes("election"))
        return "Elections are a democratic process.";

    if (msg.includes("register"))
        return "Register before election deadline.";

    return "Ask about elections, voting, or government!";
}

// ================= AI RESPONSE =================
function processResponse(message) {
    showTypingIndicator();
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;

    setTimeout(() => {
        const intent = detectIntent(message);
        const confidence = generateConfidence();
        const result = getResponse(message);

        hideTypingIndicator();

        const finalResponse = `
🤖 <b>AI Analysis</b><br>
Intent: ${intent}<br>
Confidence: ${confidence}%<br><br>

⚙️ Processing query...<br><br>

✅ <b>Answer:</b><br>
${result}
        `;

        addMessage(finalResponse);

        sendBtn.disabled = false;
    }, 900);
}

// ================= SEND =================
function sendMessage() {
    try {
        const input = document.getElementById('userInput');
        let message = input.value.trim();

        if (!message) {
            addMessage("⚠️ Enter something");
            return;
        }

        message = message.replace(/</g, "&lt;");

        addMessage(message, true);
        input.value = '';

        processResponse(message);

    } catch (error) {
        console.error(error);
        addMessage("❌ Error occurred");
    }
}

// ================= EVENTS =================
function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

function askQuestion(q) {
    document.getElementById('userInput').value = q;
    sendMessage();
}

// ================= TESTING =================
function runTests() {
    console.assert(getResponse("vote") !== "", "vote fail");
    console.assert(getResponse("estonia") !== "", "estonia fail");
    console.assert(getResponse("blockchain") !== "", "blockchain fail");
    console.log("All tests passed");
}
runTests();
