document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 10;
    const gridWidth = Math.floor(canvas.width / gridSize);
    const gridHeight = Math.floor(canvas.height / gridSize);
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameSpeed = 100;
    let gameInterval = null;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameActive = false;
    let gamePaused = false;
    
    // UI elements
    const scoreValue = document.getElementById('score-value');
    const highScoreValue = document.getElementById('high-score-value');
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    const restartButton = document.getElementById('restart-button');
    const gameOverModal = document.getElementById('game-over');
    const finalScore = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again');
    
    // Display high score
    highScoreValue.textContent = highScore;
    
    // Initialize game
    function initGame() {
        // Create snake at the center of the canvas
        const startX = Math.floor(gridWidth / 2);
        const startY = Math.floor(gridHeight / 2);
        
        snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        
        // Create initial food
        createFood();
        
        // Reset direction
        direction = 'right';
        nextDirection = 'right';
        
        // Reset score
        score = 0;
        scoreValue.textContent = score;
        
        // Draw game
        draw();
    }
    
    // Create food at random position
    function createFood() {
        const foodX = Math.floor(Math.random() * gridWidth);
        const foodY = Math.floor(Math.random() * gridHeight);
        
        // Check if food is on snake
        const isOnSnake = snake.some(segment => segment.x === foodX && segment.y === foodY);
        
        if (isOnSnake) {
            // If food is on snake, create new food
            createFood();
        } else {
            food = { x: foodX, y: foodY };
        }
    }
    
    // Draw game
    function draw() {
        // Clear canvas
        ctx.fillStyle = 'rgba(250, 230, 230, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Create a gradient for the snake body
            if (index === 0) {
                // Snake head
                ctx.fillStyle = '#8b4343';
            } else {
                // Snake body with gradient effect
                const gradientValue = 55 + Math.floor((index / snake.length) * 30);
                ctx.fillStyle = `rgb(${110 + index % 20}, ${gradientValue}, ${gradientValue})`;
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            
            // Add a border to each segment
            ctx.strokeStyle = 'rgba(250, 230, 230, 0.5)';
            ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        
        // Draw food
        const gradient = ctx.createRadialGradient(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            0,
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2
        );
        gradient.addColorStop(0, '#7ca654');
        gradient.addColorStop(1, '#5e6e45');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Add a highlight to the food
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 3,
            food.y * gridSize + gridSize / 3,
            gridSize / 5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw grid (subtle)
        ctx.strokeStyle = 'rgba(200, 160, 160, 0.1)';
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }
    
    function update() {
        direction = nextDirection;
        
        const head = { ...snake[0] };
        
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        //check if snake hit a wall
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        //Check if snake hit itself
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        //Add new head to snake
        snake.unshift(head);
        
        //Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreValue.textContent = score;
            
            //Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreValue.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            //Create new food
            createFood();
            
            //Increasing game speed every 5 food items
            if (score % 50 === 0 && gameSpeed > 50) {
                gameSpeed -= 5;
                clearInterval(gameInterval);
                gameInterval = setInterval(update, gameSpeed);
            }
        } else {
            //Remove tail
            snake.pop();
        }
        
        draw();
    }
    
    function gameOver() {
        gameActive = false;
        clearInterval(gameInterval);
        gamePaused = false;
        
        startButton.disabled = false;
        pauseButton.disabled = true;
        pauseButton.textContent = 'Pause';
        restartButton.disabled = true;
        
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
    }

    function gameLoop() {
        if (!gameActive || gamePaused) return;

        update();//move snake, check collision
        draw();
    }
    
    function startGame() {
        gameOverModal.style.display = 'none';
        
        initGame();
        gameActive = true;
        gamePaused = false;
        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = false;
        
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
    
    function togglePause() {
        if (gameActive) {
            if (gamePaused) {
                gameInterval = setInterval(update, gameSpeed);
                gamePaused = false;
                pauseButton.textContent = 'Pause';
            } else {
                clearInterval(gameInterval);
                gamePaused = true;
                pauseButton.textContent = 'Resume';
            }
        }
    }
    function restartGame() {
        if (gameActive || gamePaused) {
            clearInterval(gameInterval);
            // Hide game over modal
            gameOverModal.style.display = 'none';
            startGame();
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (gameActive && !gamePaused) {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'down') nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') nextDirection = 'right';
                    break;
            }
        }
    });
    
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', restartGame);
    playAgainButton.addEventListener('click', startGame);
    
    draw();
});