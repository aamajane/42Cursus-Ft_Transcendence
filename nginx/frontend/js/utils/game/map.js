class Map {
    constructor(map) {
        const shadowRoot = document.getElementById("custom-game").shadowRoot;
        this.backgroundImage = shadowRoot.getElementById(`${map}_background`);
        this.playerPaddleImage = shadowRoot.getElementById(
            `${map}_player_paddle`
        );
        this.opponentPaddleImage = shadowRoot.getElementById(
            `${map}_opponent_paddle`
        );

        this.ballImage = [];
        for (let i = 0; i <= 14; i++) {
            this.ballImage.push(shadowRoot.getElementById(`ball_${i}`));
        }

        switch (map) {
            case "egypt":
                this.ballColor = { r: 1, g: 0.5, b: 0.5 };
                for (let i = 0; i <= 14; i++) {
                    this.ballImage[i] = changeImageColor(this.ballImage[i], this.ballColor);
                }

                this.waitingFont = EGYPT_WAITING_FONT;
                this.countdownFont = EGYPT_COUNTDOWN_FONT;
                this.overFont = EGYPT_OVER_FONT;
                this.scoreFont = EGYPT_SCORE_FONTS;
                this.nicknameFont = EGYPT_NICKNAME_FONT;
                this.fillStyle = EGYPT_FILL_STYLE;
                this.strokeStyle = EGYPT_STROKE_STYLE;
                this.scoreLineWidth = EGYPT_SCORE_LINE_WIDTH;
                this.nicknameLineWidth = EGYPT_NICKNAME_LINE_WIDTH;
                break;
            case "factory":
                this.ballColor = { r: 0.9, g: 0.9, b: 0.9 };
                for (let i = 0; i <= 14; i++) {
                    this.ballImage[i] = changeImageColor(this.ballImage[i], this.ballColor);
                }

                this.waitingFont = FACTORY_WAITING_FONT;
                this.countdownFont = FACTORY_COUNTDOWN_FONT;
                this.overFont = FACTORY_OVER_FONT;
                this.scoreFont = FACTORY_SCORE_FONTS;
                this.nicknameFont = FACTORY_NICKNAME_FONT;
                this.fillStyle = FACTORY_FILL_STYLE;
                this.strokeStyle = FACTORY_STROKE_STYLE;
                this.scoreLineWidth = FACTORY_SCORE_LINE_WIDTH;
                this.nicknameLineWidth = FACTORY_NICKNAME_LINE_WIDTH;
                break;
            case "space":
                this.ballColor = { r: 0, g: 1, b: 1 };
                for (let i = 0; i <= 14; i++) {
                    this.ballImage[i] = changeImageColor(this.ballImage[i], this.ballColor);
                }

                this.waitingFont = SPACE_WAITING_FONT;
                this.countdownFont = SPACE_COUNTDOWN_FONT;
                this.overFont = SPACE_OVER_FONT;
                this.scoreFont = SPACE_SCORE_FONTS;
                this.nicknameFont = SPACE_NICKNAME_FONT;
                this.fillStyle = SPACE_FILL_STYLE;
                this.strokeStyle = SPACE_STROKE_STYLE;
                this.scoreLineWidth = SPACE_SCORE_LINE_WIDTH;
                this.nicknameLineWidth = SPACE_NICKNAME_LINE_WIDTH;
                break;
        }
    }
}
