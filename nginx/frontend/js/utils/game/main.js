async function startGame() {
    // TODO: read ChatGPT History "Protect Frontend JS Files"

    const shadowRoot = document.getElementById("custom-game").shadowRoot;
    const canvasContainer = shadowRoot.getElementById("pong-container");
    const canvas = shadowRoot.getElementById("pong");
    const ctx = canvas.getContext("2d");
    const gameID = parseInt(context.track.gameId);
    const gameMode = context.track.gameMode;
    const gameMap = new Map(context.track.gameMap);

    canvasContainer.style.backgroundImage = `url(${gameMap.backgroundImage.src})`;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    ctx.textAlign = "center";

    if (gameMode !== AIMode && (await context.getUserStatus())) {
        console.log("User is already playing in a game");
        return;
    }

    const game =
        gameMode === AIMode
            ? new AIGame(gameMap)
            : new MultiplayerGame(gameID, gameMode, gameMap);

    function render() {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        switch (game.status) {
            case PENDING:
                gamePending();
                break;
            case COUNTDOWN:
                gameCountdown();
                break;
            case ONGOING:
                gameOngoing();
                break;
            default:
                gameOver();
                return;
        }

        requestAnimationFrame(render);
    }

    function gamePending() {
        const message = "Waiting for opponent...";

        ctx.font = gameMap.waitingFont;
        ctx.fillStyle = gameMap.fillStyle;
        ctx.strokeStyle = gameMap.strokeStyle;
        ctx.lineWidth = gameMap.nicknameLineWidth;
        ctx.strokeText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
        ctx.fillText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    }

    function gameCountdown() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - game.startTime;
        const countdownTime = 5000;

        if (timeElapsed < countdownTime) {
            const countdown = Math.ceil((countdownTime - timeElapsed) / 1000);

            ctx.font = gameMap.countdownFont;
            ctx.fillStyle = gameMap.fillStyle;
            ctx.strokeStyle = gameMap.strokeStyle;
            ctx.lineWidth = gameMap.nicknameLineWidth;

            ctx.strokeText(countdown, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);
            ctx.fillText(countdown, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);
        } else {
            game.status = ONGOING;
        }
    }

    function gameOngoing() {
        game.update();
        game.draw(ctx);
    }

    function gameOver() {
        const message = "Game Over";

        ctx.font = gameMap.overFont;
        ctx.fillStyle = gameMap.fillStyle;
        ctx.strokeStyle = gameMap.strokeStyle;
        ctx.lineWidth = gameMap.nicknameLineWidth;

        ctx.strokeText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
        ctx.fillText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
    }

    render();
}
