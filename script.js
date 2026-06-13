const agentInput = document.getElementById("agentInput");
const mapInput = document.getElementById("mapInput");
const rrChangeInput = document.getElementById("rrChangeInput");
const killsInput = document.getElementById("killsInput");
const deathsInput = document.getElementById("deathsInput");
const assistsInput = document.getElementById("assistsInput");
const saveMatchButton = document.getElementById("saveMatchButton");
const winRadio = document.getElementById("winRadio");
const lossRadio = document.getElementById("lossRadio");

let matchHistory = [];

saveMatchButton.addEventListener("click", function() {
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
        kills: killsInput.value,
        deaths: deathsInput.value,
        assists: assistsInput.value
    }
    matchHistory.push(match);
    renderMatches();
});

function renderMatches() {
    matchHistoryList.innerHTML = "";

    for (const match of matchHistory) {
        const newMatch = document.createElement("li");

        newMatch.textContent = 
            match.agent + " | " +
            match.map + " | " +
            match.result + " | " +
            match.rrChange + " RR | " +
            match.kills + "/" +
            match.deaths + "/" +
            match.assists;

        matchHistoryList.appendChild(newMatch);
    }
}