const board = document.getElementById("board");
const statusText = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const pvpButton = document.getElementById("pvp");
const aiButton = document.getElementById("ai");
const backButton = document.getElementById("back");

const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");

let currentPlayer;
let boardState;
let cells;
let vsAI = false;
let gameActive = false;
let scores = { X: 0, O: 0 };
let restartTimeout = null;

const HUMAN = "X";
const AI = "O";

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function startGame(isAI) {
    vsAI = isAI;
    modeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    initializeBoard();
}

function initializeBoard() {
    board.innerHTML = "";
    boardState = Array(9).fill("");
    cells = [];
    currentPlayer = HUMAN;
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

    makeMove(index, HUMAN);

    if (checkGameEnd()) return;

    if (vsAI) {
        statusText.textContent = "Computer thinking...";
        setTimeout(() => {
            let bestMove = getBestMove();
            makeMove(bestMove, AI);
            checkGameEnd();
        }, 300);
    } else {
        switchPlayer();
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
}

function switchPlayer() {
    currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(state) {
    for (let [a,b,c] of winConditions) {
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];
        }
    }
    if (!state.includes("")) return "draw";
    return null;
}

function checkGameEnd() {
    let result = checkWinner(boardState);

    if (result === HUMAN || result === AI) {
        gameActive = false;
        scores[result]++;
        updateScores();
        statusText.textContent = result === HUMAN ? "You win!" : "Computer wins!";
        scheduleRestart();
        return true;
    }

    if (result === "draw") {
        gameActive = false;
        statusText.textContent = "Draw!";
        scheduleRestart();
        return true;
    }

    if (!vsAI) switchPlayer();
    return false;
}

function scheduleRestart() {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(() => {
        initializeBoard();
    }, 1500);
}

function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

/* ========================= */
/* ===== MINIMAX AI ======== */
/* ========================= */

function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = AI;
            let score = minimax(boardState, 0, false);
            boardState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(state, depth, isMaximizing) {
    let result = checkWinner(state);

    if (result !== null) {
        if (result === AI) return 10 - depth;
        if (result === HUMAN) return depth - 10;
        if (result === "draw") return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = AI;
                let score = minimax(state, depth + 1, false);
                state[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = HUMAN;
                let score = minimax(state, depth + 1, true);
                state[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

pvpButton.addEventListener("click", () => startGame(false));
aiButton.addEventListener("click", () => startGame(true));

backButton.addEventListener("click", () => {
    clearTimeout(restartTimeout);
    gameActive = false;
    gameScreen.classList.add("hidden");
    modeScreen.classList.remove("hidden");
});
