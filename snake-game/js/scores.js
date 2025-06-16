const scores = [];

function addScore(playerName, score) {
    scores.push({ playerName, score, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.score - a.score);
    
    // Garder uniquement les 10 meilleurs scores
    if (scores.length > 10) {
        scores.length = 10;
    }
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('snakeHighScores', JSON.stringify(scores));
}

function displayScores() {
    const scoreBoard = document.getElementById('score-board');
    scoreBoard.innerHTML = '';
    
    scores.forEach((entry, index) => {
        const scoreItem = document.createElement('li');
        scoreItem.innerHTML = `${index + 1}. ${entry.playerName} - ${entry.score} pts`;
        scoreBoard.appendChild(scoreItem);
    });
}

function loadScores() {
    const savedScores = localStorage.getItem('snakeHighScores');
    if (savedScores) {
        scores.push(...JSON.parse(savedScores));
        displayScores();
    }
}

// Charger les scores au démarrage
window.addEventListener('load', loadScores);