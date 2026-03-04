const board = document.getElementById("board");
const statusText = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const pvpButton = document.getElementById("pvp");
const aiButton = document.getElementById("ai");
const backButton = document.getElementById("back");
const difficultyBox = document.getElementById("difficultyBox");
const difficultyButtons = document.querySelectorAll(".difficulty");

const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");

let boardState, cells, currentPlayer;
let vsAI = false;
let difficulty = "hard";
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

/* ===== SCREEN FLOW ===== */

pvpButton.onclick = () => startGame(false);
aiButton.onclick = () => difficultyBox.classList.remove("hidden");

difficultyButtons.forEach(btn => {
    btn.onclick = () => {
        difficulty = btn.dataset.level;
        startGame(true);
    };
});

backButton.onclick = () => {
    clearTimeout(restartTimeout);
    gameActive = false;
    gameScreen.classList.add("hidden");
    modeScreen.classList.remove("hidden");
    difficultyBox.classList.add("hidden");
};

function startGame(aiMode) {
    vsAI = aiMode;
    modeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    initializeBoard();
}

/* ===== GAME LOGIC ===== */

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
        cell.onclick = () => handleClick(i);
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
        setTimeout(aiMove, 400);
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

/* ===== AI LOGIC ===== */

function aiMove() {
    if (!gameActive) return;

    let move;

    if (difficulty === "easy") {
        move = getRandomMove();
    } 
    else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } 
    else {
        move = getBestMove();
    }

    makeMove(move, AI);
    cells[move].classList.add("ai-move");

    checkGameEnd();
}

function getRandomMove() {
    let empty = boardState
        .map((v,i) => v === "" ? i : null)
        .filter(v => v !== null);

    return empty[Math.floor(Math.random() * empty.length)];
}

/* ===== WIN CHECK ===== */

function checkWinner(state) {
    for (let condition of winConditions) {
        const [a,b,c] = condition;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return { winner: state[a], combo: condition };
        }
    }
    if (!state.includes("")) return { winner: "draw" };
    return null;
}

function checkGameEnd() {
    let result = checkWinner(boardState);
    if (!result) {
        if (!vsAI) switchPlayer();
        return false;
    }

    gameActive = false;

    if (result.winner !== "draw") {
        scores[result.winner]++;
        updateScores();
        statusText.textContent = result.winner === HUMAN ? "You win!" : "Computer wins!";
        highlightWin(result.combo);
    } else {
        statusText.textContent = "Draw!";
    }

    scheduleRestart();
    return true;
}

function highlightWin(combo) {
    combo.forEach(i => cells[i].classList.add("winner"));
}

function scheduleRestart() {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(initializeBoard, 1800);
}

function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

/* ===== ALPHA-BETA MINIMAX ===== */

function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = AI;
            let score = minimax(boardState, 0, false, -Infinity, Infinity);
            boardState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(state, depth, isMax, alpha, beta) {
    let result = checkWinner(state);
    if (result) {
        if (result.winner === AI) return 10 - depth;
        if (result.winner === HUMAN) return depth - 10;
        return 0;
    }

    if (isMax) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = AI;
                let evalScore = minimax(state, depth+1, false, alpha, beta);
                state[i] = "";
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = HUMAN;
                let evalScore = minimax(state, depth+1, true, alpha, beta);
                state[i] = "";
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}
