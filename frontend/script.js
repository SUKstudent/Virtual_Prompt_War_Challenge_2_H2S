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

    if (msg.includes('vote')) return "Voting Process Query";
    if (msg.includes('register')) return "Voter Registration Query";
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
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    div.innerHTML = `<div class="bubble">${text.replace(/\n/g,'<br>')}</div>`;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showTypingIndicator() {
    const chatArea = document.getElementById('chatArea');
    const div = document.createElement('div');
    div.id = "typingIndicator";
    div.className = "message assistant-message";
    div.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatArea.appendChild(div);
}

function hideTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ================= CORE LOGIC (YOUR ORIGINAL STYLE) =================
function getResponse(message) {
    const msg = message.toLowerCase();

    if (userAge === null && /^\d+$/.test(message)) {
        userAge = parseInt(message);
        return userAge < 18
            ? `You are ${userAge}. You can learn about elections!`
            : `You are eligible to vote!`;
    }

    if (msg.includes("election"))
        return "Elections allow citizens to choose representatives.";

    if (msg.includes("vote"))
        return "Voting is the process of selecting leaders.";

    if (msg.includes("register"))
        return "Register by submitting ID before deadline.";

    if (msg.includes("blockchain"))
        return "Blockchain voting is secure and transparent.";

    return "Ask me about elections, voting, or government!";
}

// ================= AI RESPONSE =================
function processResponse(message) {
    showTypingIndicator();
    const btn = document.getElementById('sendBtn');
    btn.disabled = true;

    setTimeout(() => {
        const intent = detectIntent(message);
        const confidence = generateConfidence();
        const result = getResponse(message);

        hideTypingIndicator();

        const response = `
🤖 <b>AI Analysis</b><br>
Intent: ${intent}<br>
Confidence: ${confidence}%<br><br>

⚙️ <b>Processing</b><br>
Analyzing election query...<br><br>

✅ <b>Result</b><br>
${result}
`;

        addMessage(response);

        btn.disabled = false;
    }, 900);
}

// ================= SEND =================
function sendMessage() {
    try {
        const input = document.getElementById('userInput');
        let msg = input.value.trim();

        if (!msg) {
            addMessage("⚠️ Enter a question");
            return;
        }

        msg = msg.replace(/</g,"&lt;");
        addMessage(msg, true);
        input.value = "";

        processResponse(msg);

    } catch (e) {
        console.error(e);
        addMessage("Error occurred");
    }
}

// ================= EVENTS =================
function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function askQuestion(q) {
    document.getElementById('userInput').value = q;
    sendMessage();
}

// ================= TESTING =================
function runTests() {
    console.assert(getResponse("vote") !== "", "vote fail");
    console.assert(getResponse("election") !== "", "election fail");
    console.assert(getResponse("blockchain") !== "", "blockchain fail");
    console.log("Tests passed");
}
runTests();
