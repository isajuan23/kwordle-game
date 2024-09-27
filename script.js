import { wordList } from './words.js';

// Function to show the message box with a given message
function showMessageBox(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
    messageBox.classList.add('show');
}

// Function to hide the message box
function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.classList.remove('show');
    setTimeout(() => {
        messageBox.classList.add('hidden');
        // Re-enable input after the message box is hidden
        document.body.onkeydown = keyboardpresses;
    }, 300);
}


// Add the event listener for the close button
document.getElementById('closeButton').addEventListener('click', hideMessageBox);

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

// Function to initialize the game
function init() {
    const gameContainer = document.getElementById('gameContainer');
    makeGameGrid(gameContainer);
    console.log(gameState.hiddenWord);
    startTimer();
    updateScoreBoard();
    updateGameGrid();

    document.body.onkeydown = keyboardpresses; // Attach keyboard presses only once
}


// Function to create the game grid
function makeGameGrid(gameContainer) {
    const gameGrid = document.createElement('div');
    gameGrid.className = 'gameGrid';

    for (let i = 0; i < 6; i++) {
        for (let o = 0; o < 5; o++) {
            makeBox(gameGrid, i, o);
        }
    }
    gameContainer.appendChild(gameGrid);
}

// Function to create individual boxes in the grid
function makeBox(gameGrid, row, col, letter = '') {
    const charBox = document.createElement('div');
    charBox.className = 'charBox';
    charBox.id = `charBox.${row}${col}`;
    charBox.textContent = letter;
    gameGrid.appendChild(charBox);
    return charBox;
}

// Function to handle keyboard inputs
function keyboardpresses(e) {
    let key = e.key;
    if (gameState.currentRow >= 6) return; // Prevent input if out of bounds

    if (key === 'Enter') {
        let word = getEnteredWord();
        if (isWordValid(word)) {
            checkLetters();
            checkTurn(word);
            gameState.currentRow++;
            gameState.currentCol = 0;
        } else {
            showMessageBox("The word is invalid", true); // Auto-hide message box
            // Clear the row for re-entry
            gameState.gameGrid[gameState.currentRow] = Array(5).fill('');
            gameState.currentCol = 0;
            updateGameGrid();
        }
    } else if (key === 'Backspace') {
        deleteLetter();
        updateGameGrid();
    } else if (isAlpha(key)) {
        addLetter(key.toUpperCase()); // Ensure all letters are added in uppercase
        updateGameGrid();
    }
}



// Function to check the game state after each turn
function checkTurn(enteredWord) {
    // Convert both words to lowercase before comparing
    let won = gameState.hiddenWord.toLowerCase() === enteredWord.toLowerCase();
    let gameOver = gameState.currentRow === 5;

    if (won) {
        gameState.score += 10;
        updateScoreBoard();
        showMessageBox('Good job! The correct word was: ' + gameState.hiddenWord.toUpperCase()); // Show the correct word
        resetGame();
    } else if (gameOver) {
        gameState.score = Math.max(0, gameState.score - 5);
        updateScoreBoard();
        showMessageBox('Game Over! The correct word was: ' + gameState.hiddenWord.toUpperCase()); // Show the correct word
        resetGame();
    }
}



// Function to check the correctness of entered letters
function checkLetters() {
    for (let i = 0; i < 5; i++) {
        let charBox = document.getElementById(`charBox.${gameState.currentRow}${i}`);
        let letter = charBox.textContent.toUpperCase(); // Ensure comparison is done in uppercase

        charBox.classList.remove('correct', 'contains', 'empty'); // Clear any existing classes

        if (letter === gameState.hiddenWord[i].toUpperCase()) {
            charBox.classList.add('correct');
        } else if (gameState.hiddenWord.toUpperCase().includes(letter)) {
            charBox.classList.add('contains');
        } else {
            charBox.classList.add('empty');
        }
    }
}

// Function to validate if the entered word is in the word list
function isWordValid(word) {
    return wordList.includes(word.toLowerCase()); // Convert to lowercase for validation
}


// Function to retrieve the entered word from the grid
function getEnteredWord() {
    return gameState.gameGrid[gameState.currentRow].join('').toUpperCase(); // Return the word in uppercase
}


// Function to update the game grid visually
function updateGameGrid() {
    for (let i = 0; i < gameState.gameGrid.length; i++) {
        for (let o = 0; o < gameState.gameGrid[i].length; o++) {
            let charBox = document.getElementById(`charBox.${i}${o}`);
            charBox.textContent = gameState.gameGrid[i][o];
        }
    }
}

// Utility function to check if a key is an alphabet letter
function isAlpha(key) {
    return key.length === 1 && /^[a-z]$/i.test(key);
}

// Function to add a letter to the current box
function addLetter(key) {
    if (gameState.currentCol === 5) return;
    if (gameState.currentRow > 5) return; // Prevent adding letters beyond the grid
    gameState.gameGrid[gameState.currentRow][gameState.currentCol] = key.toUpperCase();
    gameState.currentCol++;
}

// Function to delete a letter from the current box
function deleteLetter() {
    if (gameState.currentCol === 0) return;
    gameState.gameGrid[gameState.currentRow][gameState.currentCol - 1] = '';
    gameState.currentCol--;
}

// Function to update the scoreboard display
function updateScoreBoard() {
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    if (scoreElement && timerElement) {
        scoreElement.textContent = gameState.score;
        timerElement.textContent = gameState.timeLeft + 's';
    } else {
        console.error('Score or Timer element not found');
    }
}

// Function to reset the tile colors in the grid
function resetTileColors() {
    for (let i = 0; i < gameState.gameGrid.length; i++) {
        for (let o = 0; o < gameState.gameGrid[i].length; o++) {
            let charBox = document.getElementById(`charBox.${i}${o}`);
            charBox.classList.remove('correct', 'contains', 'empty');
        }
    }
}

// Function to reset the game state
function resetGame() {
    clearInterval(gameState.timerInterval);
    gameState.gameGrid = Array(6).fill().map(() => Array(5).fill(''));
    gameState.currentRow = 0;
    gameState.currentCol = 0;
    gameState.hiddenWord = wordList[Math.floor(Math.random() * wordList.length)];
    resetTileColors();
    resetTimer();
    updateGameGrid();
}

// Function to start the game timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateScoreBoard();
        if (gameState.timeLeft === 0) {
            showMessageBox("Time's up! The correct word was: " + gameState.hiddenWord.toUpperCase()); // Show the correct word
            gameState.score = 0;
            updateScoreBoard();
            resetGame();
        }
    }, 1000);
}


// Function to reset the game timer
function resetTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timeLeft = 80;
    startTimer();
}

// Initialize the game
init();

