import { AIGame, MultiplayerGame } from "./game.js";
import { Map } from "./map.js";

window.addEventListener("load", function () {
    const canvasContainer = document.getElementById("pong-container");
    const canvas = document.getElementById("pong");
    const context = canvas.getContext("2d");
    const gameID = canvas.getAttribute("data-game-id");
    const gameMode = canvas.getAttribute("data-game-mode");
    const gameMap = new Map(canvas.getAttribute("data-game-map"));

    let game;
    if (gameMode === AI) {
        game = new AIGame(gameMap);
    } else {
        game = new MultiplayerGame(gameID, gameMode, gameMap);

        game.socket.onOpen();
        game.socket.onClose();
        game.socket.onError();
        game.socket.onMessage();
    }

    canvasContainer.style.backgroundImage = `url(${gameMap.backgroundImage.src})`;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    function render() {
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        switch (game.status) {
            case PENDING:
                gamePending();
                break;
            case COUNTDOWN:
                gameCountdown();
                break;
            case ONGOING:
                game.update();
                game.draw(context);
                break;
            default:
                gameOver();
                break;
        }

        requestAnimationFrame(render);
    }

    function gamePending() {
        const message = "Waiting for opponent...";

        context.font = "50px sans-serif";
        context.fillStyle = "white";
        context.textAlign = "center";

        context.fillText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    function gameCountdown() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - game.startTime;
        const countdownTime = 3000;

        if (timeElapsed < countdownTime) {
            const countdown = Math.ceil((countdownTime - timeElapsed) / 1000);

            context.font = "100px sans-serif";
            context.fillStyle = "white";
            context.textAlign = "center";

            context.fillText(countdown, GAME_WIDTH / 2, GAME_HEIGHT / 2);
        } else {
            game.status = ONGOING;
        }
    }

    function gameOver() {
        context.font = "100px sans-serif";
        context.fillStyle = "white";
        context.textAlign = "center";

        context.fillText(game.status, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    render();
});
