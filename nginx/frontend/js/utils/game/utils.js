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

function applyShadow(context, blur, offsetX, offsetY) {
    context.shadowColor = "#000000";
    context.shadowBlur = blur;
    context.shadowOffsetX = offsetX;
    context.shadowOffsetY = offsetY;
}

function resetShadow(context) {
    context.shadowColor = "#000000";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

function changeImageColor(image, color) {
    const offscreenCanvas = document.createElement("canvas");
    const context = offscreenCanvas.getContext("2d");

    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;

    context.drawImage(image, 0, 0, image.width, image.height);

    const imageData = context.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] *= color.r;
        data[i + 1] *= color.g;
        data[i + 2] *= color.b;
    }

    context.putImageData(imageData, 0, 0);

    return offscreenCanvas;
}
