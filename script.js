import { wordList } from './words.js';

function showMessageBox(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.classList.remove('hidden'); 
    messageBox.classList.add('show'); 
}


function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.classList.remove('show');
    setTimeout(() => {
        messageBox.classList.add('hidden'); 
    }, 300); 
}


document.getElementById('closeButton').addEventListener('click', hideMessageBox);



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeButton').addEventListener('click', hideMessageBox);
});


showMessageBox('Start Game!');



let gameState = {
    gameGrid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
    hiddenWord: wordList[Math.floor(Math.random() * wordList.length)],
    score: 0,
    timeLeft: 45,
    timerInterval: null
};

function init() {
    const gameContainer = document.getElementById('gameContainer');
    makeGameGrid(gameContainer);
    console.log(gameState.hiddenWord);
    startTimer();
    keyboardpresses();
    updateScoreBoard();
}

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

function makeBox(gameGrid, row, col, letter = '') {
    const charBox = document.createElement('div');
    charBox.className = 'charBox';
    charBox.id = 'charBox.' + row + '' + col;
    charBox.textContent = letter;
    gameGrid.appendChild(charBox);
    return charBox;
}

function keyboardpresses() {
    document.body.onkeydown = (e) => {
        let key = e.key;
        if (key === 'Enter') {
            let word = getEnteredWord();
            if (isWordValid(word)) {
                checkLetters();
                checkTurn(word);
                gameState.currentRow++;
                gameState.currentCol = 0;
            } else {
                alert("The word is invalid");
            }
        }
        if (key === 'Backspace') {
            deleteLetter();
        }
        if (isAlpha(key)) {
            addLetter(key);
        }
        updateGameGrid();
    };
}

function checkTurn(enteredWord) {
    let won = gameState.hiddenWord === enteredWord;
    let gameOver = gameState.currentRow === 5;

    if (won) {
        gameState.score += 10;
        updateScoreBoard();
        showMessageBox('Good job!'); 
        resetGame(); 
    } else if (gameOver) {
        gameState.score = Math.max(0, gameState.score - 5);
        updateScoreBoard();
        showMessageBox('Game Over! The word was ' + gameState.hiddenWord + '.');
        resetGame(); 
    }
}


function checkLetters() {
    for (let i = 0; i < 5; i++) {
        let charBox = document.getElementById('charBox.' + gameState.currentRow + '' + i);
        let letter = charBox.textContent;

        if (letter == gameState.hiddenWord[i]) {
            charBox.classList.add('correct');
        } else if (gameState.hiddenWord.includes(letter)) {
            charBox.classList.add('contains');
        } else {
            charBox.classList.add('empty');
        }
    }
}

function isWordValid(getEnteredWord) {
    return wordList.includes(getEnteredWord);
}

function getEnteredWord() {
    return gameState.gameGrid[gameState.currentRow].reduce((previous, current) => previous + current);
}

function updateGameGrid() {
    for (let i = 0; i < gameState.gameGrid.length; i++) {
        for (let o = 0; o < gameState.gameGrid[i].length; o++) {
            let charBox = document.getElementById('charBox.' + i + '' + o);
            charBox.textContent = gameState.gameGrid[i][o];
        }
    }
}

function isAlpha(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(key) {
    if (gameState.currentCol === 5) return;
    gameState.gameGrid[gameState.currentRow][gameState.currentCol] = key;
    gameState.currentCol++;
}

function deleteLetter() {
    if (gameState.currentCol === 0) return;
    gameState.gameGrid[gameState.currentRow][gameState.currentCol - 1] = '';
    gameState.currentCol--;
}

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

function resetTileColors() {
    for (let i = 0; i < gameState.gameGrid.length; i++) {
        for (let o = 0; o < gameState.gameGrid[i].length; o++) {
            let charBox = document.getElementById('charBox.' + i + '' + o);
            charBox.classList.remove('correct', 'contains', 'empty'); 
        }
    }
}

function resetGame() {
    clearInterval(gameState.timerInterval);
    gameState.gameGrid = Array(6).fill().map(() => Array(5).fill(''));
    gameState.currentRow = -1;
    gameState.currentCol = 0;
    gameState.hiddenWord = wordList[Math.floor(Math.random() * wordList.length)];
    resetTileColors(); 
    resetTimer(); 
    updateGameGrid();
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateScoreBoard();
        if (gameState.timeLeft === 0) {
            showMessageBox("Time's up! The game will be reset."); 
            gameState.score = 0;
            updateScoreBoard();
            resetGame();
        }
    }, 1000);
}


function resetTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timeLeft = 45;
    startTimer(); 
}

init();
