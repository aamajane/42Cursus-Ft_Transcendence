class Socket {
    constructor(game) {
        this.game = game;
        this.url = `ws://${window.location.host}/ws/game/${game.mode}/${game.id}/`;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = async () => {
            await context.setUserStatus(true);
            console.log("WebSocket connection established");
        };

        this.socket.onclose = async () => {
            await context.setUserStatus(false);
            console.log("WebSocket connection closed");
            this.socket.close();
        };

        this.socket.onerror = async (event) => {
            await context.setUserStatus(false);
            console.log("WebSocket connection error: ", event);
            this.socket.close();
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
                    this.game.player.username1.value = this.game.username;
                    this.game.player.avatar1.image.src = this.game.avatar;
                    break;
                case "paddle_level_two":
                    this.game.paddleLevel = 2;
                    this.game.player.paddle1.leftKey = null;
                    this.game.player.paddle1.rightKey = null;
                    this.game.player.username2.value = this.game.username;
                    this.game.player.avatar2.image.src = this.game.avatar;
                    break;
                case "game_ongoing":
                    this.updateUserData();
                    this.game.status = COUNTDOWN;
                    this.game.startTime = Date.now();
                    break;
                case "game_over":
                    this.game.status = OVER;
                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: OVER,
                            player1: this.game.player.username1.value,
                            player2: this.game.opponent.username1.value,
                            player3: this.game.player.username2?.value,
                            player4: this.game.opponent.username2?.value,
                            score1: this.game.player.score.value,
                            score2: this.game.opponent.score.value,
                        };
                        await context.updateGame(mutationData);
                    }
                    this.socket.close();
                    break;
                case "give_up":
                    this.game.status = OVER;
                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: OVER,
                            player1: this.game.player.username1.value,
                            player2: this.game.opponent.username1.value,
                            player3: this.game.player.username2?.value,
                            player4: this.game.opponent.username2?.value,
                            score1: 3,
                            score2: 0,
                        };
                        await context.updateGame(mutationData);
                    }
                    this.socket.close();
                    break;
                case "update_user_data":
                    if (this.game.team === data.team) {
                        if (data.paddle_level === 1) {
                            this.game.player.username1.value = data.username;
                            this.game.player.avatar1.image.src = data.avatar;
                        } else {
                            this.game.player.username2.value = data.username;
                            this.game.player.avatar2.image.src = data.avatar;
                        }
                    } else {
                        if (data.paddle_level === 1) {
                            this.game.opponent.username1.value = data.username;
                            this.game.opponent.avatar1.image.src = data.avatar;
                        } else {
                            this.game.opponent.username2.value = data.username;
                            this.game.opponent.avatar2.image.src = data.avatar;
                        }
                    }

                    if (this.game.isHost === true) {
                        const mutationData = {
                            gameId: this.game.id,
                            state: ONGOING,
                            player1: this.game.player.username1.value,
                            player2: this.game.opponent.username1.value,
                            player3: this.game.player.username2?.value,
                            player4: this.game.opponent.username2?.value,
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

        const handlePageChange = () => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.close();
            }
            window.removeEventListener("popstate", handlePageChange);
        };

        window.addEventListener("popstate", handlePageChange);
    }

    updateUserData() {
        const message = {
            event: "update_user_data",
            team: this.game.team,
            paddle_level: this.game.paddleLevel,
            username: this.game.username,
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

    GameOver() {
        const message = {
            event: "game_over",
        };

        this.sendMessage(message);
    }

    sendMessage(message) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            console.log("Message not sent: WebSocket connection closed");
            return;
        }

        this.socket.send(JSON.stringify(message));
    }
}
