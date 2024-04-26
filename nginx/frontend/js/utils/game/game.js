class AIGame {
    constructor(map) {
        this.startTime = Date.now();
        this.status = COUNTDOWN;
        this.nickname = context.user.nickname;
        this.avatar = context.user.avatarUrl;
        this.ai = new AI(this, OPPONENT_LEFT_KEY, OPPONENT_RIGHT_KEY);
        this.player = {
            paddle: new Paddle(
                map.playerPaddleImage,
                PLAYER_PADDLE_X,
                PLAYER_PADDLE_Y,
                PLAYER_LEFT_KEY,
                PLAYER_RIGHT_KEY
            ),
            score: new Score(PLAYER_SCORE_X, PLAYER_SCORE_Y, map),
            nickname: new Nickname(
                this.nickname,
                PLAYER1_NAME_X,
                PLAYER1_NAME_Y,
                map
            ),
            avatar: new Avatar(
                this.avatar,
                PLAYER1_AVATAR_X,
                PLAYER1_AVATAR_Y,
                map
            ),
        };
        this.opponent = {
            paddle: new Paddle(
                map.opponentPaddleImage,
                OPPONENT_PADDLE_X,
                OPPONENT_PADDLE_Y,
                OPPONENT_LEFT_KEY,
                OPPONENT_RIGHT_KEY
            ),
            score: new Score(OPPONENT_SCORE_X, OPPONENT_SCORE_Y, map),
            nickname: new Nickname(
                "BOT",
                OPPONENT1_NAME_X,
                OPPONENT1_NAME_Y,
                map
            ),
            avatar: new Avatar(
                AVATAR_URL,
                OPPONENT1_AVATAR_X,
                OPPONENT1_AVATAR_Y,
                map
            ),
        };
        this.ball = new Ball(
            map.ballImage,
            this.player.paddle,
            null,
            this.opponent.paddle,
            null
        );
    }

    update() {
        this.ai.update();
        this.player.paddle.update();
        this.opponent.paddle.update();
        this.ball.update();

        if (this.ball.bottom < 0) {
            this.player.score.update();
            this.ai.reset();
            this.ball.reset();
        } else if (this.ball.top > GAME_HEIGHT) {
            this.opponent.score.update();
            this.ai.reset();
            this.ball.reset();
        }

        if (
            this.player.score.value === WINNING_SCORE ||
            this.opponent.score.value === WINNING_SCORE
        ) {
            this.status = OVER;
        }
    }

    draw(ctx) {
        this.opponent.paddle.height += 30;

        this.player.score.draw(ctx);
        this.opponent.score.draw(ctx);
        this.player.nickname.draw(ctx);
        this.opponent.nickname.draw(ctx);
        this.player.avatar.draw(ctx);
        this.opponent.avatar.draw(ctx);
        this.opponent.paddle.draw(ctx);
        this.ball.draw(ctx);
        this.player.paddle.draw(ctx);

        this.opponent.paddle.height -= 30;
    }
}

