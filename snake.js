const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const boxSize = 20; // Size of each cell in the grid
let snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
let food = { x: Math.floor(Math.random() * 20) * boxSize, y: Math.floor(Math.random() * 20) * boxSize };
let direction = "RIGHT";
let score = 0;

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
        food = { x: Math.floor(Math.random() * 20) * boxSize, y: Math.floor(Math.random() * 20) * boxSize };
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

// Start the game loop
let game = setInterval(drawGame, 100);
