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
                    box-sizing: border-box;
                    overflow: hidden;
                }
        
                .pong-wrapper {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: fit-content;
                    height: fit-content;
                    left: 50%;
                    transform: translateX(-50%);
                    overflow: hidden;
                }
        
                .pong-container {
                    position: relative;
                    width: 900px;
                    height: 1200px;
                    animation: cameraTransition 5s;
                    box-shadow: 0 0 100px 10px black inset,
                                50px 0 100px 10px black inset,
                                -50px 0 100px 10px black inset,
                                0 0 10px 10px black inset;
                    overflow: hidden;
                }
        
                .pong {
                    position: absolute;
                    width: 900px;
                    height: 2100px;
                    transform: perspective(1000px) rotateX(35deg) translateY(-1055px) translateZ(-340px) scaleX(1.03);
                }
        
                @keyframes cameraTransition {
                    0% {
                        transform: perspective(1000px) translateZ(1000px) translateY(-100px)
                    }
                }

                @media (max-width: 768px) {
                    .pong-wrapper {
                        transform: scale(0.5) translateX(-100%) translateY(-50%);
                    }
                }
            </style>
            <div class="custom-game">
                <div class="pong-wrapper">
                    <div id="pong-container" class="pong-container">
                        <canvas id="pong" class="pong"></canvas>
                    </div>
                </div>
                <img src="https://localhost/assets/images/game/egypt_background.webp" id="egypt_background" style="display: none;">
                <img src="https://localhost/assets/images/game/egypt_player_paddle.webp" id="egypt_player_paddle" style="display: none;">
                <img src="https://localhost/assets/images/game/egypt_opponent_paddle.webp" id="egypt_opponent_paddle" style="display: none;">

                <img src="https://localhost/assets/images/game/factory_background.webp" id="factory_background" style="display: none;">
                <img src="https://localhost/assets/images/game/factory_player_paddle.webp" id="factory_player_paddle" style="display: none;">
                <img src="https://localhost/assets/images/game/factory_opponent_paddle.webp" id="factory_opponent_paddle" style="display: none;">

                <img src="https://localhost/assets/images/game/space_background.webp" id="space_background" style="display: none;">
                <img src="https://localhost/assets/images/game/space_player_paddle.webp" id="space_player_paddle" style="display: none;">
                <img src="https://localhost/assets/images/game/space_opponent_paddle.webp" id="space_opponent_paddle" style="display: none;">

                <img src="https://localhost/assets/images/game/ball_0.webp" id="ball_0" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_1.webp" id="ball_1" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_2.webp" id="ball_2" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_3.webp" id="ball_3" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_4.webp" id="ball_4" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_5.webp" id="ball_5" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_6.webp" id="ball_6" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_7.webp" id="ball_7" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_8.webp" id="ball_8" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_9.webp" id="ball_9" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_10.webp" id="ball_10" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_11.webp" id="ball_11" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_12.webp" id="ball_12" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_13.webp" id="ball_13" style="display: none;">
                <img src="https://localhost/assets/images/game/ball_14.webp" id="ball_14" style="display: none;">

                <img src="https://localhost/assets/images/game/ai_avatar.webp" id="ai_avatar" style="display: none;">
            <div>
        `;

        const imageElements = [
            "egypt_background", "egypt_player_paddle", "egypt_opponent_paddle",
            "factory_background", "factory_player_paddle", "factory_opponent_paddle",
            "space_background", "space_player_paddle", "space_opponent_paddle",
            "ball_0", "ball_1", "ball_2", "ball_3", "ball_4", "ball_5", "ball_6", "ball_7", "ball_8", "ball_9", "ball_10", "ball_11", "ball_12", "ball_13", "ball_14", "ai_avatar"
        ];
    
        let loadedResources = 0;
    
        const checkAllResourcesLoaded = () => {
            loadedResources++;
            if (loadedResources === imageElements.length) {
                startGame();
            }
        };
    
        imageElements.forEach(imageId => {
            const image = this.shadowRoot.getElementById(imageId);
            if (image) {
                image.addEventListener("load", checkAllResourcesLoaded);
            }
        });
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
