class Snake {
    constructor() {
        const GRID_SIZE = 20;
        // Commencer avec un seul segment
        this.body = [
            { x: 200, y: 200 }
        ];
        this.direction = { x: GRID_SIZE, y: 0 };
        this.grow = false;
        this.lastDirection = this.direction;
    }

    move() {
        const newHead = { 
            x: this.body[0].x + this.direction.x, 
            y: this.body[0].y + this.direction.y 
        };
        
        this.body.unshift(newHead);
        
        if (!this.grow) {
            this.body.pop();
        } else {
            this.grow = false;
        }
    }

    changeDirection(newDirection) {
        // Sauvegarder la direction actuelle
        this.lastDirection = {...this.direction};
        
        // Vérifier si la nouvelle direction n'est pas opposée à la direction actuelle
        if (this.direction.x !== -newDirection.x || this.direction.y !== -newDirection.y) {
            this.direction = newDirection;
        }
    }

    grow() {
        // On met this.grow à true pour que le segment ne soit pas supprimé lors du prochain mouvement
        this.grow = true;
    }

    checkCollision(canvas) {
        const head = this.body[0];
        
        // Collision avec les murs
        if (head.x < 0 || head.x >= canvas.width || 
            head.y < 0 || head.y >= canvas.height) {
            return true;
        }
        
        // Collision avec le corps
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        
        return false;
    }
}