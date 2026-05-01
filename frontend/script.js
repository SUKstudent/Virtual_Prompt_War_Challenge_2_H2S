// Function to add message to chat
function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.innerHTML = text;
    document.getElementById("chatArea").appendChild(div);
    document.getElementById("chatArea").scrollTop = 99999;
}

// Send message function
function send() {
    const input = document.getElementById("input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    
    // Sanitize input (Security)
    const sanitizedText = text.replace(/[<>]/g, '');
    
    // Save progress if user is signed in
    if(window.currentUser && window.saveProgressToFirebase) {
        window.saveProgressToFirebase(sanitizedText.substring(0, 50));
    } else {
        // Local progress for non-signed users
        updateLocalProgress();
    }

    setTimeout(() => {
        addMessage("🗳️ CivicAssist: " + generateResponse(sanitizedText), "bot");
    }, 400);

    input.value = "";
}

// Quick ask function
function ask(q) {
    document.getElementById("input").value = q;
    send();
}

// Generate intelligent responses
function generateResponse(msg) {
    msg = msg.toLowerCase();
    
    // Election questions
    if(msg.includes("election") && msg.includes("what")) {
        return "Elections are a democratic process where citizens choose their representatives. 📝 They happen at local, state, and national levels.";
    }
    if(msg.includes("vote") && msg.includes("how")) {
        return "To vote: 1️⃣ Register with election commission 2️⃣ Find polling station 3️⃣ Bring ID 4️⃣ Cast your vote on election day 🗳️";
    }
    if(msg.includes("register")) {
        return "You can register online through Election Commission website, offline at voter registration centers, or via mobile app. 📱 Need your ID proof and address proof.";
    }
    if(msg.includes("eligibility")) {
        return "Voter eligibility: ✅ Must be 18+ years ✅ Citizen of the country ✅ Valid ID proof ✅ Registered to vote.";
    }
    if(msg.includes("timeline")) {
        return "📅 Election timeline: 1. Announcement 2. Nomination filing 3. Campaigning 4. Voting 5. Counting 6. Results declaration.";
    }
    if(msg.includes("blockchain")) {
        return "Blockchain voting is an emerging technology that uses cryptographic security to ensure vote integrity, transparency and prevent tampering. 🔗";
    }
    if(msg.includes("pm") || msg.includes("prime minister")) {
        return "Prime Minister is the head of government, elected through parliamentary majority after general elections. 🏛️";
    }
    if(msg.includes("president")) {
        return "President is the constitutional head of state, elected by an electoral college. 🎓";
    }
    if(msg.includes("democracy")) {
        return "Democracy means 'rule by people'. Citizens have the right to choose leaders through free and fair elections. 🗽";
    }
    if(msg.includes("voter id")) {
        return "Voter ID is an official identification document issued by Election Commission. Apply online or offline. 🆔";
    }
    if(msg.includes("thank")) {
        return "You're welcome! 🎉 Keep learning about democracy and exercise your right to vote! 🗳️";
    }
    
    // Default response
    return "I can help with: 📌 Elections basics, 📌 Voting process, 📌 Registration, 📌 Eligibility, 📌 Timeline, 📌 Democracy, 📌 Voter ID. What would you like to know?";
}

// Local progress for non-signed users
let localPoints = parseInt(localStorage.getItem('civicPoints') || '0');

function updateLocalProgress() {
    localPoints += 5;
    localStorage.setItem('civicPoints', localPoints);
    const progressPercent = Math.min(localPoints, 100);
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    if(fill && !window.currentUser) {
        fill.style.width = progressPercent + '%';
    }
    if(text && !window.currentUser) {
        text.innerText = progressPercent + '% Complete • Local Progress';
    }
}

// Load local progress on page load
function loadLocalProgress() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    if(fill && !window.currentUser) {
        fill.style.width = Math.min(localPoints, 100) + '%';
    }
    if(text && !window.currentUser) {
        text.innerText = Math.min(localPoints, 100) + '% Complete • Local Progress';
    }
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    if(input) {
        input.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                send();
            }
        });
    }
    loadLocalProgress();
});
