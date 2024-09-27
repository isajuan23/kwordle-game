// Word list (example, you can expand it)
const wordList = ["apple", "grape", "peach", "melon", "berry"];

// Game state initialization
let gameState = {
    gameGrid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
    hiddenWord: wordList[Math.floor(Math.random() * wordList.length)],
    score: 0,
    timeLeft: 120,
    timerInterval: null
};

// Initialize the game
function init() {
    createGameGrid();
    startTimer();
    document.body.onkeydown = handleKeyPress;
    document.getElementById('closeButton').addEventListener('click', hideMessageBox);
}

// Create game grid
function createGameGrid() {
    const gameContainer = document.getElementById('gameContainer');
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            const box = document.createElement('div');
            box.className = 'charBox';
            box.id = `charBox-${row}-${col}`;
            gameContainer.appendChild(box);
        }
    }
}

// Handle keyboard inputs
function handleKeyPress(event) {
    const key = event.key.toLowerCase();

    if (key === 'enter') {
        if (gameState.currentCol === 5) {
            const enteredWord = getEnteredWord();
            if (isWordValid(enteredWord)) {
                checkWord(enteredWord);
                if (gameState.currentRow === 5 || enteredWord === gameState.hiddenWord) {
                    showMessageBox(`Game Over! The correct word was: ${gameState.hiddenWord}`);
                } else {
                    gameState.currentRow++;
                    gameState.currentCol = 0;
                }
            } else {
                showMessageBox("Invalid word! Try again.");
            }
        }
    } else if (key === 'backspace') {
        if (gameState.currentCol > 0) {
            gameState.currentCol--;
            gameState.gameGrid[gameState.currentRow][gameState.currentCol] = '';
            updateGameGrid();
        }
    } else if (/^[a-z]$/.test(key) && gameState.currentCol < 5) {
        gameState.gameGrid[gameState.currentRow][gameState.currentCol] = key;
        gameState.currentCol++;
        updateGameGrid();
    }
}

// Validate entered word
function isWordValid(word) {
    return wordList.includes(word);
}

// Check entered word against the hidden word
function checkWord(enteredWord) {
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`charBox-${gameState.currentRow}-${i}`);
        const letter = enteredWord[i];
        if (letter === gameState.hiddenWord[i]) {
            box.classList.add('correct');
        } else if (gameState.hiddenWord.includes(letter)) {
            box.classList.add('contains');
        }
    }
}

// Get the entered word from the game grid
function getEnteredWord() {
    return gameState.gameGrid[gameState.currentRow].join('');
}

// Update the game grid visually
function updateGameGrid() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            const box = document.getElementById(`charBox-${row}-${col}`);
            box.textContent = gameState.gameGrid[row][col] || '';
        }
    }
}

// Display message box
function showMessageBox(message) {
    const messageBox = document.getElementById('messageBox');
    document.getElementById('messageText').textContent = message;
    messageBox.classList.remove('hidden');
}

// Hide message box
function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.classList.add('hidden');
}

// Start the game timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer').textContent = gameState.timeLeft + 's';
        if (gameState.timeLeft === 0) {
            showMessageBox(`Time's up! The correct word was: ${gameState.hiddenWord}`);
            clearInterval(gameState.timerInterval);
        }
    }, 1000);
}

// Start the game
init();
