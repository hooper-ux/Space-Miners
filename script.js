// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("target");
    const scoreDisplay = document.getElementById("score");
    const timeDisplay = document.getElementById("time");

    let score = 0;
    let timeLeft = 30;
    let gameActive = true;

    // Move the target randomly
    function moveTarget() {
        if (!gameActive) return;

        const container = document.querySelector(".game-container");
        const containerRect = container.getBoundingClientRect();

        const maxX = containerRect.width - target.offsetWidth;
        const maxY = containerRect.height - target.offsetHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;
    }

    // Update score on click
    function updateScore() {
        score++;
        scoreDisplay.textContent = score;
        moveTarget();
    }

    // Countdown timer
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

    // Event listener for clicks
    target.addEventListener("click", updateScore);

    // Start the game
    moveTarget();
    startTimer();
});