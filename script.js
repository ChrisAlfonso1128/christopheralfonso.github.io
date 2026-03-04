const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let gameActive = true;
let cells = [];

const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function createBoard() {
    board.innerHTML = "";
    cells = [];

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleClick(i));
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleClick(index) {
    if (!gameActive || cells[index].textContent !== "") return;

    cells[index].textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (cells.every(cell => cell.textContent !== "")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winConditions.some(condition =>
        condition.every(index =>
            cells[index].textContent === currentPlayer
        )
    );
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
    createBoard();
}

restartButton.addEventListener("click", restartGame);

createBoard();