class MultiplayerGame {
    constructor(id, mode, map) {
        this.id = id;
        this.mode = mode;
        this.startTime = null;
        this.status = PENDING;
        this.isHost = false;
        this.team = 0;
        this.paddleLevel = 0;
        this.username = context.user.name;
        this.nickname = context.user.nickname;
        this.avatar = context.user.avatarUrl;
        this.player = {
            paddle1: new Paddle(
                map.playerPaddleImage,
                mode === TWO_VS_TWO ? PLAYER_PADDLE1_X : PLAYER_PADDLE_X,
                mode === TWO_VS_TWO ? PLAYER_PADDLE1_Y : PLAYER_PADDLE_Y,
                PLAYER_LEFT_KEY,
                PLAYER_RIGHT_KEY
            ),
            ...(mode === TWO_VS_TWO && {
                paddle2: new Paddle(
                    map.playerPaddleImage,
                    PLAYER_PADDLE2_X,
                    PLAYER_PADDLE2_Y,
                    PLAYER_LEFT_KEY,
                    PLAYER_RIGHT_KEY
                ),
            }),
            score: new Score(PLAYER_SCORE_X, PLAYER_SCORE_Y, map),
            username1: null,
            username2: null,
            nickname1: new Nickname(null, PLAYER1_NAME_X, PLAYER1_NAME_Y, map),
            ...(mode === TWO_VS_TWO && {
                nickname2: new Nickname(
                    null,
                    PLAYER2_NAME_X,
                    PLAYER2_NAME_Y,
                    map
                ),
            }),
            avatar1: new Avatar(
                AVATAR_URL,
                PLAYER1_AVATAR_X,
                PLAYER1_AVATAR_Y,
                map
            ),
            ...(mode === TWO_VS_TWO && {
                avatar2: new Avatar(
                    AVATAR_URL,
                    PLAYER2_AVATAR_X,
                    PLAYER2_AVATAR_Y,
                    map
                ),
            }),
        };
        this.opponent = {
            paddle1: new Paddle(
                map.opponentPaddleImage,
                mode === TWO_VS_TWO ? OPPONENT_PADDLE1_X : OPPONENT_PADDLE_X,
                mode === TWO_VS_TWO ? OPPONENT_PADDLE1_Y : OPPONENT_PADDLE_Y,
                null,
                null
            ),
            ...(mode === TWO_VS_TWO && {
                paddle2: new Paddle(
                    map.opponentPaddleImage,
                    OPPONENT_PADDLE2_X,
                    OPPONENT_PADDLE2_Y,
                    null,
                    null
                ),
            }),
            score: new Score(OPPONENT_SCORE_X, OPPONENT_SCORE_Y, map),
            username1: null,
            username2: null,
            nickname1: new Nickname(
                null,
                OPPONENT1_NAME_X,
                OPPONENT1_NAME_Y,
                map
            ),
            ...(mode === TWO_VS_TWO && {
                nickname2: new Nickname(
                    null,
                    OPPONENT2_NAME_X,
                    OPPONENT2_NAME_Y,
                    map
                ),
            }),
            avatar1: new Avatar(
                AVATAR_URL,
                OPPONENT1_AVATAR_X,
                OPPONENT1_AVATAR_Y,
                map
            ),
            ...(mode === TWO_VS_TWO && {
                avatar2: new Avatar(
                    AVATAR_URL,
                    OPPONENT2_AVATAR_X,
                    OPPONENT2_AVATAR_Y,
                    map
                ),
            }),
        };
        this.ball = new Ball(
            map.ballImage,
            this.player.paddle1,
            mode === TWO_VS_TWO ? this.player.paddle2 : null,
            this.opponent.paddle1,
            mode === TWO_VS_TWO ? this.opponent.paddle2 : null
        );
        this.socket = new Socket(this);
    }

    update() {
        this.player.paddle1.update();
        this.player.paddle2?.update();
        this.opponent.paddle1.update();
        this.opponent.paddle2?.update();

        if (
            this.player.paddle1.isMoving === true ||
            this.player.paddle2?.isMoving === true
        ) {
            this.socket.updatePaddle();
        }

        if (this.isHost === true) {
            this.ball.update();
            this.socket.updateBall();

            if (this.ball.bottom < 0) {
                this.player.score.update();
                this.socket.updateScore();
                this.ball.reset();
            } else if (this.ball.top > GAME_HEIGHT) {
                this.opponent.score.update();
                this.socket.updateScore();
                this.ball.reset();
            }

            if (
                this.player.score.value === WINNING_SCORE ||
                this.opponent.score.value === WINNING_SCORE ||
                Math.abs(this.player.score.value - this.opponent.score.value) === MAX_DIF_SCORE
            ) {
                this.status = OVER;
                this.socket.GameOver();
            }
        }
    }

    draw(ctx) {
        this.opponent.paddle1.height += 30;
        if (this.opponent.paddle2) this.opponent.paddle2.height += 30;

        this.player.score.draw(ctx);
        this.opponent.score.draw(ctx);
        this.player.nickname1.draw(ctx);
        this.player.nickname2?.draw(ctx);
        this.opponent.nickname1.draw(ctx);
        this.opponent.nickname2?.draw(ctx);
        this.player.avatar1.draw(ctx);
        this.player.avatar2?.draw(ctx);
        this.opponent.avatar1.draw(ctx);
        this.opponent.avatar2?.draw(ctx);
        this.opponent.paddle1.draw(ctx);
        this.opponent.paddle2?.draw(ctx);
        this.ball.draw(ctx);
        this.player.paddle1.draw(ctx);
        this.player.paddle2?.draw(ctx);

        this.opponent.paddle1.height -= 30;
        if (this.opponent.paddle2) this.opponent.paddle2.height -= 30;
    }
}
