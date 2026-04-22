let userAge = null;

// Screen switching
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
    addMessage("📝 Thank you for your feedback! It helps make CivicAssist better.");
}

function processAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        addMessage("Please enter a valid number for your age. 📝 <strong>What's your age?</strong>");
        return false;
    }
    
    userAge = ageNum;
    
    if (userAge < 18) {
        addMessage(`👋 You are ${userAge} years old.<br><br>
        🌟 In most countries, voting age is 18. While you cannot vote yet, you can:<br>
        • Learn about elections<br>
        • Encourage eligible family members to vote<br>
        • Stay informed for when you become eligible!`);
    } else {
        addMessage(`✅ Great! You are ${userAge} and <strong>eligible to vote</strong> in most countries.<br><br>
        Ask me about registration, voting process, or election timelines!`);
    }
    return true;
}

function getElectionExplanation() {
    return `📖 <strong>What are Elections?</strong><br><br>
    Elections are a formal process where citizens choose their representatives. They are the foundation of democracy.<br><br>
    <strong>Key points:</strong><br>
    • People vote for leaders who represent them<br>
    • Elections can be local, regional, or national<br>
    • Voting is done by secret ballot<br>
    • Regular elections ensure accountability`;
}

function getRegistrationGuide() {
    return `📝 <strong>How Voter Registration Works</strong><br><br>
    <strong>Step-by-step:</strong><br>
    • Check eligibility (18+ in most countries)<br>
    • Find local election office<br>
    • Fill application with ID and address proof<br>
    • Submit before deadline<br>
    • Receive voter ID card`;
}

function getVotingProcess() {
    return `🗳️ <strong>Step-by-Step Voting Process</strong><br><br>
    <strong>Before Election Day:</strong> Register, find polling station<br>
    <strong>On Election Day:</strong> Show ID, get ballot, vote privately<br>
    <strong>After Voting:</strong> Your vote is counted with others`;
}

function getElectionTimeline() {
    return `📅 <strong>Election Timeline</strong><br><br>
    • Announcement → Candidate nomination → Campaign period<br>
    • Voter registration deadline (2-4 weeks before)<br>
    • Early voting (if available) → Election Day<br>
    • Counting → Results announced`;
}

function getEligibilityCheck() {
    if (userAge === null) {
        return "📝 Please tell me <strong>your age first</strong>. How old are you?";
    } else if (userAge < 18) {
        return `👤 You are ${userAge}. Not yet eligible to vote (need to be 18+).`;
    } else {
        return `✅ You are ${userAge} and <strong>eligible to vote</strong>!`;
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
    }, 300);
}

function processResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        processAge(message);
        return;
    }
    
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election')) {
        addMessage(getElectionExplanation());
    }
    else if (lowerMsg.includes('register')) {
        addMessage(getRegistrationGuide());
    }
    else if (lowerMsg.includes('voting process') || lowerMsg.includes('how to vote')) {
        addMessage(getVotingProcess());
    }
    else if (lowerMsg.includes('timeline')) {
        addMessage(getElectionTimeline());
    }
    else if (lowerMsg.includes('eligible') || lowerMsg.includes('can i vote')) {
        addMessage(getEligibilityCheck());
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        addMessage("Hello! 👋 Ask me about elections, registration, or voting!");
    }
    else {
        addMessage(`🤔 Ask me about:<br>
        • What elections are<br>
        • Voter eligibility<br>
        • Registration process<br>
        • Voting process<br>
        • Election timelines`);
    }
}
