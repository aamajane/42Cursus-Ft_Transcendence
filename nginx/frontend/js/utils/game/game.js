class AIGame {
    constructor(map) {
        this.startTime = Date.now();
        this.status = COUNTDOWN;
        this.username = context.user.name;
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
            score: new Score(PLAYER_SCORE_X, PLAYER_SCORE_Y),
            username: new Username(
                this.username,
                PLAYER1_NAME_X,
                PLAYER1_NAME_Y
            ),
            avatar: new Avatar(this.avatar, PLAYER1_AVATAR_X, PLAYER1_AVATAR_Y),
        };
        this.opponent = {
            paddle: new Paddle(
                map.opponentPaddleImage,
                OPPONENT_PADDLE_X,
                OPPONENT_PADDLE_Y,
                OPPONENT_LEFT_KEY,
                OPPONENT_RIGHT_KEY
            ),
            score: new Score(OPPONENT_SCORE_X, OPPONENT_SCORE_Y),
            username: new Username("BOT", OPPONENT1_NAME_X, OPPONENT1_NAME_Y),
            avatar: new Avatar(
                AVATAR_URL,
                OPPONENT1_AVATAR_X,
                OPPONENT1_AVATAR_Y
            ),
        };
        this.ball = new Ball(
            map.ballImage,
            map.ballColor,
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
        this.player.username.draw(ctx);
        this.opponent.username.draw(ctx);
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
            score: new Score(PLAYER_SCORE_X, PLAYER_SCORE_Y),
            username1: new Username(null, PLAYER1_NAME_X, PLAYER1_NAME_Y),
            ...(mode === TWO_VS_TWO && {
                username2: new Username(null, PLAYER2_NAME_X, PLAYER2_NAME_Y),
            }),
            avatar1: new Avatar(AVATAR_URL, PLAYER1_AVATAR_X, PLAYER1_AVATAR_Y),
            ...(mode === TWO_VS_TWO && {
                avatar2: new Avatar(
                    AVATAR_URL,
                    PLAYER2_AVATAR_X,
                    PLAYER2_AVATAR_Y
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
            score: new Score(OPPONENT_SCORE_X, OPPONENT_SCORE_Y),
            username1: new Username(null, OPPONENT1_NAME_X, OPPONENT1_NAME_Y),
            ...(mode === TWO_VS_TWO && {
                username2: new Username(
                    null,
                    OPPONENT2_NAME_X,
                    OPPONENT2_NAME_Y
                ),
            }),
            avatar1: new Avatar(
                AVATAR_URL,
                OPPONENT1_AVATAR_X,
                OPPONENT1_AVATAR_Y
            ),
            ...(mode === TWO_VS_TWO && {
                avatar2: new Avatar(
                    AVATAR_URL,
                    OPPONENT2_AVATAR_X,
                    OPPONENT2_AVATAR_Y
                ),
            }),
        };
        this.ball = new Ball(
            map.ballImage,
            map.ballColor,
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
                Math.abs(this.player.score.value - this.opponent.score.value) > MAX_DIF_SCORE
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
        this.player.username1.draw(ctx);
        this.player.username2?.draw(ctx);
        this.opponent.username1.draw(ctx);
        this.opponent.username2?.draw(ctx);
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
