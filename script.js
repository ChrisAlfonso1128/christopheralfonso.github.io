const board = document.getElementById("board");
const statusText = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const pvpButton = document.getElementById("pvp");
const aiButton = document.getElementById("ai");
const backButton = document.getElementById("back");

const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");

let currentPlayer = "X";
let boardState = Array(9).fill("");
let cells = [];
let vsAI = false;
let gameActive = false;
let scores = { X: 0, O: 0 };

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function startGame(modeAI) {
    vsAI = modeAI;
    modeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    resetBoard();
}

function resetBoard() {
    board.innerHTML = "";
    boardState = Array(9).fill("");
    cells = [];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleClick(i));
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleClick(index) {
    if (!gameActive || boardState[index] !== "") return;

    makeMove(index, currentPlayer);

    if (checkGameEnd()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (vsAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
}

function aiMove() {
    let empty = boardState
        .map((v,i) => v === "" ? i : null)
        .filter(v => v !== null);

    let randomIndex = empty[Math.floor(Math.random() * empty.length)];
    makeMove(randomIndex, "O");

    if (checkGameEnd()) return;

    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
}

function checkGameEnd() {
    for (let [a,b,c] of winConditions) {
        if (boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {

            gameActive = false;
            scores[boardState[a]]++;
            scoreX.textContent = scores.X;
            scoreO.textContent = scores.O;

            statusText.textContent = `Player ${boardState[a]} wins!`;

            setTimeout(resetBoard, 2000);
            return true;
        }
    }

    if (!boardState.includes("")) {
        gameActive = false;
        statusText.textContent = "Draw!";
        setTimeout(resetBoard, 2000);
        return true;
    }

    return false;
}

pvpButton.addEventListener("click", () => startGame(false));
aiButton.addEventListener("click", () => startGame(true));

backButton.addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    modeScreen.classList.remove("hidden");
});
