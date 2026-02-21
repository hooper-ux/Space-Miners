// DOM elements
const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

// Game state
let score = 0;
let timeLeft = 30;
let gameActive = true;

// Move the target to a random position
function moveTarget() {
    if (!gameActive) return;

    const gameContainer = document.querySelector(".game-container");
    const containerRect = gameContainer.getBoundingClientRect();

    // Random position within the container
    const maxX = containerRect.width - target.offsetWidth;
    const maxY = containerRect.height - target.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

// Update score
function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    moveTarget(); // Move target after each click
}

// Start timer
function startTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            alert(`Game Over! Your score: ${score}`);
        }
    }, 1000);
}

// Event listeners
target.addEventListener("click", updateScore);

// Initialize game
moveTarget();
startTimer();+