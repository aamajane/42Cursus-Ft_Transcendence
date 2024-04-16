class Paddle {
    constructor(image, x, y, leftKey, rightKey) {
        this.image = image;
        this.speed = PADDLE_SPEED;
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.x = x;
        this.y = y;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.input = new Input(leftKey, rightKey);
        this.isMoving = false;
    }

    update() {
        if (
            this.leftKey &&
            this.input.currentKey === this.leftKey &&
            this.x > 25
        ) {
            this.x -= this.speed;
            this.isMoving = true;
        } else if (
            this.rightKey &&
            this.input.currentKey === this.rightKey &&
            this.x < GAME_WIDTH - this.width - 25
        ) {
            this.x += this.speed;
            this.isMoving = true;
        } else {
            this.x += 0;
            this.isMoving = false;
        }

        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
    }

    draw(context) {
        applyShadow(context, 20, (this.x - GAME_WIDTH / 2) / this.width, 20);

        context.drawImage(this.image, this.x, this.y, this.width, this.height);

        resetShadow(context);
    }
}
