const agentInput = document.getElementById("agentInput");
const mapInput = document.getElementById("mapInput");
const rrChangeInput = document.getElementById("rrChangeInput");
const killsInput = document.getElementById("killsInput");
const deathsInput = document.getElementById("deathsInput");
const assistsInput = document.getElementById("assistsInput");
const saveMatchButton = document.getElementById("saveMatchButton");
const winRadio = document.getElementById("winRadio");
const lossRadio = document.getElementById("lossRadio");
const netRR = document.getElementById("netRR");

const savedMatchHistory = localStorage.getItem("matchHistory");

let matchHistory = [];

if (savedMatchHistory !== null) {
    matchHistory = JSON.parse(savedMatchHistory);
}

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
    localStorage.setItem("matchHistory", JSON.stringify(matchHistory));
    renderMatches();

    agentInput.value = "";
    mapInput.value = "";
    rrChangeInput.value = "";
    killsInput.value = "";
    deathsInput.value = "";
    assistsInput.value = "";

    winRadio.checked = false;
    lossRadio.checked=false;
});

function renderMatches() {
    matchHistoryList.innerHTML = "";

    let totalRR = 0;

    for (let index = 0; index < matchHistory.length; index++) {
        const match = matchHistory[index];

        totalRR = totalRR + parseInt(match.rrChange);

        const newMatch = document.createElement("li");

        newMatch.textContent = 
            match.agent + " | " +
            match.map + " | " +
            match.result + " | " +
            match.rrChange + " RR | " +
            match.kills + "/" +
            match.deaths + "/" +
            match.assists;

            const deleteButton = document.createElement("button")

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                matchHistory.splice(index, 1);

                localStorage.setItem("matchHistory", JSON.stringify(matchHistory));

                renderMatches();
            });

            newMatch.appendChild(deleteButton);

            matchHistoryList.appendChild(newMatch);
    }

    netRR.textContent = "Net RR: " + totalRR;
}

renderMatches();