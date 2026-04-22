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
    addMessage("Thank you for your feedback!");
}

function processAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        addMessage("Please enter a valid number for your age.");
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

function getElectionExplanation() {
    return `Elections are a formal process where citizens choose their representatives. They are the foundation of democracy. Voting is done by secret ballot, and regular elections ensure accountability.`;
}

function getRegistrationGuide() {
    return `To register: Check eligibility (18+ in most countries), find your local election office, fill an application with ID and address proof, submit before the deadline, and receive your voter ID card.`;
}

function getVotingProcess() {
    return `Before Election Day: Register and find your polling station. On Election Day: Show ID, get your ballot, vote privately. After voting: Your vote is counted with others.`;
}

function getElectionTimeline() {
    return `Typical timeline: Announcement → Candidate nomination → Campaign period → Voter registration deadline (2-4 weeks before) → Early voting (if available) → Election Day → Counting → Results announced.`;
}

function getEligibilityCheck() {
    if (userAge === null) {
        return "Please tell me your age first.";
    } else if (userAge < 18) {
        return `You are ${userAge}. Minimum voting age is 18+ in most countries.`;
    } else {
        return `You are ${userAge} and eligible to vote in most countries.`;
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
    
    // Handle age input
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        processAge(message);
        return;
    }
    
    // Handle questions naturally
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election') || lowerMsg.includes('explain election')) {
        addMessage(getElectionExplanation());
    }
    else if (lowerMsg.includes('register') || lowerMsg.includes('registration') || lowerMsg.includes('how to register')) {
        addMessage(getRegistrationGuide());
    }
    else if (lowerMsg.includes('voting process') || lowerMsg.includes('how to vote') || lowerMsg.includes('casting vote')) {
        addMessage(getVotingProcess());
    }
    else if (lowerMsg.includes('timeline') || lowerMsg.includes('election timeline') || lowerMsg.includes('when')) {
        addMessage(getElectionTimeline());
    }
    else if (lowerMsg.includes('eligible') || lowerMsg.includes('eligibility') || lowerMsg.includes('can i vote') || lowerMsg.includes('am i eligible')) {
        addMessage(getEligibilityCheck());
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        addMessage("Hello! How can I help you with elections today?");
    }
    else {
        addMessage(`I can help with election-related questions. Feel free to ask about the voting process, eligibility, registration, or election timelines.`);
    }
}
