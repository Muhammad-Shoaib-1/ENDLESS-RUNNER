
const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const gameOverText = document.querySelector('.game-over');
let jumping = false;
let gameRunning = true;
let gravity = 1;
let jumpVelocity = 15;
let velocity = 0;
let speed = 3;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !jumping) {
        jumping = true;
        velocity = jumpVelocity;
    }
});

function updatePlayer() {
    let playerBottom = parseInt(window.getComputedStyle(player).bottom);
    let playerLeft = parseInt(window.getComputedStyle(player).left);
    velocity -= gravity;
    let newBottom = playerBottom + velocity;
    let newLeft = playerLeft + speed; 
    
    if (newBottom <= 5) {
        newBottom = 5;
        jumping = false;
        velocity = 0;
    }
    
    player.style.bottom = newBottom + 'px';
    player.style.left = newLeft + 'px';
    
    requestAnimationFrame(updatePlayer);
}

function createObstacle() {
    if (!gameRunning) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameContainer.appendChild(obstacle);
    obstacle.style.right = '0px';
    
    let moveObstacle = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveObstacle);
            return;
        }
        
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).right);
        obstacle.style.right = obstacleRight + 5 + 'px';
        
        // Collision Detection
        let playerRect = player.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();
        
        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom < obstacleRect.bottom + 10
        ) {
            gameOver();
        }
        
        if (obstacleRight > window.innerWidth) {
            clearInterval(moveObstacle);
            obstacle.remove();
        }
    }, 20);
    
    setTimeout(createObstacle, 2000);
}

function gameOver() {
    gameRunning = false;
    gameOverText.style.display = 'block';
}

updatePlayer();
createObstacle();