
class GamePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                game-body {
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
                    background-color: rgb(0, 0, 0);
                }
        
                .pong-container {
                    position: relative;
                    width: 900px;
                    height: 1200px;
                    animation: cameraTransition 5s;
                }
        
                .pong {
                    position: absolute;
                    width: 900px;
                    height: 2100px;
                    transform: perspective(1000px) rotateX(35deg) translateY(-1055px) translateZ(-340px) scaleX(1.03);
                }
        
                @keyframes cameraTransition {
                    0% {
                        transform: perspective(1000px) translateY(-80px) translateZ(1000px) rotateX(-25deg) scaleX(0.5);
                    }
                }
            </style>
            <div class="game-body">
                <div class="pong-wrapper">
                    <div id="pong-container" class="pong-container">
                        <canvas id="pong" class="pong" data-game-id="123" data-game-mode="ai" data-game-map="factory"></canvas>
                    </div>
                </div>

                <img src="../app/assets/images/game/egypt_background.webp" id="egypt_background" style="display: none;">
                <img src="../app/assets/images/game/egypt_player_paddle.webp" id="egypt_player_paddle" style="display: none;">
                <img src="../app/assets/images/game/egypt_opponent_paddle.webp" id="egypt_opponent_paddle" style="display: none;">

                <img src="../app/assets/images/game/factory_background.webp" id="factory_background" style="display: none;">
                <img src="../app/assets/images/game/factory_player_paddle.webp" id="factory_player_paddle" style="display: none;">
                <img src="../app/assets/images/game/factory_opponent_paddle.webp" id="factory_opponent_paddle" style="display: none;">

                <img src="../app/assets/images/game/space_background.webp" id="space_background" style="display: none;">
                <img src="../app/assets/images/game/space_player_paddle.webp" id="space_player_paddle" style="display: none;">
                <img src="../app/assets/images/game/space_opponent_paddle.webp" id="space_opponent_paddle" style="display: none;">

                <img src="../app/assets/images/game/ball_0.webp" id="ball_0" style="display: none;">
                <img src="../app/assets/images/game/ball_1.webp" id="ball_1" style="display: none;">
                <img src="../app/assets/images/game/ball_2.webp" id="ball_2" style="display: none;">
                <img src="../app/assets/images/game/ball_3.webp" id="ball_3" style="display: none;">
                <img src="../app/assets/images/game/ball_4.webp" id="ball_4" style="display: none;">
                <img src="../app/assets/images/game/ball_5.webp" id="ball_5" style="display: none;">
                <img src="../app/assets/images/game/ball_6.webp" id="ball_6" style="display: none;">
                <img src="../app/assets/images/game/ball_7.webp" id="ball_7" style="display: none;">
                <img src="../app/assets/images/game/ball_8.webp" id="ball_8" style="display: none;">
                <img src="../app/assets/images/game/ball_9.webp" id="ball_9" style="display: none;">
                <img src="../app/assets/images/game/ball_10.webp" id="ball_10" style="display: none;">
                <img src="../app/assets/images/game/ball_11.webp" id="ball_11" style="display: none;">
                <img src="../app/assets/images/game/ball_12.webp" id="ball_12" style="display: none;">
                <img src="../app/assets/images/game/ball_13.webp" id="ball_13" style="display: none;">
                <img src="../app/assets/images/game/ball_14.webp" id="ball_14" style="display: none;">
            <div>
        `;

        startGame();
    }
}

customElements.define('game-body', GamePage);

function createGamePage() {
    const div = document.createElement('div');
    const gamePage = document.createElement('game-body');

    gamePage.id = 'game-body';

    div.appendChild(gamePage);
    div.setAttribute('class', 'page homePage');
    document.body.appendChild(div);
}