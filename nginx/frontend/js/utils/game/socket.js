class Socket {
    constructor(game) {
        this.game = game;
        this.url = `ws://${window.location.host}/ws/game/${game.mode}/${game.id}/`;
        this.socket = new WebSocket(this.url);

        this.onOpen();
        this.onClose();
        this.onError();
        this.onMessage();
    }

    onOpen() {
        this.socket.onopen = () => {
            console.log("Connected to server");
        };
    }

    onClose() {
        this.socket.onclose = () => {
            console.log("Disconnected from server");
            this.socket.close();
        };
    }

    onError() {
        this.socket.onerror = (event) => {
            console.error("Error:", event);
            this.socket.close();
        };
    }

    onMessage() {
        this.socket.onmessage = (event) => {
            const jsonData = JSON.parse(event.data);
            const data = jsonData["data"];

            switch (data.event) {
                case "host_true":
                    this.game.isHost = true;
                    break;
                case "host_false":
                    this.game.isHost = false;
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
                case "update_user_data":
                    console.log("username: ", data.username);
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
                    break;
                case "start":
                    this.updateUserData();
                    this.game.status = COUNTDOWN;
                    this.game.startTime = Date.now();
                    break;
                case "end":
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
    }

    updateUserData() {
        const message = {
            event: "update_user_data",
            team: this.game.team,
            paddle_level: this.game.paddleLevel,
            username: this.game.username,
            avatar: this.game.avatar,
        };

        this.socket.send(JSON.stringify(message));
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

        this.socket.send(JSON.stringify(message));
    }

    updateScore() {
        const message = {
            event: "update_score",
            team: this.game.team,
            score_player: this.game.player.score.value,
            score_opponent: this.game.opponent.score.value,
        };

        this.socket.send(JSON.stringify(message));
    }

    updateBall() {
        const message = {
            event: "update_ball",
            team: this.game.team,
            ball_x: this.game.ball.x,
            ball_y: this.game.ball.y,
        };

        this.socket.send(JSON.stringify(message));
    }
}
