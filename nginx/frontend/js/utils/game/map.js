class Map {
    constructor(map) {
        const shadowRoot = document.getElementById("custom-game").shadowRoot;
        this.backgroundImage = shadowRoot.getElementById(`${map}_background`);
        this.playerPaddleImage = shadowRoot.getElementById(`${map}_player_paddle`);
        this.opponentPaddleImage = shadowRoot.getElementById(`${map}_opponent_paddle`);

        this.ballImage = [];
        for (let i = 0; i <= 14; i++) {
            this.ballImage.push(shadowRoot.getElementById(`ball_${i}`));
        }

        switch (map) {
            case "egypt":
                this.ballColor = { r: 1, g: 0.5, b: 0.5 };
                break;
            case "factory":
                this.ballColor = { r: 0.9, g: 0.9, b: 0.9 };
                break;
            case "space":
                this.ballColor = { r: 0, g: 1, b: 1 };
                break;
        }
    }
}
