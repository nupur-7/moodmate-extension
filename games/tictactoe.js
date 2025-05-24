document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart');
    const changePlayerBtn = document.getElementById('change-player');
    const choosePlayerScreen = document.getElementById('choose-player');
    const chooseX = document.getElementById('choose-x');
    const chooseO = document.getElementById('choose-o');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let userMark = 'X';  //Default user mark
    let computerMark = 'O';  //Default computer mark
    let currentPlayer = 'X';  //x always starts
    
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });
    
    restartBtn.addEventListener('click', restartGame);
    
    changePlayerBtn.addEventListener('click', showPlayerChoiceScreen);
    
    chooseX.addEventListener('click', () => {
        userMark = 'X';
        computerMark = 'O';
        startGame();
    });
    
    chooseO.addEventListener('click', () => {
        userMark = 'O';
        computerMark = 'X';
        startGame();
    });
    
    function startGame() {
        gameActive = true;
        currentPlayer = 'X';  //X always starts
        choosePlayerScreen.style.display = 'none';
        updateStatus();
        
        if (computerMark === 'X') {
            setTimeout(computerMove, 500);
        }
    }
    
    function handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (gameState[index] !== '' || !gameActive || currentPlayer !== userMark) {
            return;
        }
        
        gameState[index] = userMark;
        cell.textContent = userMark;
        cell.classList.add(userMark.toLowerCase());
        
        if (checkWinner() || checkDraw()) {
            return;
        }
        
        currentPlayer = computerMark;
        updateStatus();
        setTimeout(computerMove, 500);
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        //computer Try to win
        const winMove = findBestMove(computerMark);
        if (winMove !== -1) {
            makeMove(winMove, computerMark);
            return;
        }
        
        //try to block user from winning
        const blockMove = findBestMove(userMark);
        if (blockMove !== -1) {
            makeMove(blockMove, computerMark);
            return;
        }
        
        //Try to take the center
        if (gameState[4] === '') {
            makeMove(4, computerMark);
            return;
        }
        
        //Try to take the corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => gameState[corner] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            makeMove(randomCorner, computerMark);
            return;
        }
        
        //Take any available cell
        const availableCells = gameState.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
        if (availableCells.length > 0) {
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            makeMove(randomCell, computerMark);
        }
    }
    
    function findBestMove(mark) {
        //Check if there's a winning move
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            
            // heck if there are two of the same mark and an empty cell
            if (gameState[a] === mark && gameState[b] === mark && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === mark && gameState[c] === mark && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === mark && gameState[c] === mark && gameState[a] === '') {
                return a;
            }
        }
        return -1;
    }
    
    function makeMove(index, mark) {
        gameState[index] = mark;
        cells[index].textContent = mark;
        cells[index].classList.add(mark.toLowerCase());
        
        if (checkWinner() || checkDraw()) {
            return;
        }
        
        currentPlayer = userMark;
        updateStatus();
    }
    
    function checkWinner() {
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                gameActive = false;
                const winner = gameState[a];
                status.textContent = winner === userMark ? "You Win!" : "Computer Wins!";
                
                // Highlight winning cells
                [a, b, c].forEach(index => {
                    cells[index].classList.add('winner');
                });
                
                return true;
            }
        }
        return false;
    }
    
    function checkDraw() {
        if (!gameState.includes('')) {
            gameActive = false;
            status.textContent = "It's a Draw!";
            return true;
        }
        return false;
    }
    
    function updateStatus() {
        if (gameActive) {
            status.textContent = currentPlayer === userMark ? "Your Turn" : "Computer's Turn";
        }
    }
    
    function restartGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';  
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        updateStatus();
        
        if (computerMark === 'X') {
            setTimeout(computerMove, 500);
        }
    }
    
    function showPlayerChoiceScreen() {
        choosePlayerScreen.style.display = 'flex';
        gameActive = false;
        restartGame();
    }
});