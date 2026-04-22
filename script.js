let userAge = null;
let userIntent = null;

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
    // Google Forms integration for feedback
    // Replace with your actual Google Forms URL
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfdummyformlink/viewform?usp=pp_url', '_blank');
    addMessage("📝 Thank you for considering feedback! Your input helps make CivicAssist better for everyone. (Google Forms will open in a new tab)");
}

function processAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        addMessage("Please enter a valid number for your age. 📝 <strong>What's your age?</strong>");
        return false;
    }
    
    userAge = ageNum;
    
    if (userAge < 18) {
        addMessage(`👋 Thank you for sharing! You are ${userAge} years old.<br><br>
        🌟 **Eligibility Guidance**: In most countries, the minimum voting age is 18 years. While you cannot vote yet, you can still:<br>
        • Learn about the election process<br>
        • Encourage eligible family members to vote<br>
        • Participate in school/college elections<br>
        • Stay informed for when you become eligible!<br><br>
        Would you like to continue learning about how elections work? Just ask me anything!`);
    } else {
        addMessage(`✅ Great! You are ${userAge} years old and <strong>eligible to vote</strong> in most countries.<br><br>
        Let me guide you through the election process. What would you like to know?<br><br>
        You can ask about:<br>
        • What elections are<br>
        • Voter registration process<br>
        • Step-by-step voting guide<br>
        • Election timelines`);
    }
    return true;
}

function getElectionExplanation() {
    return `📖 <strong>What are Elections?</strong><br><br>
    Elections are a formal process where citizens choose their representatives or decide on important issues. They are the foundation of democracy.<br><br>
    <strong>Key points:</strong><br>
    • People vote for leaders who will represent them<br>
    • Elections can be for local, regional, or national positions<br>
    • Voting is usually done by secret ballot to ensure privacy<br>
    • Regular elections ensure leaders are accountable to citizens<br><br>
    Would you like to know about voter eligibility or registration next?`;
}

function getRegistrationGuide() {
    return `📝 <strong>How Voter Registration Works</strong><br><br>
    <strong>Step-by-step registration process:</strong><br>
    • <strong>Check eligibility:</strong> Age 18+ (in most countries), citizen, resident<br>
    • <strong>Find registration office:</strong> Usually local election commission or government office<br>
    • <strong>Fill application:</strong> Provide identification and address proof<br>
    • <strong>Submit before deadline:</strong> Registration closes weeks before election day<br>
    • <strong>Receive voter ID card:</strong> Proof that you're registered to vote<br><br>
    💡 <strong>Tip:</strong> Many countries now offer online registration! Ask me about the voting process next.`;
}

function getVotingProcess() {
    return `🗳️ <strong>Step-by-Step Voting Process</strong><br><br>
    <strong>How voting is carried out:</strong><br><br>
    <strong>1. Before Election Day:</strong><br>
    • Ensure you're registered to vote<br>
    • Find your assigned polling station<br>
    • Check what ID you need to bring<br><br>
    <strong>2. On Election Day:</strong><br>
    • Go to your polling station during voting hours<br>
    • Show your ID and voter registration card<br>
    • Receive your ballot paper<br>
    • Go to a private voting booth<br>
    • Mark your choice clearly<br>
    • Fold and deposit ballot in the sealed box<br><br>
    <strong>3. After Voting:</strong><br>
    • Get your finger marked (in many countries)<br>
    • Your vote is counted with others after polls close<br><br>
    Would you like to know about election timelines?`;
}

function getElectionTimeline() {
    return `📅 <strong>Basic Election Timeline</strong><br><br>
    A typical election follows this timeline:<br><br>
    • <strong>Announcement (Weeks/Months before):</strong> Election date announced<br>
    • <strong>Candidate nomination:</strong> Candidates register to run<br>
    • <strong>Campaign period:</strong> Candidates share their plans<br>
    • <strong>Voter registration deadline (2-4 weeks before):</strong> Last day to register<br>
    • <strong>Early voting (if available):</strong> Some places allow voting before election day<br>
    • <strong>Election Day:</strong> Citizens cast their votes<br>
    • <strong>Counting period (Hours/Days after):</strong> Votes are counted<br>
    • <strong>Results announced:</strong> Winners declared<br><br>
    Timelines vary by country. Would you like more details on any step?`;
}

function getEligibilityCheck() {
    if (userAge === null) {
        return "📝 To check eligibility, please tell me <strong>your age first</strong>. How old are you?";
    } else if (userAge < 18) {
        return `👤 Based on your age (${userAge} years):<br><br>
        <strong>Eligibility Status:</strong> Not yet eligible to vote<br>
        <strong>Minimum voting age:</strong> 18 years (in most countries)<br>
        <strong>What you can do now:</strong> Learn about elections and encourage others to vote!`;
    } else {
        return `✅ <strong>You are eligible to vote!</strong><br><br>
        Based on your age (${userAge} years):<br>
        • You meet the minimum age requirement (18+ in most countries)<br>
        • Next steps: Ensure you're registered to vote<br>
        • Check your local election office for specific requirements<br><br>
        Would you like me to explain the registration process?`;
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
    
    // Handle age input (if user hasn't provided age yet)
    if (userAge === null && !isNaN(parseInt(message)) && message.match(/^\d+$/)) {
        processAge(message);
        return;
    }
    
    // Handle different user intents
    if (lowerMsg.includes('what are elections') || lowerMsg.includes('what is election') || lowerMsg.includes('explain election')) {
        addMessage(getElectionExplanation());
    }
    else if (lowerMsg.includes('register') || lowerMsg.includes('registration') || lowerMsg.includes('how to register')) {
        addMessage(getRegistrationGuide());
    }
    else if (lowerMsg.includes('voting process') || lowerMsg.includes('how to vote') || lowerMsg.includes('casting vote') || lowerMsg.includes('step by step')) {
        addMessage(getVotingProcess());
    }
    else if (lowerMsg.includes('timeline') || lowerMsg.includes('election timeline') || lowerMsg.includes('when') || lowerMsg.includes('schedule')) {
        addMessage(getElectionTimeline());
    }
    else if (lowerMsg.includes('eligible') || lowerMsg.includes('eligibility') || lowerMsg.includes('can i vote') || lowerMsg.includes('am i eligible')) {
        addMessage(getEligibilityCheck());
    }
    else if (lowerMsg.includes('age')) {
        if (userAge !== null) {
            addMessage(`You mentioned you are ${userAge} years old. ${userAge >= 18 ? 'You are eligible to vote!' : 'You will be eligible when you turn 18.'}`);
        } else {
            addMessage("Please tell me your age so I can help check eligibility. 📝 <strong>What's your age?</strong>");
        }
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        addMessage("Hello! 👋 I'm CivicAssist. I'm here to help you understand elections. You can ask me about eligibility, registration, voting process, or election timelines. What would you like to know?");
    }
    else if (lowerMsg.includes('thank')) {
        addMessage("You're very welcome! 🗳️ Civic education is important. Feel free to ask more questions or share feedback using the link below!");
    }
    else {
        addMessage(`🤔 I want to help you understand elections better. Could you please ask me about:<br><br>
        • What elections are<br>
        • Voter eligibility (age requirements)<br>
        • Registration process<br>
        • How voting works step by step<br>
        • Election timelines<br><br>
        Or just tell me your age to check eligibility!`);
    }
}
