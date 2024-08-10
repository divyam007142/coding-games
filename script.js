const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('.status');
const resetButton = document.querySelector('.reset-button');
const startButtons = document.querySelectorAll('.start-button');
const gameContainer = document.querySelector('.game-container');
const menuContainer = document.querySelector('.menu-container');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = ''; // 'multiplayer' or 'computer'
const gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (gameState[cellIndex] !== '' || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkForWin()) {
        statusDisplay.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        statusDisplay.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    if (gameMode === 'computer' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(computerPlay, 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
};

const computerPlay = () => {
    if (!gameActive || currentPlayer !== 'O') return;

    let availableCells = gameState.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    if (availableCells.length === 0) return;

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    if (checkForWin()) {
        statusDisplay.textContent = 'Computer Wins!';
        gameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        statusDisplay.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
};

const checkForWin = () => {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
};

const handleResetGame = () => {
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    gameState.fill('');
    cells.forEach(cell => cell.textContent = '');
};

const handleStartGame = (event) => {
    gameMode = event.target.getAttribute('data-mode');
    menuContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    handleResetGame();
};

startButtons.forEach(button => button.addEventListener('click', handleStartGame));
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);
