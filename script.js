const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const pvpButton = document.getElementById("pvp");
const aiButton = document.getElementById("ai");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameActive = false;
let cells = [];
let boardState = Array(9).fill("");
let vsAI = false;
let scores = { X: 0, O: 0 };

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function createBoard() {
    board.innerHTML = "";
    cells = [];
    boardState = Array(9).fill("");

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
    let emptyIndexes = boardState
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    makeMove(randomIndex, "O");

    if (checkGameEnd()) return;

    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
}

function checkGameEnd() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {

            statusText.textContent = `Player ${boardState[a]} wins!`;
            scores[boardState[a]]++;
            scoreX.textContent = scores.X;
            scoreO.textContent = scores.O;
            gameActive = false;
            return true;
        }
    }

    if (!boardState.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
}

pvpButton.addEventListener("click", () => {
    vsAI = false;
    restartGame();
});

aiButton.addEventListener("click", () => {
    vsAI = true;
    restartGame();
});

restartButton.addEventListener("click", restartGame);

createBoard();
