const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("resetButton");

// Game constants
let boxSize = 20;
let snake;
let food;
let direction;
let score;
let game;

// Initialize the game
function init() {
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset variables
    snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
    direction = "RIGHT";
    score = 0;
    spawnFood();

    // Start the game loop
    if (game) clearInterval(game); // Clear any previous game intervals
    game = setInterval(drawGame, 100);
}

// Spawn food at a random position
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

// Control the snake
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Main game loop
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction === "UP") snakeY -= boxSize;
    if (direction === "DOWN") snakeY += boxSize;
    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;

    // Check for collision with food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        spawnFood(); // Generate new food position
    } else {
        snake.pop(); // Remove the tail
    }

    // Add new head to the snake
    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // Check for collisions with walls or itself
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over! Score: " + score);
    }
}

// Collision detection function
function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Reset game when reset button is clicked
resetButton.addEventListener("click", init);

// Start the game on page load
init();
