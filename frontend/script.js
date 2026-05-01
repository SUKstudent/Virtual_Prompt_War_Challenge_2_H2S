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

    setTimeout(() => {
        addMessage("🗳️ CivicAssist: " + generateResponse(text), "bot");
    }, 400);

    input.value = "";
}

function ask(q) {
    document.getElementById("input").value = q;
    send();
}

function generateResponse(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("election"))
        return "Elections are a democratic process where citizens choose leaders.";

    if (msg.includes("vote"))
        return "Voting is the process of selecting a candidate in elections.";

    if (msg.includes("register"))
        return "You must register with your local election authority before voting.";

    if (msg.includes("eligibility"))
        return "In most countries, voting age is 18 years.";

    if (msg.includes("blockchain"))
        return "Blockchain voting uses secure digital ledger to prevent tampering.";

    if (msg.includes("timeline"))
        return "Election timeline includes registration → campaigning → voting → counting → results.";

    return "Ask me about elections, voting, registration or democracy.";
}
