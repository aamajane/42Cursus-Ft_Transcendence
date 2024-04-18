function calculateBallVelocity(ball, paddle, level = 1) {
    const paddleXCenter = paddle.x + PADDLE_WIDTH / 2;
    const collidePoint = (ball.x - paddleXCenter) / (PADDLE_WIDTH / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = ball.top < GAME_HEIGHT / 2 ? 1 : -1;

    ball.velocityX = ball.speed * Math.sin(angleRad);
    ball.velocityY = ball.speed * Math.cos(angleRad) * direction;

    if (ball.speed < BALL_MAX_SPEED) {
        ball.speed += BALL_INCREASE_SPEED;
    }
}

function ballPaddleColliding(ball, paddle) {
    return (
        ball.top < paddle.bottom &&
        ball.bottom > paddle.top &&
        ball.left < paddle.right &&
        ball.right > paddle.left
    );
}

function simulateKeyPress(key) {
    if (key === null) {
        return;
    }

    const keyPressEvent = new KeyboardEvent("keydown", {
        key: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
    });

    document.dispatchEvent(keyPressEvent);
}

function simulateKeyRelease(key) {
    if (key === null) {
        return;
    }

    const keyReleaseEvent = new KeyboardEvent("keyup", {
        key: key,
        keyCode: key.charCodeAt(0),
        bubbles: true,
    });

    document.dispatchEvent(keyReleaseEvent);
}

function applyShadow(ctx, blur, offsetX, offsetY) {
    ctx.shadowColor = "rgb(0, 0, 0)";
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
}

function resetShadow(ctx) {
    ctx.shadowColor = "rgb(0, 0, 0)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function changeImageColor(image, color) {
    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d");

    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] *= color.r;
        data[i + 1] *= color.g;
        data[i + 2] *= color.b;
    }

    ctx.putImageData(imageData, 0, 0);

    return offscreenCanvas;
}
