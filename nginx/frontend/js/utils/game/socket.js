class Socket {
    constructor(game) {
        this.game = game;
        this.url = `wss://${window.location.host}/ws/game/${game.mode}/${game.id}/`;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = async () => {
            await context.setUserStatus(true);
            console.log("Game Connected to server");
        };

        this.socket.onclose = async () => {
            await context.setUserStatus(false);
            console.log("Game Disconnected from server");
        };

        this.socket.onerror = async (event) => {
            await context.setUserStatus(false);
            console.log("Game Connection error: ", event);
        };

        this.socket.onmessage = async (event) => {
            const jsonData = JSON.parse(event.data);
            const data = jsonData["data"];

            switch (data.event) {
                case "host_true":
                    this.game.isHost = true;
                    break;
                case "team_one":
                    this.game.team = 1;
                    break;
                case "team_two":
                    this.game.team = 2;
                    break;
                case "paddle_level_one":
                    this.game.paddleLevel = 1;
                    if (this.game.player.paddle2) {
                        this.game.player.paddle2.leftKey = null;
                        this.game.player.paddle2.rightKey = null;
                    }
                    this.game.player.username1 = this.game.username;
                    this.game.player.nickname1.value = this.game.nickname;
                    this.game.player.avatar1.image.src = this.game.avatar;
                    break;
                case "paddle_level_two":
                    this.game.paddleLevel = 2;
                    this.game.player.paddle1.leftKey = null;
                    this.game.player.paddle1.rightKey = null;
                    this.game.player.username2 = this.game.username;
                    this.game.player.nickname2.value = this.game.nickname;
                    this.game.player.avatar2.image.src = this.game.avatar;
                    break;
                case "game_ongoing":
                    this.updateUserData();
                    this.game.status = COUNTDOWN;
                    this.game.startTime = Date.now();
                    break;
                case "game_over":
                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: OVER,
                            player1: this.game.player.username1,
                            player2: this.game.opponent.username1,
                            player3: this.game.player.username2,
                            player4: this.game.opponent.username2,
                            score1: this.game.player.score.value,
                            score2: this.game.opponent.score.value,
                        };
                        await context.updateGame(mutationData);
                    }
                    this.game.status = OVER;
                    this.socket.close();
                    break;
                case "give_up":
                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: OVER,
                            player1: this.game.player.username1,
                            player2: this.game.opponent.username1,
                            player3: this.game.player.username2,
                            player4: this.game.opponent.username2,
                            score1: 3,
                            score2: 0,
                        };
                        await context.updateGame(mutationData);
                    }
                    this.game.status = OVER;
                    this.socket.close();
                    break;
                case "update_user_data":
                    if (this.game.team === data.team) {
                        if (data.paddle_level === 1) {
                            this.game.player.username1 = data.username;
                            this.game.player.nickname1.value = data.nickname;
                            this.game.player.avatar1.image.src = data.avatar;
                        } else {
                            this.game.player.username2 = data.username;
                            this.game.player.nickname2.value = data.nickname;
                            this.game.player.avatar2.image.src = data.avatar;
                        }
                    } else {
                        if (data.paddle_level === 1) {
                            this.game.opponent.username1 = data.username;
                            this.game.opponent.nickname1.value = data.nickname;
                            this.game.opponent.avatar1.image.src = data.avatar;
                        } else {
                            this.game.opponent.username2 = data.username;
                            this.game.opponent.nickname2.value = data.nickname;
                            this.game.opponent.avatar2.image.src = data.avatar;
                        }
                    }

                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: ONGOING,
                            player1: this.game.player.username1,
                            player2: this.game.opponent.username1,
                            player3: this.game.player.username2,
                            player4: this.game.opponent.username2,
                            score1: 0,
                            score2: 0,
                        };
                        await context.updateGame(mutationData);
                    }
                    break;
                case "update_paddle":
                    if (this.game.team === data.team) {
                        if (data.paddle_level === 1) {
                            this.game.player.paddle1.x = data.paddle_x;
                        } else {
                            this.game.player.paddle2.x = data.paddle_x;
                        }
                    } else {
                        if (data.paddle_level === 1) {
                            this.game.opponent.paddle1.x =
                                GAME_WIDTH - PADDLE_WIDTH - data.paddle_x;
                        } else {
                            this.game.opponent.paddle2.x =
                                GAME_WIDTH - PADDLE_WIDTH - data.paddle_x;
                        }
                    }
                    break;
                case "update_score":
                    if (this.game.team === data.team) {
                        this.game.player.score.value = data.score_player;
                        this.game.opponent.score.value = data.score_opponent;
                    } else {
                        this.game.player.score.value = data.score_opponent;
                        this.game.opponent.score.value = data.score_player;
                    }
                    break;
                case "update_ball":
                    if (this.game.team === data.team) {
                        this.game.ball.x = data.ball_x;
                        this.game.ball.y = data.ball_y;
                    } else {
                        this.game.ball.x = GAME_WIDTH - data.ball_x;
                        this.game.ball.y = GAME_HEIGHT - data.ball_y;
                    }
                    break;
            }
        };

        this.handleConnectionLost();
    }

    updateUserData() {
        const message = {
            event: "update_user_data",
            team: this.game.team,
            paddle_level: this.game.paddleLevel,
            username: this.game.username,
            nickname: this.game.nickname,
            avatar: this.game.avatar,
        };

        this.sendMessage(message);
    }

    updatePaddle() {
        const paddleX =
            this.game.paddleLevel === 1
                ? this.game.player.paddle1.x
                : this.game.player.paddle2.x;

        const message = {
            event: "update_paddle",
            team: this.game.team,
            paddle_level: this.game.paddleLevel,
            paddle_x: paddleX,
        };

        this.sendMessage(message);
    }

    updateScore() {
        const message = {
            event: "update_score",
            team: this.game.team,
            score_player: this.game.player.score.value,
            score_opponent: this.game.opponent.score.value,
        };

        this.sendMessage(message);
    }

    updateBall() {
        const message = {
            event: "update_ball",
            team: this.game.team,
            ball_x: this.game.ball.x,
            ball_y: this.game.ball.y,
        };

        this.sendMessage(message);
    }

    updateHost() {
        const message = {
            event: "update_host",
        };

        this.sendMessage(message);
    }

    GameOver() {
        const message = {
            event: "game_over",
        };

        this.sendMessage(message);
    }

    sendMessage(message) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            console.log("Message not sent: Game Connection closed");
            return;
        }

        this.socket.send(JSON.stringify(message));
    }

    handleConnectionLost() {
        const popstateHandler = () => {
            this.game.status = OVER;
            this.socket.close();
            window.removeEventListener("popstate", popstateHandler);
        };
        const beforeunloadHandler = async (e) => {
            await context.setUserStatus(false);
            this.socket.close();
        };
        const visibilitychangeHandler = () => {
            if (document.visibilityState === "hidden") {
                if (this.socket.readyState === WebSocket.OPEN && this.game.isHost) {
                    this.game.isHost = false;
                    this.updateHost();
                } else if (this.socket.readyState === WebSocket.CLOSED) {
                    window.removeEventListener("visibilitychange", visibilitychangeHandler);
                }
            }
        };

        window.addEventListener("popstate", popstateHandler);
        window.addEventListener("beforeunload", beforeunloadHandler);
        window.addEventListener("visibilitychange", visibilitychangeHandler);
    }
}
