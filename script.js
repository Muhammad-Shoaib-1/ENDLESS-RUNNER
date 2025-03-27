const player = document.querySelector('.player');
    const gameContainer = document.querySelector('.game-container');
    const gameOverText = document.querySelector('.game-over');
    const scoreDiv = document.getElementById('score');

    let jumping = false;
    let gameRunning = true;
    let gravity = 0.8;
    let jumpVelocity = 15;
    let velocity = 0;

    // Game variables
    let score = 0;
    let obstacleSpeed = 8; // initial speed

    // Listen for jump (Up Arrow) and restart (Enter) keys
    document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowUp' && !jumping && gameRunning) {
        jumping = true;
        velocity = jumpVelocity;
    }
    if (event.code === 'Enter' && !gameRunning) {
        location.reload();
    }
    });

    // Update player's vertical position (player stays fixed horizontally)
    function updatePlayer() {
    let playerBottom = parseFloat(window.getComputedStyle(player).bottom);
    velocity -= gravity;
    let newBottom = playerBottom + velocity;
    
    if (newBottom <= 5) {
        newBottom = 5;
        jumping = false;
        velocity = 0;
    }
    
    player.style.bottom = newBottom + 'px';
    
    requestAnimationFrame(updatePlayer);
    }

    // Create obstacles that move from right to left
    function createObstacle() {
    if (!gameRunning) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    // Start at the right edge of the container
    obstacle.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(obstacle);
    
    let obstacleInterval = setInterval(() => {
        if (!gameRunning) {
        clearInterval(obstacleInterval);
        return;
        }
        
        let obstacleLeft = parseFloat(window.getComputedStyle(obstacle).left);
        // Move obstacle to the left using current obstacleSpeed
        obstacle.style.left = (obstacleLeft - obstacleSpeed) + 'px';
        
        // Collision detection using bounding rectangles
        let playerRect = player.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();
        
        if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top
        ) {
        gameOver();
        }
        
        // Remove obstacle if it goes off-screen
        if (obstacleLeft < -parseFloat(window.getComputedStyle(obstacle).width)) {
        clearInterval(obstacleInterval);
        obstacle.remove();
        }
    }, 20);
    
    // Spawn next obstacle after a random delay between 1.5s and 3s
    setTimeout(createObstacle, Math.random() * 1500 + 1500);
    }

    function gameOver() {
    gameRunning = false;
    gameOverText.style.display = 'block';
    }

    // Score and speed update
    setInterval(() => {
    if (gameRunning) {
        score++;
        scoreDiv.innerHTML = `Score: ${score}`;
        
        // Increase obstacle speed every 100 points
        if (score % 100 === 0) {
        obstacleSpeed += 0.5;
        // Flash the score box by toggling the highlight class
        scoreDiv.classList.add('highlight');
        setTimeout(() => {
            scoreDiv.classList.remove('highlight');
        }, 300);
        }
        
        // Change player color based on score thresholds
        if (score >= 3000) {
        player.style.backgroundColor = 'yellow';
        } else if (score >= 2500) {
        player.style.backgroundColor = 'blue';
        } else if (score >= 2000) {
        player.style.backgroundColor = 'red';
        } else if (score >= 1500) {
        player.style.backgroundColor = 'purple';
        } else if (score >= 1000) {
        player.style.backgroundColor = 'orange';
        } else if (score >= 500) {
        player.style.backgroundColor = 'cyan';
        } else {
        player.style.backgroundColor = 'green';
        }
    }
    }, 100); // update every 100ms

    updatePlayer();
    createObstacle();
