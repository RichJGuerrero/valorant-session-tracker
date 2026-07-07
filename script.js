const agentInput = document.getElementById("agentInput");
const mapInput = document.getElementById("mapInput");
const rrChangeInput = document.getElementById("rrChangeInput");
const killsInput = document.getElementById("killsInput");
const deathsInput = document.getElementById("deathsInput");
const assistsInput = document.getElementById("assistsInput");
const saveMatchButton = document.getElementById("saveMatchButton");
const startSessionButton = document.getElementById("startSessionButton");
const endSessionButton = document.getElementById("endSessionButton");
const winRadio = document.getElementById("winRadio");
const lossRadio = document.getElementById("lossRadio");
const netRR = document.getElementById("netRR");
const acsInput = document.getElementById("acsInput");
const sessionSummary = document.getElementById("sessionSummary");
const sessionStatus = document.getElementById("sessionStatus");
const matchHistoryList = document.getElementById("matchHistoryList");

let sessions = [];
let activeSessionId = null;
let editingMatchIndex = null;
let editingSessionIndex = null;

const savedSessions = localStorage.getItem("sessions");

if (savedSessions !== null) {
    sessions = JSON.parse(savedSessions);
}

const savedActiveSessionId = localStorage.getItem("activeSessionId");

if (savedActiveSessionId !== null) {
    activeSessionId = parseInt(savedActiveSessionId);
    sessionStatus.textContent = "Session Active";
    startSessionButton.disabled = true;
    endSessionButton.disabled = false;
}

saveMatchButton.addEventListener("click", function() {
    console.log("Save clicked:", editingSessionIndex, editingMatchIndex);

    if (activeSessionId === null && editingMatchIndex === null && editingSessionIndex === null) {
        sessionStatus.textContent = "No active session. Please start a session.";
        return;
    }

    let result = "";

    if (winRadio.checked) {
        result = "Win";
    } else {
        result = "Loss";
    }


    const match = {
        agent: agentInput.value,
        map: mapInput.value,
        result: result,
        rrChange: rrChangeInput.value,
        acs: acsInput.value,
        kills: killsInput.value,
        deaths: deathsInput.value,
        assists: assistsInput.value
    }
    
    if (editingSessionIndex !== null && editingMatchIndex !== null) {
        console.log("Updating:", editingSessionIndex, editingMatchIndex, match);
        sessions[editingSessionIndex].matches[editingMatchIndex] = match;

         editingSessionIndex = null;
         editingMatchIndex = null;

        saveMatchButton.textContent = "Save Match";
     } else {
        for (let index = 0; index < sessions.length; index++) {
            const currentSession = sessions[index];

             if (currentSession.id === activeSessionId) {
                currentSession.matches.push(match);
                break;
            }
        }
    }

    localStorage.setItem("sessions", JSON.stringify(sessions));

    renderMatches();

    agentInput.value = "";
    mapInput.value = "";
    rrChangeInput.value = "";
    acsInput.value = "";
    killsInput.value = "";
    deathsInput.value = "";
    assistsInput.value = "";

    winRadio.checked = false;
    lossRadio.checked = false;
});

