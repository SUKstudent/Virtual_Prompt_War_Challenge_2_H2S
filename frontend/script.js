function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.innerHTML = text;
    document.getElementById("chatArea").appendChild(div);
    document.getElementById("chatArea").scrollTop = 99999;
}

function send() {
    const input = document.getElementById("input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    const sanitizedText = text.replace(/[<>]/g, '');
    
    if(window.currentUser && window.saveProgressToFirebase) {
        window.saveProgressToFirebase(sanitizedText.substring(0, 50));
    } else {
        updateLocalProgress();
    }

    setTimeout(() => {
        addMessage("🗳️ CivicAssist: " + generateResponse(sanitizedText), "bot");
    }, 400);

    input.value = "";
}

function ask(q) {
    document.getElementById("input").value = q;
    send();
}

function generateResponse(msg) {
    msg = msg.toLowerCase();
    
    // Original questions
    if(msg.includes("election") && msg.includes("what")) {
        return "Elections are a democratic process where citizens choose their representatives. 📝 They happen at local, state, and national levels. This happens across all 7 continents!";
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
    
    // New questions - 7 Continents
    if(msg.includes("7 continents") || msg.includes("continents")) {
        return "🌍 Elections happen across all 7 continents! North America, South America, Europe, Asia, Africa, Australia, Antarctica. Each has different systems but all value democracy!";
    }
    if(msg.includes("asia governments")) {
        return "🌏 Asia has diverse governments: India (world's largest democracy), China (single-party), Japan (constitutional monarchy), South Korea (presidential republic). Elections vary by country!";
    }
    if(msg.includes("blockchain")) {
        return "Blockchain voting uses cryptographic security to ensure vote integrity, transparency and prevent tampering. 🔗 Being tested in some countries!";
    }
    
    // More continents info
    if(msg.includes("europe")) {
        return "🇪🇺 European countries mostly have parliamentary democracies. EU Parliament elections happen every 5 years!";
    }
    if(msg.includes("africa")) {
        return "🌍 Africa has 54 countries with various election systems. Many are strengthening their democratic processes!";
    }
    if(msg.includes("america")) {
        return "🗽 Americas include USA (presidential system), Canada (parliamentary), Brazil (federal republic). Each has unique voting processes!";
    }
    
    // Democracy and general
    if(msg.includes("democracy")) {
        return "Democracy means 'rule by people'. Citizens have the right to choose leaders through free and fair elections. 🗽";
    }
    if(msg.includes("voter id")) {
        return "Voter ID is an official identification document issued by Election Commission. Apply online or offline. 🆔";
    }
    if(msg.includes("thank")) {
        return "You're welcome! 🎉 Keep learning about democracy and exercise your right to vote! 🗳️";
    }
    
    return "I can help with: 📌 Elections basics, 📌 Voting process, 📌 Registration, 📌 Eligibility, 📌 Timeline, 📌 7 Continents, 📌 Asia governments, 📌 Blockchain voting. What would you like to know?";
}

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
