class TournamentGate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.__game1p1 = 0;
        this.__game1p2 = 0;
        this.__game2p1 = 0;
        this.__game2p2 = 0;
        this.__game3p1 = 0;
        this.__game3p2 = 0;
        this.__game1Winner = -1;
        this.__game2Winner = -1;
        this.__game3Winner = -1;
        this.__game3Start = false;
        this.__game3End = false;
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const id = this.getAttribute('id');
        this.shadowRoot.innerHTML = `
        <style>
            * {
                font-family: "Share Tech", sans-serif;
            }
            .tournamentGate {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #000;
                color: #fff;
                background-image: url('../app/assets/images/tournamentGate/bg.jpeg');
                background-size: cover;
                perspective: 1000px;
                animation: start 4s linear forwards;
            }
            .tournamentGate > img {
                position: absolute;
                width: 100%;
                height: 100%;
                transform: rotate(180deg);
                opacity: 0.4;
                animation: showBgFlow 4s linear forwards;
            }
            @keyframes showBgFlow {
                0% {
                    transform: rotate(180deg) scale(0);
                }
                99% {
                    transform: rotate(180deg) scale(0);
                }
                100% {
                    transform: rotate(180deg) scale(1);
                }
            }
            @keyframes start {
                0% {
                    background-size: 100% 150%;
                    background-position: 50% 100%;
                }
                20% {
                    background-size: 100% 150%;
                    background-position: 50% 0%;
                }
                100% {
                    background-size: 100% 150%;
                    background-position: 50% 50%;
                }
            }
            .tournamentGate__content {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
            }
            .tournamentGate__content__wrapper {
                position: absolute;
                left: 50%;
                height: 2000px;
                min-width: 2000px;
                display: flex;
                justify-content: center;
                align-items: center;
                transform-style: preserve-3d;
                transform: rotateX(60deg) translateZ(300px) translateY(-15%) translateX(-50%);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                background-color: #000;
                animation: entrance 4s linear forwards;
            }
            @keyframes entrance {
                0% {
                    transform: rotateX(40deg) translateZ(-1000px) translateY(-140%) translateX(-50%);
                }
                30% {
                    transform: rotateX(80deg) translateZ(0px) translateY(-110%) translateX(-50%);
                }
                90% {
                    transform: rotateX(60deg) translateZ(300px) translateY(-15%) translateX(-50%);
                }
                100% {
                    transform: rotateX(65deg) translateZ(360px) translateY(-8%) translateX(-50%);
                }
            }
            .tournamentGate__content__wrapper:nth-child(2) {
                transform: rotateX(60deg) translateZ(0px) translateY(50%) translateX(-50%);
            }
            .leftBg {
                position: absolute; 
                left: -50%;
                top: 0;
                width: 40%;
                height: 100%;
                transform: rotateY(-90deg) translateX(50%) translateZ(-600px);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
            }
            .rightBg {
                position: absolute;
                right: -50%;
                top: 0;
                width: 40%;
                height: 100%;
                transform: rotateY(90deg) translateX(-50%) translateZ(-600px);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
            }
            .topBg {
                position: absolute;
                left: 0;
                top: -20%;
                width: 100%;
                height: 40%;
                display: flex;
                justify-content: center;
                align-items: end;
                transform: rotateX(-90deg) translateY(-50%);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
            }
            .screen {
                position: relative;
                width: calc(90% - 10px);
                height: 70%;
                display: flex;
                background-color: #035;
                transform: translateY(-30px);
                border: 5px solid #44FFFF;
            }
            .screenTopBg {
                position: absolute;
                width: 100%;
                height: 50%;
                top: 0;
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                background-position: bottom left;
                animation: bgOpen 1s linear forwards 4s;
            }
            .screenBottomBg {
                position: absolute;
                width: 100%;
                height: 50%;
                bottom: 0;
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                animation: bgOpen 1s linear forwards 4s;
            }
            @keyframes bgOpen {
                100% {
                    height: 0;
                }
            }
            .screenTopBg2 {
                position: absolute;
                width: 100%;
                height: 20%;
                top: 0;
                background: linear-gradient(rgba(0,0,0,0) 0%, #035 100%);
                z-index: -1;
            }
            .screenBottomBg2 {
                position: absolute;
                width: 100%;
                height: 20%;
                bottom: 0;
                background: linear-gradient(#035 0%, rgba(0,0,0,0) 100%); 
                z-index: -1;
            }
            .screenTopBg3 {
                position: absolute;
                width: 100%;
                height: 20%;
                top: 0;
                background: linear-gradient(#0354, #0af4, #0ff4, #0f04, rgba(0,0,0,0));
                background-size: 100% 6px;
                z-index: -2;
                animation: animateBg3 3s linear infinite;
            }
            .screenBottomBg3 {
                position: absolute;
                width: 100%;
                height: 20%;
                bottom: 0;
                background-image: linear-gradient(rgba(0,0,0,0), #0af4, #0ff4, #0f04, #0354); 
                background-size: 100% 6px;
                z-index: -2;
                animation: animateBg3 3s linear infinite reverse;
            }
            @keyframes animateBg3 {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 0 100%;
                }
            }
            .upBg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 2000px;
                display: flex;
                justify-content: center;
                align-items: end;
                transform: translateZ(800px);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                transform-style: preserve-3d;
            }
            .upBg .osgardBg {
                position: absolute;
                bottom: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                transform: translateY(50%) rotateX(-90deg) translateY(-30%);
                // transform: translateY(50%) rotateX(90deg) translateY(-50%);
            }
            .upBg .door {
                transform: translateY(51%) rotateX(-90deg) translateY(55%) scale(1.1);
                filter: drop-shadow(0 0 50px #edd136) hue-rotate(110deg) saturate(1000%);
            }
            .frontBg {
                position: absolute;
                left: 0;
                top: -20%;
                width: 100%;
                height: 40%;
                display: flex;
                justify-content: center;
                align-items: end;
                transform: rotateX(-90deg) translateY(-50%) translateZ(2000px);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                clip-path: path('M0,0 L600,0 L1000,0 L850,100 L750,200 L750,400 L850,500 L1000,500 L1150,500 L1250,400 L1250,200 L1150,100 L1000,0 L1400,0 L2000,0 L2000,2000 L0,2000 Z');
                transform-style: preserve-3d;
            }
            .frontBg .osgardBg {
                position: absolute;
                bottom: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                transform: rotateX(180deg) translateY(121%);
            }
            .gateBg {
                position: absolute;
                left: 50%;
                top: 0;
                width: 40%;
                height: 2000px;
                background-color: #0009;
                transform: translateZ(300px) translateY(100%) translateX(-50%);
                background-image: url('../app/assets/images/tournamentGate/ground.svg');
                background-size: 100px 100px;
                transform-style: preserve-3d;
            }
            .gateBg span {
                position: absolute;
                width: 100px;
                height: 100%;
                left: 0;
                background-color: #0006;
                transform: translateX(-50%) rotateY(90deg) translateX(-50%);
                border: 5px solid #44FFFF;
            }
            .gateBg span:last-child {
                left: 100%;
                transform: translateX(-50%) rotateY(90deg) translateX(-50%);
            }

            .space {
                position: absolute;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 800px;
                height: 400px;
                background-color: #111a;
                transform-style: preserve-3d;
                transform: translateZ(20px);
            }
            .space1 {
                left: 0;
                top: 20%;
            }
            .space2 {
                right: 0;
                top: 20%;
            }
            .space3 {
                left: 50%;
                bottom: 20%;
                transform: translateX(-50%) translateZ(20px);
            }
            .space4 {
                width: 100px;
                height: 550px;
                left: 350px;
                top: 800px;
                // background-color: #0aa;
            }
            .space5 {
                width: 100px;
                height: 550px;
                right: 350px;
                top: 800px;
                // background-color: #0aa;
            }
            .space6 {
                width: 250px;
                height: 100px;
                left: 350px;
                bottom: 550px;
                // background-color: #0aa;
            }
            .space7 {
                width: 250px;
                height: 100px;
                right: 350px;
                bottom: 550px;
                // background-color: #0aa;
            }
            .space8 {
                width: 200px;
                height: 200px;
                right: 900px;
                top: 900px;
                // background-color: #0aa;
            }
            .space8::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #FFD700aa;
                box-shadow: 0 -10px 50px #FFD700aa,
                            0 10px 50px #fff inset,
                            0 0 50px #FFD700aa inset;
                top: 0;
                left: 0;
            }
            .space9 {
                width: 20px;
                height: 100px;
                right: 50%;
                bottom: 800px;
                transform: translateZ(20px) translateX(50%);
                background: linear-gradient( #FFD700aa, #0aa);
            }
            .corner {
                position: absolute;
                background-color: #aaa9;
                drop-filter: blur(10px);
                border: 1px solid #fff;
            }
            .cornerBottom {
                bottom: 0;
                left: 0;
                box-sizing: border-box;
                width: 100%;
                height: 20px;
                transform: translateY(50%) rotateX(-90deg) translateY(50%);
            }
            .cornerTop {
                top: 0;
                left: 0;
                box-sizing: border-box;
                width: 100%;
                height: 20px;
                transform: translateY(-50%) rotateX(90deg) translateY(-50%);
            }
            .cornerRight {
                bottom: 0;
                right: 0;
                box-sizing: border-box;
                width: 20px;
                height: 100%;
                transform: translateX(50%) rotateY(90deg) translateX(50%);
            }
            .cornerLeft {
                bottom: 0;
                left: 0;
                box-sizing: border-box;
                width: 20px;
                height: 100%;
                transform: translateX(-50%) rotateY(-90deg) translateX(-50%);
            }

            .chair {
                position: relative;
                width: 400px;
                height: 400px;
                border: #0aa 10px solid;
                box-sizing: border-box;
                transform-style: preserve-3d;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .seat {
                position: relative;
                width: 50%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transform-style: preserve-3d;
            }
            .seat img {
                position: absolute;
                width: 100%;
                height: 100%;
                transform: rotateY(180deg);
            }
            .seat #down {
                position: absolute;
                transform: translateZ(100px);
            }
            .seat #side {
                position: absolute;
                height: 50%;
                top: 0;
                transform: translateY(-50%) rotateX(-90deg) translateY(-50%);
            }
            .avatar {
                position: absolute;
                top: 600px;
                height: 100px;
                width: 76px;
                transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px));
                // border: 1px solid #fff;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .avatar1 {
                left: 150px;
            }
            .avatar2 {
                left: 550px;
            }
            .avatar3 {
                right: 550px;
            }
            .avatar4 {
                right: 150px;
            }
            .avatar img {
                position: absolute;
                height: 100%;
                object-fit: cover;
                // top: 100%;
                transition: 1s;
            }
            .avatar img:nth-child(1) {
                clip-path: path('M0,26.5 L38,5 L75,26.5 L75,74  L38,95 L0,74 Z');
            }
            .avatar img:nth-child(2) {
                position: relative;
            }

            .turnLeft {
                animation: turnLeft 1.5s linear forwards;
            }
            .turnRight {
                animation: turnRight 1.5s linear forwards;
            }
            .turnLeftH {
                animation: turnLeftH 1.5s linear forwards;
            }
            .turnRightH {
                animation: turnRightH 1.5s linear forwards;
            }
            .turnLeftH2 {
                animation: turnLeftH2 1.5s linear forwards;
            }
            .turnRightH2 {
                animation: turnRightH2 1.5s linear forwards;
            }
            @keyframes turnLeft {
                100% {
                    transform: rotate(-90deg);
                }
            }
            @keyframes turnRight {
                100% {
                    transform: rotate(90deg);
                }
            }
            @keyframes turnLeftH {
                100% {
                    transform: rotate(0deg);
                }
            }
            @keyframes turnRightH {
                100% {
                    transform: rotate(0deg);
                }
            }
            @keyframes turnLeftH2 {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(-90deg);
                } 
            }
            @keyframes turnRightH2 {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(90deg);
                }
            }
            .space3  .chairLeft .seat {
                transform: rotate(90deg);
            }
            .space3  .chairRight .seat {
                transform: rotate(-90deg);
            }
            .semiFinaleLeft {
                animation: semiFinaleLeftA 5s linear forwards;
            }
            .semiFinaleLeft2 {
                animation: semiFinaleLeftA2 5s linear forwards;
            }
            .semiFinaleRight {
                animation: semiFinaleRightA 5s linear forwards;
            }
            .semiFinaleRight2 {
                animation: semiFinaleRightA2 5s linear forwards;
            }
            @keyframes semiFinaleLeftA {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(0deg);
                }
                30% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg);
                }
                50% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg);
                }
                70% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px);
                }
                80% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(90deg);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(90deg) translateZ(400px);
                }
            }
            @keyframes semiFinaleLeftA2 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(0deg);
                }
                30% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg);
                }
                50% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg);
                }
                70% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px);
                }
                80% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(-90deg);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(-90deg) translateZ(400px);
                }
            }
            @keyframes semiFinaleRightA {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(0deg);
                }
                30% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg);
                }
                50% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg);
                }
                70% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px);
                }
                80% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(90deg);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(90deg) translateZ(400px);
                }
            }
            @keyframes semiFinaleRightA2 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(0deg);
                }
                30% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg);
                }
                50% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg);
                }
                70% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px);
                }
                80% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(-90deg);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(-90deg) translateZ(400px);
                }
            }
            .filterWin {
                filter: drop-shadow(0 0 100px #00FFD1) hue-rotate(300deg) saturate(1000%);
            }
            .filterLost {
                filter: drop-shadow(0 0 50px #00FFD1) hue-rotate(200deg) saturate(1000%);
            }
            .avatarTrun1 {
                animation: avatarTrunA1 1.5s linear forwards;
            }
            .avatarTrun2 {
                animation: avatarTrunA2 1.5s linear forwards;
            }
            .avatarTrun3 {
                animation: avatarTrunA3 1.5s linear forwards;
            }
            .avatarTrun4 {
                animation: avatarTrunA4 1.5s linear forwards;
            }
            @keyframes avatarTrunA1 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(90deg) translateZ(400px);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(90deg) translateZ(400px) rotateY(90deg);
                }
            }
            @keyframes avatarTrunA2 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(90deg) translateZ(400px);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(90deg) translateZ(400px) rotateY(90deg);
                }
            }
            @keyframes avatarTrunA3 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(-90deg) translateZ(400px);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(-90deg) translateZ(800px) rotateY(-90deg) translateZ(400px) rotateY(-90deg);
                }
            }
            @keyframes avatarTrunA4 {
                0% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(-90deg) translateZ(400px);
                }
                100% {
                    transform: translateY(-50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(90deg) translateZ(800px) rotateY(-90deg) translateZ(400px) rotateY(-90deg);
                }
            }
            .FinalWinnerLeft {
                top: 1400px;
                left: 800px;
                animation: FinalWinnerLeft 4.5s linear forwards;
            }
            .FinalWinnerRight {
                top: 1400px;
                right: 800px;
                animation: FinalWinnerRight 4.5s linear forwards;
            }
            @keyframes FinalWinnerLeft {
                0% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px));
                }
                33.33% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg);
                }
                40% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(90deg);
                }
                55% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(90deg) translateZ(400px);
                }
                66.66% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(90deg) translateZ(400px) rotateY(180deg);
                }
                100% {
                    transform:  translate(-50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(90deg) translateZ(200px) rotateY(90deg) translateZ(400px) rotateY(180deg) translateY(-100%);
                }
            }
            @keyframes FinalWinnerRight {
                0% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px));
                }
                33.33% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg);
                }
                40% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(-90deg);
                }
                55% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(-90deg) translateZ(400px);
                }
                66.66% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(-90deg) translateZ(400px) rotateY(-180deg);
                }
                100% {
                    transform:  translate(50%, -50%) rotateX(-90deg) translateY(calc(-50% - 20px)) rotateY(-90deg) translateZ(200px) rotateY(-90deg) translateZ(400px) rotateY(-180deg) translateY(-100%);
                }
            }
            .FinalWinner {
                transition: 2s;
                transform: translateZ(100px);
                transition-delay: 3s;
            }
            .FinalWinner .corner {
                transition: 2s;
                transition-delay: 2.95s;
            }
            .FinalWinner .cornerBottom {
                height: 100px;
            }
            .FinalWinner .cornerTop {
                height: 100px;
            }
            .FinalWinner .cornerRight {
                width: 100px;
            }
            .FinalWinner .cornerLeft {
                width: 100px;
            }
            .FinalWinner9 {
                transition: 1.5s;
                height: 0;
                transition-delay: 3s;
            }
            .Standings {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 50%;
                top: 50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transform: translateY(-50%) translateX(-50%);
                background-color: #fff1;
                box-shadow: 0 0 200px #fff5 inset,
                            0 0 50px #fffa;
                z-index: -1;
                overflow: hidden;
            }
            .StandingsFinal {
                position: relative;
                height: 0%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                display: none;
                animation: scaleY 1s linear forwards;
                border: 1px solid #999;
                box-shadow: 0 0 50px #fffa inset,
                            0 0 50px #fffa;
            }
            @keyframes scaleY {
                0% {
                    scale: 0;
                }
                100% {
                    height: 100%;
                    scale: 1;
                }
            }
            .StandingsSemiFinale {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 1px solid #fff;
            }
            .StandingsSemiFinaleLeft, .StandingsSemiFinaleRight {
                position: relative;
                height: 100%;
                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #999;
                box-shadow: 0 0 50px #fffa inset,
                            0 0 50px #fffa;
                animation: scale 1s linear forwards 5s;
                scale: 0;
            }
            @keyframes scale {
                100% {
                    height: 100%;
                    scale: 1;
                }
            }
            .standing {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .standing > img {
                transform: translateY(-15%);
            }
            .player {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 1px solid #fff;
            }
            .player:first-child {
                justify-content: flex-end;
            }
            .player:last-child {
                justify-content: flex-start;
            }
            .player > img {
                position: absolute;
                object-fit: cover;
            }
            .playerAvatar {
                position: relative;
                width: 100%;
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 1px solid #fff;
            }
            .playerAvatar img {
                position: absolute;
                height: 100%;
                object-fit: cover;
            }
            .plAvatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
                clip-path: path('M0,53 L76,10 L150,53 L150,148  L76,190 L0,148 Z');
                z-index: -1;
            }
            .score {
                position: relative;
                width: 100px;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 80px;
                font-weight: bold;
                color: #fffa;
                // background-color: #0005;
                // border: 1px solid #fff;
            }
            .infs {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .nakeName {
                font-size: 30px;
                font-weight: bold;
                color: #fff;
                text-align: center;
            }
            .Fname {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
                text-align: center;
            }
            #vs {
                position: absolute;
                width: 150px;
                height: 150px;
                object-fit: cover;
                filter: drop-shadow(0 0 10px #fffa) hue-rotate(150deg) saturate(1000%);
                transform: translateY(-20%);
            }
        </style>
        <div class="tournamentGate">
            <img src="../../app/assets/images/tournamentGate/frontGround1.gif" alt="Pong">
            <div class="tournamentGate__content">
                <div class="tournamentGate__content__wrapper">
                    <div class="leftBg"></div>
                    <div class="topBg">
                        <div class="screen">
                            <div class="screenTopBg"></div>
                            <div class="screenBottomBg"></div>
                            <div class="screenTopBg2"></div>
                            <div class="screenBottomBg2"></div>
                            <div class="screenTopBg3"></div>
                            <div class="screenBottomBg3"></div>
                            <div class="Standings">
                                <div class="StandingsFinal">
                                    <div class="standing"></div>
                                </div>
                                <div class="StandingsSemiFinale">
                                    <div class="StandingsSemiFinaleLeft">
                                        <div class="standing"></div>
                                    </div>
                                    <div class="StandingsSemiFinaleRight">
                                        <div class="standing"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rightBg"></div>
                    <div class="upBg">
                        <div class="osgardBg">
                            <img src="../../app/assets/images/tournamentGate/osgard.svg" alt="Pong">
                        </div>
                        <div class="osgardBg door">
                            <img src="../../app/assets/images/tournamentGate/door.png" alt="Pong">
                        </div>
                    </div>
                    <div class="frontBg"> 
                        <div class="osgardBg">
                            <img src="../../app/assets/images/tournamentGate/osgard.svg" alt="Pong">
                        </div>
                    </div>
                    <div class="gateBg">
                        <span></span>
                        <span></span>
                    </div>
                    <div class="avatar avatar1">
                        <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                        <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                    </div>
                    <div class="avatar avatar2">
                        <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                        <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                    </div>
                    <div class="avatar avatar3">
                        <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                        <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                    </div>
                    <div class="avatar avatar4">
                        <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                        <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                    </div>
                </div>
            </div>
        </div>
        `;
        this.shadowRoot.querySelector('.tournamentGate__content__wrapper').innerHTML += `
            ${
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((el, indx) => `
                    <div class="space space${el}">
                        <div class="corner cornerBottom"></div>
                        <div class="corner cornerRight"></div>
                        <div class="corner cornerTop"></div> 
                        <div class="corner cornerLeft"></div>
                        ${
                            indx < 3 &&
                            `<div class="chair chairLeft">
                                <div class="seat">
                                    <img src="../../app/assets/images/tournamentGate/chair.svg" alt="Pong" id="up">
                                    <img src="../../app/assets/images/tournamentGate/chair2.svg" alt="Pong" id="side">
                                    <img src="../../app/assets/images/tournamentGate/chair3.svg" alt="Pong" id="down">
                                </div>
                            </div>
                            <div class="chair chairRight">
                                <div class="seat">
                                    <img src="../../app/assets/images/tournamentGate/chair.svg" alt="Pong" id="up">
                                    <img src="../../app/assets/images/tournamentGate/chair2.svg" alt="Pong" id="side">
                                    <img src="../../app/assets/images/tournamentGate/chair3.svg" alt="Pong" id="down">
                                </div>
                            </div>` ||
                            ''
                        }
                    </div>
                `).join('')
            }
        `;
        this.shadowRoot.querySelectorAll('.standing').forEach(el => {
            el.innerHTML = `
                <div class="player player1">
                    <img>
                    <div class"infs">
                        <div class="playerAvatar">
                            <div class="score">0</div>
                            <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                            <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                        </div>
                        <div class="nakeName">@ael-bekk</div>
                        <div class="Fname">Abdellah El bekkali</div>
                    </div>
                </div>
                <img src="../../app/assets/images/tournamentGate/vsBg.gif">
                <img src="../../app/assets/images/tournamentGate/vs.gif" id="vs">
                <div class="player player2">
                    <div class"infs">
                        <div class="playerAvatar">
                            <div class="score">0</div>
                            <img class="plAvatar" src="../../app/assets/images/anonimous.jpeg">
                            <img src="../../app/assets/images/tournamentGate/avatarFrame.svg">
                        </div>
                        <div class="nakeName">@ael-bekk</div>
                        <div class="Fname">Abdellah El bekkali</div>
                    </div>
                    <img>
                </div>
                `;
        });
        let intervalEnds = 0;
        setTimeout(() => {
            const interval = setInterval(() => {
                if (this.__game1Winner === -1) {
                    if (this.__game1p1 > 10)
                        this.__game1Winner = 0;
                    else if (this.__game1p2 > 10)
                        this.__game1Winner = 1;
                    else {
                        Math.floor(Math.random() * 2) === 0 ? this.__game1p1++ : this.__game1p2++;
                    }
                    this.game1();
                }
                if (this.__game2Winner === -1) {
                    if (this.__game2p1 > 10)
                        this.__game2Winner = 0;
                    else if (this.__game2p2 > 10)
                        this.__game2Winner = 1;
                    else {
                        Math.floor(Math.random() * 2) === 0 ? this.__game2p1++ : this.__game2p2++;
                    }
                    this.game2();
                }
                if (this.__game1Winner !== -1 && this.__game2Winner !== -1) {
                    setTimeout(() => {
                        if (this.__game3Start !== true)
                            this.__game3Start = true,
                            this.game3();
                        if (this.__game3Winner === -1 && intervalEnds === 0) {
                            intervalEnds++;
                            console.log('game3');
                            clearInterval(interval);
                            setTimeout(() => {
                                interval = setInterval(() => {
                                    if (this.__game3p1 > 10)
                                        this.__game3Winner = 0;
                                    else if (this.__game3p2 > 10)
                                        this.__game3Winner = 1;
                                    else {
                                        Math.floor(Math.random() * 2) === 0 ? this.__game3p1++ : this.__game3p2++;
                                    }
                                    if (this.__game3Winner !== -1)
                                        this.__game3End = true;
                                    this.game3();
                                }, 500);
                            }, 1500);
                        }
                    }, 5000);
                }
            }, 500);
        }, 6000);
    }
    
    game1() {
        this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player1 .score').textContent = this.__game1p1;
        this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player2 .score').textContent = this.__game1p2;
        if (this.__game1Winner === 0) {
            this.shadowRoot.querySelector('.space1 .chairLeft .seat').classList.add('turnLeft');
            this.shadowRoot.querySelectorAll('.space1 .chairLeft .seat img').forEach(el => el.classList.add('filterWin'));
            this.shadowRoot.querySelectorAll('.space1 .chairRight .seat img').forEach(el => el.classList.add('filterLost'));
            this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player1 .score').style.color = '#0f0c';
            this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player2 .score').style.color = '#f00c';
            this.shadowRoot.querySelector('.avatar1').classList.add('semiFinaleLeft');
        }
        else if (this.__game1Winner === 1) {
            this.shadowRoot.querySelector('.space1 .chairRight .seat').classList.add('turnRight');
            this.shadowRoot.querySelectorAll('.space1 .chairRight .seat img').forEach(el => el.classList.add('filterWin'));
            this.shadowRoot.querySelectorAll('.space1 .chairLeft .seat img').forEach(el => el.classList.add('filterLost'));
            this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player2 .score').style.color = '#0f0c';
            this.shadowRoot.querySelector('.StandingsSemiFinaleLeft .player1 .score').style.color = '#f00c';
            this.shadowRoot.querySelector('.avatar2').classList.add('semiFinaleRight');
        }
    }
    game2() {
        this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player1 .score').textContent = this.__game2p1;
        this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player2 .score').textContent = this.__game2p2;
        if (this.__game2Winner === 0) {
            this.shadowRoot.querySelector('.space2 .chairLeft .seat').classList.add('turnLeft');
            this.shadowRoot.querySelectorAll('.space2 .chairLeft .seat img').forEach(el => el.classList.add('filterWin'));
            this.shadowRoot.querySelectorAll('.space2 .chairRight .seat img').forEach(el => el.classList.add('filterLost'));
            this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player1 .score').style.color = '#0f0c';
            this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player2 .score').style.color = '#f00c';
            this.shadowRoot.querySelector('.avatar3').classList.add('semiFinaleLeft2');
        }
        else if (this.__game2Winner === 1) {
            this.shadowRoot.querySelector('.space2 .chairRight .seat').classList.add('turnRight');
            this.shadowRoot.querySelectorAll('.space2 .chairRight .seat img').forEach(el => el.classList.add('filterWin'));
            this.shadowRoot.querySelectorAll('.space2 .chairLeft .seat img').forEach(el => el.classList.add('filterLost'));
            this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player2 .score').style.color = '#0f0c';
            this.shadowRoot.querySelector('.StandingsSemiFinaleRight .player1 .score').style.color = '#f00c';
            this.shadowRoot.querySelector('.avatar4').classList.add('semiFinaleRight2');
        }
    }
    game3() {
        this.shadowRoot.querySelector('.StandingsFinal .player1 .score').textContent = this.__game3p1;
        this.shadowRoot.querySelector('.StandingsFinal .player2 .score').textContent = this.__game3p2;
        if (this.__game3Start === true) {
            this.shadowRoot.querySelector('.space3 .chairLeft .seat').classList.add('turnLeftH');
            this.shadowRoot.querySelector('.space3 .chairRight .seat').classList.add('turnRightH');
            this.shadowRoot.querySelector('.avatar' + (this.__game1Winner + 1)).classList.add('avatarTrun' + (this.__game1Winner + 1));
            this.shadowRoot.querySelector('.avatar' + (this.__game2Winner + 3)).classList.add('avatarTrun' + (this.__game2Winner + 3));
            this.shadowRoot.querySelector('.StandingsFinal').style.display = 'flex';
        }
        if (this.__game3End === true) {
            if (this.__game3Winner === 0) {
                this.shadowRoot.querySelector('.space3 .chairLeft .seat').classList.add('turnLeftH2');
                this.shadowRoot.querySelectorAll('.space3 .chairLeft .seat img').forEach(el => el.classList.add('filterWin'));
                this.shadowRoot.querySelectorAll('.space3 .chairRight .seat img').forEach(el => el.classList.add('filterLost'));
                this.shadowRoot.querySelector('.avatar' + (this.__game1Winner + 1)).classList.add('FinalWinnerLeft');
                this.shadowRoot.querySelector('.StandingsFinal .player1 .score').style.color = '#0f0c';
                this.shadowRoot.querySelector('.StandingsFinal .player2 .score').style.color = '#f00c';
                this.shadowRoot.querySelector('.space9').classList.add('FinalWinner9');
                this.shadowRoot.querySelector('.space8').classList.add('FinalWinner');
            }
            else if (this.__game3Winner === 1) {
                this.shadowRoot.querySelector('.space3 .chairRight .seat').classList.add('turnRightH2');
                this.shadowRoot.querySelectorAll('.space3 .chairRight .seat img').forEach(el => el.classList.add('filterWin'));
                this.shadowRoot.querySelectorAll('.space3 .chairLeft .seat img').forEach(el => el.classList.add('filterLost'));
                this.shadowRoot.querySelector('.avatar' + (this.__game2Winner + 3)).classList.add('FinalWinnerRight');
                this.shadowRoot.querySelector('.StandingsFinal .player2 .score').style.color = '#0f0c';
                this.shadowRoot.querySelector('.StandingsFinal .player1 .score').style.color = '#f00c';
                this.shadowRoot.querySelector('.space9').classList.add('FinalWinner9');
                this.shadowRoot.querySelector('.space8').classList.add('FinalWinner');
            }
        }
    }
}

customElements.define('tournament-gate', TournamentGate);

function createtouranmentGate() {
    const div = document.createElement('div');
    const tournamentGate = document.createElement('tournament-gate');

    tournamentGate.setAttribute('id', 'tournamentGate');
    
    div.appendChild(tournamentGate);
    div.setAttribute('class', 'page tournamentpage');
    document.body.appendChild(div);
}


