const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

// Spawn food at the right side of the screen
function spawnFood() {
    food = {
        x: canvas.width, // Start at the right edge of the screen
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        speed: 5 // Set speed of movement to the left
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

    // Draw and move food to the left
    ctx.fillStyle = "blue";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    food.x -= food.speed; // Move food to the left

    // Reset food to the right side if it goes off-screen on the left
    if (food.x + boxSize < 0) {
        spawnFood();
    }

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction === "UP") snakeY -= boxSize;
    if (direction === "DOWN") snakeY += boxSize;
    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;

    // Check for collision with food
    if (Math.abs(snakeX - food.x) < boxSize && Math.abs(snakeY - food.y) < boxSize) {
        score++;
        spawnFood(); // Generate new food at the right side again
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
        setTimeout(init, 500); // Restart the game after 0.5 seconds
    }

    // Draw the score in the top-right corner
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Score: " + score, canvas.width - 20, 30);
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

// Start the game on page load
init();
