class Ball {
    constructor(
        image,
        color,
        playerPaddle1,
        playerPaddle2,
        opponentPaddle1,
        opponentPaddle2
    ) {
        this.image = image;
        this.color = color;
        this.frame = 0;
        this.playerPaddle1 = playerPaddle1;
        this.playerPaddle2 = playerPaddle2;
        this.opponentPaddle1 = opponentPaddle1;
        this.opponentPaddle2 = opponentPaddle2;
        this.radius = BALL_RADIUS;
        this.reset();
    }

    reset() {
        this.speed = BALL_SPEED;
        this.x = BALL_X;
        this.y = BALL_Y;
        this.velocityX = (this.speed / 2) * (Math.random() < 0.5 ? 1 : -1);
        this.velocityY = (this.speed / 2) * (Math.random() < 0.5 ? 1 : -1);
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;

        if (
            (this.left < 0 && this.velocityX < 0) ||
            (this.right > GAME_WIDTH && this.velocityX > 0)
        ) {
            this.velocityX = -this.velocityX;
        }

        const paddle1 =
            this.top > GAME_HEIGHT / 2
                ? this.playerPaddle1
                : this.opponentPaddle1;

        if (ballPaddleColliding(this, paddle1)) {
            calculateBallVelocity(this, paddle1);
        }

        if (this.playerPaddle2 && this.opponentPaddle2) {
            const paddle2 =
                this.top > GAME_HEIGHT / 2
                    ? this.playerPaddle2
                    : this.opponentPaddle2;

            if (ballPaddleColliding(this, paddle2)) {
                calculateBallVelocity(this, paddle2, 2);
            }
        }
    }

    draw(ctx) {
        ctx.save();

        applyShadow(ctx, 20, (this.x - GAME_WIDTH / 2) / BALL_SIZE, 10);

        const currentImage = this.image[(this.frame += 1) % BALL_MAX_FRAME];
        const newImage = changeImageColor(currentImage, this.color);

        ctx.drawImage(
            newImage,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );

        resetShadow(ctx);

        ctx.restore();
    }
}
