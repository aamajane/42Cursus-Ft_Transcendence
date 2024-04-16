function startGame() {
    const shadowRoot = document.getElementById("game-body").shadowRoot;
    const canvasContainer = shadowRoot.getElementById("pong-container");
    const canvas = shadowRoot.getElementById("pong");
    const ctx = canvas.getContext("2d");
    const gameID = context.track.gameId;
    const gameMode = context.track.gameMode;
    const gameMap = new Map(context.track.gameMap);

    canvasContainer.style.backgroundImage = `url(${gameMap.backgroundImage.src})`;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

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

        ctx.font = "50px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.fillText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    function gameCountdown() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - game.startTime;
        const countdownTime = 3000;

        if (timeElapsed < countdownTime) {
            const countdown = Math.ceil((countdownTime - timeElapsed) / 1000);

            ctx.font = "100px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";

            ctx.fillText(countdown, GAME_WIDTH / 2, GAME_HEIGHT / 2);
        } else {
            game.status = ONGOING;
        }
    }

    function gameOngoing() {
        game.update();
        game.draw(ctx);
    }

    function gameOver() {
        ctx.font = "100px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.fillText(game.status, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    render();
}