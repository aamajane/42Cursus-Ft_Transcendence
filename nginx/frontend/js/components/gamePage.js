class GamePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                custom-game {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    overflow: hidden;
                }
        
                .pong-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    // background-color: rgba(0, 0, 0, 0);
                    // background-image: url('../../../app/assets/images/tournamentGate/ground.svg');
                    // background-size: 100px 100px;
                    perspective: 1000px;
                    overflow: hidden;
                }
        
                .pong-container {
                    position: relative;
                    width: 900px;
                    height: 1200px;
                    animation: cameraTransition 5s;
                    border: 5px solid #00FFFF;
                    // transform-style: preserve-3d;
                }
        
                .pong {
                    position: absolute;
                    width: 900px;
                    height: 2100px;
                    transform: perspective(1000px) rotateX(35deg) translateY(-1055px) translateZ(-340px) scaleX(1.03);
                }
        
                @keyframes cameraTransition {
                    0% {
                        transform: perspective(1000px) translateZ(-1000px);
                    }
                }
                .sides {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: url('../../../app/assets/images/tournamentGate/ground.svg');
                    background-size: 100px 100px;
                    z-index: 10;
                }
                .sides#up, .sides#down {
                    background-size: 300px 300px;
                }
                #up {
                    top: 0;
                    left: 0;
                    transform: perspective(1000px)  translateY(-100%) rotateX(-133.5deg);
                    transform-origin: bottom;
                }
                #down {
                    bottom: 0;
                    left: 0;
                    transform: perspective(1000px)  translateY(100%) rotateX(133.5deg);
                    transform-origin: top;
                }
                #left {
                    top: 0;
                    left: 0;
                    transform: perspective(1000px)  translateX(-100%) rotateY(80deg);
                    transform-origin: right;
                }
                #right {
                    top: 0;
                    right: 0;
                    transform: perspective(1000px)  translateX(100%) rotateY(-80deg);
                    transform-origin: left;
                }
            </style>
            <div class="custom-game">
                <div class="pong-wrapper">
                    <div id="pong-container" class="pong-container">
                        <canvas id="pong" class="pong"></canvas>
                        <div id="up" class="sides"></div>
                        <div id="down" class="sides"></div>
                        <div id="left" class="sides"></div>
                        <div id="right" class="sides"></div>
                    </div>
                </div>
                <img src="../../app/assets/images/game/egypt_background.webp" id="egypt_background" style="display: none;">
                <img src="../../app/assets/images/game/egypt_player_paddle.webp" id="egypt_player_paddle" style="display: none;">
                <img src="../../app/assets/images/game/egypt_opponent_paddle.webp" id="egypt_opponent_paddle" style="display: none;">

                <img src="../../app/assets/images/game/factory_background.webp" id="factory_background" style="display: none;">
                <img src="../../app/assets/images/game/factory_player_paddle.webp" id="factory_player_paddle" style="display: none;">
                <img src="../../app/assets/images/game/factory_opponent_paddle.webp" id="factory_opponent_paddle" style="display: none;">

                <img src="../../app/assets/images/game/space_background.webp" id="space_background" style="display: none;">
                <img src="../../app/assets/images/game/space_player_paddle.webp" id="space_player_paddle" style="display: none;">
                <img src="../../app/assets/images/game/space_opponent_paddle.webp" id="space_opponent_paddle" style="display: none;">

                <img src="../../app/assets/images/game/ball_0.webp" id="ball_0" style="display: none;">
                <img src="../../app/assets/images/game/ball_1.webp" id="ball_1" style="display: none;">
                <img src="../../app/assets/images/game/ball_2.webp" id="ball_2" style="display: none;">
                <img src="../../app/assets/images/game/ball_3.webp" id="ball_3" style="display: none;">
                <img src="../../app/assets/images/game/ball_4.webp" id="ball_4" style="display: none;">
                <img src="../../app/assets/images/game/ball_5.webp" id="ball_5" style="display: none;">
                <img src="../../app/assets/images/game/ball_6.webp" id="ball_6" style="display: none;">
                <img src="../../app/assets/images/game/ball_7.webp" id="ball_7" style="display: none;">
                <img src="../../app/assets/images/game/ball_8.webp" id="ball_8" style="display: none;">
                <img src="../../app/assets/images/game/ball_9.webp" id="ball_9" style="display: none;">
                <img src="../../app/assets/images/game/ball_10.webp" id="ball_10" style="display: none;">
                <img src="../../app/assets/images/game/ball_11.webp" id="ball_11" style="display: none;">
                <img src="../../app/assets/images/game/ball_12.webp" id="ball_12" style="display: none;">
                <img src="../../app/assets/images/game/ball_13.webp" id="ball_13" style="display: none;">
                <img src="../../app/assets/images/game/ball_14.webp" id="ball_14" style="display: none;">

                <img src="../../app/assets/images/game/ai_avatar.webp" id="ai_avatar" style="display: none;">
            <div>
        `;

        startGame();
    }
}

customElements.define("custom-game", GamePage);

function createGamePage() {
    const div = document.createElement("div");
    const gamePage = document.createElement("custom-game");

    gamePage.id = "custom-game";

    div.appendChild(gamePage);
    div.setAttribute("class", "page homePage");
    document.body.appendChild(div);
}
