import { AI } from "./ai.js";
import { Socket } from "./socket.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";
import { Ball } from "./ball.js";

export class AIGame {
    constructor(map) {
        this.startTime = Date.now();
        this.status = COUNTDOWN;
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

        if (this.player.score.value === WINNING_SCORE) {
            this.status = "You Win";
        } else if (this.opponent.score.value === WINNING_SCORE) {
            this.status = "You Lose";
        }
    }

    draw(context) {
        this.opponent.paddle.height += 30;

        this.player.score.draw(context);
        this.opponent.score.draw(context);
        this.opponent.paddle.draw(context);
        this.ball.draw(context);
        this.player.paddle.draw(context);

        this.opponent.paddle.height -= 30;
    }
}

export class MultiplayerGame {
    constructor(id, mode, map) {
        this.startTime = null;
        this.status = PENDING;
        this.isHost = false;
        this.team = 0;
        this.paddleLevel = 0;
        this.mode = mode;
        this.id = id;
        this.socket = new Socket(this);
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
        };
        this.ball = new Ball(
            map.ballImage,
            map.ballColor,
            this.player.paddle1,
            mode === TWO_VS_TWO ? this.player.paddle2 : null,
            this.opponent.paddle1,
            mode === TWO_VS_TWO ? this.opponent.paddle2 : null
        );
    }

    update() {
        this.player.paddle1.update();
        if (this.player.paddle2) this.player.paddle2.update();
        this.opponent.paddle1.update();
        if (this.opponent.paddle2) this.opponent.paddle2.update();

        if (
            this.player.paddle1.isMoving === true ||
            (this.player.paddle2 && this.player.paddle2.isMoving === true)
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
        }

        if (this.player.score.value === WINNING_SCORE) {
            this.status = "You Win";
        } else if (this.opponent.score.value === WINNING_SCORE) {
            this.status = "You Lose";
        }
    }

    draw(context) {
        this.opponent.paddle1.height += 30;
        if (this.opponent.paddle2) this.opponent.paddle2.height += 30;

        this.player.score.draw(context);
        this.opponent.score.draw(context);
        this.opponent.paddle1.draw(context);
        if (this.opponent.paddle2) this.opponent.paddle2.draw(context);
        this.ball.draw(context);
        this.player.paddle1.draw(context);
        if (this.player.paddle2) this.player.paddle2.draw(context);

        this.opponent.paddle1.height -= 30;
        if (this.opponent.paddle2) this.opponent.paddle2.height -= 30;
    }
}