function renderMatches() {
    matchHistoryList.innerHTML = "";

    let totalRR = 0;
    let wins = 0;
    let losses = 0;

    for (let sessionIndex = sessions.length - 1; sessionIndex >= 0; sessionIndex--) {
        const currentSession = sessions[sessionIndex];

        const sessionItem = document.createElement("li");

        const deleteSessionButton = document.createElement("button");

        const sessionNoteInput = document.createElement("textArea");
        sessionNoteInput.value = currentSession.notes || "";
        sessionNoteInput.placeholder = "Session notes...";

        const saveNoteButton = document.createElement("button");
        saveNoteButton.textContent = "Save Note";

        const deleteNoteButton = document.createElement("button");
        deleteNoteButton.textContent = "Delete Note";

        deleteSessionButton.textContent = "Delete Session";

        saveNoteButton.addEventListener("click", function() {
            if (sessionNoteInput === "") {
                return;
            }

            currentSession.notes = sessionNoteInput.value;

            localStorage.setItem("sessions", JSON.stringify(sessions));

            renderMatches();
        });

        deleteNoteButton.addEventListener("click", function() {
            const confirmed = confirm("Delete this note?");

            if (confirmed === false) {
                return;
            }

            currentSession.notes = "";

            localStorage.setItem("sessions", JSON.stringify(sessions))

            renderMatches();
        });

        deleteSessionButton.addEventListener("click", function() {
            const confirmed = confirm("Delete this session?");

            if (confirmed === false) {
                return;
            }

            sessions.splice(sessionIndex, 1);

            if (currentSession.id === activeSessionId) {

                activeSessionId = null;

                localStorage.removeItem("activeSessionId");

                sessionStatus.textContent = "No Active Session";

                startSessionButton.disabled = false;
                endSessionButton.disabled = true;
            }

            localStorage.setItem("sessions", JSON.stringify(sessions));

            renderMatches();

        });


        let sessionRR = 0;
        let sessionWins = 0;
        let sessionLosses = 0;
        let sessionKills = 0;
        let sessionACS = 0;
        let sessionDeaths = 0;
        let sessionAssists = 0;

        const sessionMatchList = document.createElement("ul");

        for (let matchIndex = 0; matchIndex < currentSession.matches.length; matchIndex++) {
            const match = currentSession.matches[matchIndex];

            sessionRR = sessionRR + parseInt(match.rrChange);
            sessionACS = sessionACS + parseInt(match.acs) || 0;
            sessionKills = sessionKills + parseInt(match.kills);
            sessionDeaths = sessionDeaths + parseInt(match.deaths);
            sessionAssists = sessionAssists + parseInt(match.assists);

            if (match.result === "Win") {
                sessionWins++;
            } else if (match.result === "Loss") {
                sessionLosses++;
            }


        if (currentSession.id === activeSessionId) {
            totalRR = totalRR + parseInt(match.rrChange);


            if (match.result === "Win") {
                wins++;
            } else if (match.result === "Loss") {
                losses++;
            }
        }


            const newMatch = document.createElement("li");

            newMatch.textContent =
                match.agent + " | " +
                match.map + " | " +
                match.result + " | " +
                match.rrChange + " RR | " +
                match.kills + "/" +
                match.deaths + "/" +
                match.assists;

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            const editButton = document.createElement("button");

            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {

                editingMatchIndex = matchIndex;
                editingSessionIndex = sessionIndex;

                agentInput.value = match.agent;
                mapInput.value = match.map;
                rrChangeInput.value = match.rrChange;
                killsInput.value = match.kills;
                deathsInput.value = match.deaths;
                assistsInput.value = match.assists;

                if (match.result === "Win") {
                    winRadio.checked = true;
                } else if (match.result === "loss") {
                    lossRadio.checked = true;
                }

                saveMatchButton.textContent = "Update Match";
            })

            deleteButton.addEventListener("click", function() {
                const confirmed = confirm("Delete This Match?");

                if (confirmed === false) {
                    return;
                }

                currentSession.matches.splice(matchIndex, 1);

            if (currentSession.matches.length === 0) {
                sessions.splice(sessionIndex, 1);

                if (currentSession.id === activeSessionId) {
                    activeSessionId = null;
                    localStorage.removeItem("activeSessionId");
                    sessionStatus.textContent = "No Active Session";
                    startSessionButton.disabled = false;
                    endSessionButton.disabled = true;
            }
        }

                localStorage.setItem("sessions", JSON.stringify(sessions));

                renderMatches();
            });

            newMatch.appendChild(editButton);
            newMatch.appendChild(deleteButton);

            sessionMatchList.appendChild(newMatch);

        }

        const sessionTotalGames = sessionWins + sessionLosses;

        let sessionWinRate = 0;

        let averageKills = 0;
        let averageDeaths = 0;
        let averageAssists = 0;
        let sessionKD = 0;
        let averageRR = 0;
        let averageACS = 0;

        if (sessionTotalGames > 0) {
            sessionWinRate = (sessionWins / sessionTotalGames) * 100;

            averageKills = sessionKills / sessionTotalGames;
            averageDeaths = sessionDeaths / sessionTotalGames;
            averageAssists = sessionAssists / sessionTotalGames;
            averageRR = sessionRR / sessionTotalGames;
            averageACS = sessionACS / sessionTotalGames;

            if (sessionDeaths > 0) {
                sessionKD = sessionKills / sessionDeaths;
            }
        }

        sessionItem.textContent = 
            "Session | Net RR: " + sessionRR +
            " | Average RR: " + averageRR.toFixed(1) +
            " | Average ACS: " + averageACS.toFixed(1) +
            " | Wins: " + sessionWins +
            " | Losses: " + sessionLosses +
            " | Win Rate: " + sessionWinRate.toFixed(1) + "%" +
            " | K/D: " + sessionKD.toFixed(2) +
            " | Avg Kills: " + averageKills.toFixed(1) + "/" +
            " | Avg Deaths: " + averageDeaths.toFixed(1) + "/" +
            " | Avg Assists: " + averageAssists.toFixed(1)

        sessionItem.appendChild(deleteSessionButton);

        sessionItem.appendChild(sessionNoteInput);

        sessionItem.appendChild(saveNoteButton);

        sessionItem.appendChild(deleteNoteButton);

        sessionItem.appendChild(sessionMatchList);

         matchHistoryList.appendChild(sessionItem);
    }

    const totalGames = wins + losses;

    let winRate = 0;

    if (totalGames > 0) {
     winRate = (wins / totalGames) * 100;
    }

    sessionSummary.textContent =
        "Wins: " + wins +
        " | Losses: " + losses +
        " | Win Rate: " + winRate.toFixed(1) + "%";

    netRR.textContent = "Net RR: " + totalRR;

    " | Avg ACS: " + averageACS.toFixed(1);
}

startSessionButton.addEventListener("click", function() {
    const newSession = {
        id: sessions.length + 1,
        startedAt: new Date().toISOString(),
        endedAt: null,
        notes: "",
        matches: []
    };

    sessions.push(newSession);

    activeSessionId = newSession.id;

    localStorage.setItem("activeSessionId", activeSessionId)

    sessionStatus.textContent = "Session Active";

    startSessionButton.disabled = true;
    endSessionButton.disabled = false;
});

endSessionButton.addEventListener("click", function () {
    for (let index = 0; index < sessions.length; index++) {
        const currentSession = sessions[index];

        if (currentSession.id === activeSessionId) {

            if (currentSession.matches.length === 0) {
                    sessions.splice(index, 1);
                } else {
                    currentSession.endedAt = new Date().toISOString();

                };

                if (currentSession.id === activeSessionId) {
                    activeSessionId = null;

                    localStorage.removeItem("activeSessionId");

                    sessionStatus.textContent = "No Active Session";

                    startSessionButton.disabled = false;
                    endSessionButton.disabled = true;
                }
            break;
        };
    };

    activeSessionId = null;

    localStorage.removeItem("activeSessionId");

    localStorage.setItem("sessions", JSON.stringify(sessions));

    sessionStatus.textContent = "No Active Session";

    startSessionButton.disabled = false;
    endSessionButton.disabled = true;

    renderMatches();
});

renderMatches();