// game.js

// Variables globales
let canvas;
let ctx;
let snake;
let food;
let score = 0;
let gameLoop;
let gameStarted = false;

// Définir une constante pour la taille de la grille
const GRID_SIZE = 20; // Augmenté de 10 à 20

let baseSpeed = 150; // Vitesse initiale
let currentSpeed = baseSpeed;

// Initialisation du jeu
function init() {
    // Initialisation des éléments DOM
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const playerNameInput = document.getElementById('player-name');

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    
    // Initialisation du canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Écouteurs des touches du clavier
    document.addEventListener('keydown', handleKeyPress);
}

function startGame() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName.trim()) {
        alert('Veuillez entrer votre nom!');
        return;
    }

    // Réinitialiser l'état du jeu
    clearInterval(gameLoop);
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('display-name').textContent = playerName;

    // Initialisation du jeu
    snake = new Snake();
    food = createFood();
    score = 0;
    // Réinitialiser la vitesse
    currentSpeed = baseSpeed;
    updateScore();
    gameStarted = true;
    gameLoop = setInterval(update, currentSpeed);
}

function update() {
    if (!gameStarted) return;

    snake.move();
    checkCollision();
    render();
}

function render() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner la nourriture
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);

    // Dessiner le serpent
    snake.body.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#008800';
        ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });
}

// Création de la nourriture
function createFood() {
    let newFood;
    let isOnSnake;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
        };
        
        // Vérifier si la nourriture apparaît sur le serpent
        isOnSnake = snake.body.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
        
    } while (isOnSnake); // Continuer tant que la nourriture est sur le serpent
    
    return newFood;
}

function checkCollision() {
    const head = snake.body[0];

    // Collision avec les murs
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
        return;
    }

    // Collision avec soi-même
    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            gameOver();
            return;
        }
    }

    // Collision avec la nourriture
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        updateScore();
        
        // Ajouter un nouveau segment à la fin du serpent
        const lastSegment = snake.body[snake.body.length - 1];
        snake.body.push({...lastSegment});
        
        food = createFood();

        // Augmenter la vitesse tous les 10 points
        if (score % 10 === 0) {
            currentSpeed = Math.max(50, baseSpeed - (score / 10) * 20);
            clearInterval(gameLoop);
            gameLoop = setInterval(update, currentSpeed);
        }
    }
}

function handleKeyPress(event) {
    if (!gameStarted) return;

    event.preventDefault();

    const directions = {
        'ArrowUp': { x: 0, y: -GRID_SIZE },
        'ArrowDown': { x: 0, y: GRID_SIZE },
        'ArrowLeft': { x: -GRID_SIZE, y: 0 },
        'ArrowRight': { x: GRID_SIZE, y: 0 }
    };

    if (directions[event.key]) {
        snake.changeDirection(directions[event.key]);
    }
}

function updateScore() {
    document.getElementById('current-score').textContent = score;
}

function gameOver() {
    gameStarted = false;
    clearInterval(gameLoop);
    
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function restartGame() {
    document.getElementById('game-over').style.display = 'none';
    startGame();
}

// Démarrer le jeu
window.onload = init;