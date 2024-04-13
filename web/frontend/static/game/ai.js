import {
    ballPaddleColliding,
    calculateBallVelocity,
    simulateKeyPress,
    simulateKeyRelease,
} from "./utils.js";

export class AI {
    constructor(game, leftKey, rightKey) {
        this.game = game;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.reset();
    }

    reset() {
        this.lastUpdateTime = 0;
        this.temperature = AI_TEMPERATURE;
        this.coolingRate = AI_COOLING_RATE;
        this.bestMove = null;
    }

    update() {
        // Refresh game view for AI every 1 second to get ball data
        const currentTime = Date.now();
        if (currentTime - this.lastUpdateTime >= 1000) {
            this.ball = {
                radius: BALL_RADIUS,
                speed: this.game.ball.speed,
                x: this.game.ball.x,
                y: this.game.ball.y,
                velocityX: this.game.ball.velocityX,
                velocityY: this.game.ball.velocityY,
            };

            this.lastUpdateTime = currentTime;
        } else {
            this.ball.x += this.ball.velocityX;
            this.ball.y += this.ball.velocityY;

            this.ball.top = this.ball.y - this.ball.radius;
            this.ball.bottom = this.ball.y + this.ball.radius;
            this.ball.left = this.ball.x - this.ball.radius;
            this.ball.right = this.ball.x + this.ball.radius;

            if (
                (this.ball.left < 0 && this.ball.velocityX < 0) ||
                (this.ball.right > GAME_WIDTH && this.ball.velocityX > 0)
            ) {
                this.ball.velocityX = -this.ball.velocityX;
            }

            const paddle =
                this.ball.top < GAME_HEIGHT / 2
                    ? this.game.opponent.paddle
                    : this.game.player.paddle;

            if (ballPaddleColliding(this.ball, paddle)) {
                calculateBallVelocity(this.ball, paddle);
            }
        }

        const currentPaddleXCentre = this.game.opponent.paddle.x + PADDLE_WIDTH / 2;
        const currentKey = this.game.opponent.paddle.input.currentKey;

        // Center the AI paddle if the ball is moving away from it
        if (this.ball.velocityY > 0) {
            if (currentPaddleXCentre > GAME_WIDTH / 2) {
                simulateKeyPress(this.leftKey);
            } else if (currentPaddleXCentre < GAME_WIDTH / 2) {
                simulateKeyPress(this.rightKey);
            } else {
                simulateKeyRelease(currentKey);
            }
            return;
        }

        // Release the key if the ball is in the range of the paddle
        if (
            this.ball.x > this.game.opponent.paddle.x &&
            this.ball.x < this.game.opponent.paddle.x + PADDLE_WIDTH
        ) {
            simulateKeyRelease(currentKey);
            return;
        }

        // Calculate the point of intersection with the paddle
        const timeToIntersect = (this.game.opponent.paddle.y - this.ball.y) / this.ball.velocityY;
        const intersectX = this.ball.x + this.ball.velocityX * timeToIntersect;

        // If the intersection point is out of game bounds, don't move the paddle
        // Add extra bounds to make the AI more responsive
        const extraBounds = GAME_WIDTH / 5;
        if (
            intersectX < -extraBounds ||
            intersectX > GAME_WIDTH + extraBounds
        ) {
            simulateKeyRelease(currentKey);
            return;
        }

        // If the intersection point is within the game bounds, Use simulated annealing to find the best move
        this.simulatedAnnealing(currentPaddleXCentre);
    }

    simulatedAnnealing(currentPaddleXCentre) {
        // Simulated annealing to find the best move
        const possibleMoves = [this.leftKey, this.rightKey];
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        const newPaddleXCentre =
            randomMove === this.leftKey
                ? currentPaddleXCentre - PADDLE_SPEED
                : currentPaddleXCentre + PADDLE_SPEED;

        // Evaluate the current and new moves
        const currentScore = this.evaluateMove(currentPaddleXCentre);
        const newScore = this.evaluateMove(newPaddleXCentre);

        // Accept the move if it's better or with a certain probability
        if (
            newScore > currentScore ||
            Math.random() < Math.exp((newScore - currentScore) / this.temperature)
        ) {
            this.bestMove = randomMove;
        }

        simulateKeyPress(this.bestMove);

        // Cool down the temperature for the next iteration
        this.temperature *= 1 - this.coolingRate;
    }

    evaluateMove(newPaddleXCentre) {
        const currentPaddleXCentre = this.game.opponent.paddle.x + PADDLE_WIDTH / 2;

        // Calculate the distance between the ball and the current paddle position
        const currentDistance = Math.abs(this.ball.x - currentPaddleXCentre);

        // Calculate the distance between the ball and the potential new paddle position
        const newDistance = Math.abs(this.ball.x - newPaddleXCentre);

        // Score based on the change in distance (smaller is better)
        const distanceScore = currentDistance - newDistance;

        // Penalize moves that go out of bounds
        const outOfBoundsPenalty =
            newPaddleXCentre < PADDLE_WIDTH / 2 ||
            newPaddleXCentre + PADDLE_WIDTH / 2 > GAME_WIDTH
                ? -1
                : 0;

        const totalScore = distanceScore + outOfBoundsPenalty;

        return totalScore;
    }
}
