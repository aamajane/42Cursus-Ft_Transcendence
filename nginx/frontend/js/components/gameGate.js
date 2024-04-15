class GameGates extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.__angle = 0;
        this.__direction = 1;
        this.__switch = 0;
        this.__dir = 0;
        this.__x = 0;
        this.__y = 0;
        this.__t_x = 0;
        this.__t_y = 0;
        this.__t_z = 0;
        this.__r = 0;
        this.__r_x = 0;
        this.__r_y = 0;
        this.__activateSpecialPower = true;
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
            .bgWrapper2Wrapper {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: -1;
                background-color: #000;
                background-image: url("https://www.transparenttextures.com/patterns/asfalt-light.png");
                // background-size: 400px 400px;
                transition: 0.85s ease-in-out;
            }
            .bgWrapper2WrapperAnimated {
                animation: animateStars 5s linear forwards;
            }
            @keyframes animateStars {
                0% {
                    background-position: 0 0;
                }
                30% {
                    background-position:  0 0;
                }
                100% {
                    background-position: 0 300px;
                }
            }
            .gates {
                position: relative;
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                height: fit-content;
                background-color: #000;
                color: #fff;
                font-size: 2rem;
                font-weight: bold;
                text-align: center;
                perspective: 1000px;
                overflow: hidden;
            }
            .gates h1 {
                margin-bottom: 2rem;
            }
            .gates button {
                padding: 1rem 2rem;
                background-color: #fff;
                color: #000;
                font-size: 1.5rem;
                font-weight: bold;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .gatesWrapper {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                transform-style: preserve-3d;
                animation: starGates 5s linear forwards;
                transition: 1s ease-in-out;
                transform: rotateX(80deg) translateZ(50px) translateY(710px);
            }
            .gates__content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                transform-style: preserve-3d;
                transition: 1s ease-in-out;
            }
            @keyframes starGates {
                0% {
                    transform: rotateX(0) translateZ(100px) translateY(0) scale(0);
                }
                30% {
                    transform: rotateX(0) translateZ(0) translateY(0);
                }
            }
            .gatesFrontGround {
                position: relative;
                top: 0;
                left: 0;
                width: 1500px;
                height: 100vh;
                border-radius: 1000px; 
                transition: 1s;
                display: flex;
                background: radial-gradient(ellipse at center, #00f5 0%, #0ff5 20%, #0000 70%);
                
            }
            .gatesFrontGround > img#land {
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(2);
            }
            .gateWorld {
                position: absolute;
                top: 50%;
                left: 50%;
                transform-style: preserve-3d;
                transform: translate(-50%, -50%) translateZ(300px); 
                width: 100%;
                height: 100%;
                transition: 1s;
            }
            .gateWorld#gate2 {
                transform: translate(-50%, -50%) rotate(120deg) translateZ(300px);
            }
            .gateWorld#gate3 {
                transform: translate(-50%, -50%) rotate(-120deg) translateZ(300px); 
            }
            .gateWorld .gatePath {
                position: relative;
                top: 10%;
                left: 50%;
                transform-style: preserve-3d;
                transform: translate(-50%, -50%) rotateX(-100deg) translateZ(-150px) translateY(180px) scale(1.9);   
            }
            .gatePath img {
                position: absolute;
                height: 160px;
                top: 50%;
                left: 50%;
                z-index: -1;
                animation: animateGatePathImg 5s linear infinite;
                opacity: 0.8;
            }
            .gatePath img:nth-of-type(1) {
                opacity: 0.4;
            }
            .gatePath img:nth-of-type(2) {
                transform: translate(-50%, calc(-50% - 5px)) rotate(0deg) scaleX(1.8) scaleY(1);
                animation: none;
            } 
            .gatePath img:nth-of-type(3) {
                animation: none;
                transform: translate(-50%, calc(-50% - 5px)) rotate(0deg);
                z-index: -10;
                clip-path: circle(40% at 50% 50%);
                filter: brightness(.6);
                opacity: 1;
            }
            .gatePath img:nth-of-type(4) {
                animation: none;
                width: 200px;
                transform: translate(0, calc(-20% - 5px)) rotateX(10deg) translateZ(100px); 
            }
            @keyframes animateGatePathImg {
                0% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(0deg);
                }
                100% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(360deg);
                }
            }
            @keyframes animateGatePathImg2 {
                0% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(0) scaleX(1.8) scaleY(1);
                }
                25% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(50deg) scaleX(1.8) scaleY(1);
                }
                75% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(-50deg) scaleX(1.8) scaleY(1);
                }
                100% {
                    transform: translate(-50%, calc(-50% - 5px)) rotate(0) scaleX(1.8) scaleY(1);
                }
            }
            .laserHologram {
                position: absolute;
                left: 50%;
                top: 50px;
                width: fit-content;
                height: fit-content;
                transform: translate(-50%, -85%) translateZ(1px);
            }
            .laserHologram#base {
                background: radial-gradient(ellipse at center, #00f 0%, #0ffa 30%, #0af5 50%, #0000 70%);
            }
            .laserHologram#laser {
                all: initial;
                position: absolute;
                width: 650px;
                bottom: 50%;
                left: 50%;
                display: flex;
                background: aff3; 
                border-radius: 100% 20% 20% 100%;
                box-shadow: 0 0 50px 50px #aff2,
                            0 0 150px 150px #aff2 inset;
                z-index: 0;
                transform: translate(-50%, -275%) translateZ(0px) rotateX(0deg) translateY(0px) rotate(-90deg);
            }
            .laserHologram#laser img {
                position: relative;
                width: 200px;
                top: 0;
                left: -40px;
                transform: none;
                filter: hue-rotate(360deg);
            }
            .laserHologram#laser span {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            .laserHoloWrapper {
                position: relative;
                width: 650px;
                display: flex;
                background-image: url('../../app/assets/images/gameGate/laser11.gif');
                background-repeat: repeat;
                background-position: center;
                background-size: 50px;
                filter: hue-rotate(300deg);
                transition: 0.5s;
            }
            .animated {
                animation: laserHolo 1.5s linear forwards;
            }
            @keyframes laserHolo {
                20% {
                    transform: translate(150%, 0);
                }
                20.1% {
                    transform: translate(-150%, 0);
                }
                80% {
                    transform: translate(-150%, 0);
                }
                100% {
                    transform: translate(0%, 0);
                }
            }
            .animated2#laser {
                animation: laserHolo2 1.6s linear forwards;
            }
            @keyframes laserHolo2 {
                0% {
                    overflow: hidden;
                    box-shadow: none;
                }
                95% {
                    overflow: hidden;
                    box-shadow: none;
                    height: 0;
                }
                100% {
                    overflow: visible;
                    box-shadow: 0 0 50px 50px #aff2,
                                0 0 150px 150px #aff2 inset;
                }
            }
            .animated3 {
                animation: laserHolo3 2s linear forwards;
            }
            @keyframes laserHolo3 {
                0% {
                    transform: translate(-50%, -85%) translateZ(1px) scale(1);
                }
                10% {
                    transform: translate(-50%, -85%) translateZ(1px) scale(1);
                }
                15% {
                    transform: translate(-50%, -85%) translateZ(1px) scale(0);
                }
                80% {
                    transform: translate(-50%, -85%) translateZ(1px) scale(0);
                }
                10% {
                    transform: translate(-50%, -85%) translateZ(1px) scale(1);
                }
            }
            img.animatedImg0 {
                animation: animatedImgStart_1 .5s linear infinite;
            }
            img.animatedImg00 {
                animation: animatedImgStart1 .5s linear forwards;
            }
            @keyframes animatedImgStart1 {
                0% {
                    opacity: .8;
                    transform: translate(-50%, calc(-50% - 5px)) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% - 5px)) rotate(360deg);
                }
            }
            @keyframes animatedImgStart_1 {
                0% {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% - 5px)) rotate(360deg);
                }
                100% {
                    opacity: .8;
                    transform: translate(-50%, calc(-50% - 5px)) rotate(0deg);
                }
            }
            img.animatedImg1#b {
                animation: animatedImgStart_2 0.2s linear forwards;
            }
            img.animatedImg11#b {
                animation: animatedImgStart2 0.2s linear forwards;
            }
            @keyframes animatedImgStart2 {
                0% {
                    transform: translate(-50%, calc(-50% - 5px)) scaleX(1.8) scaleY(1);
                }
                100% {
                    transform: translate(-50%, calc(-50% - 5px)) scaleX(1.8) scale(0);
                }
            }
            @keyframes animatedImgStart_2 {
                0% {
                    transform: translate(-50%, calc(-50% - 5px)) scaleX(1.8) scale(0);
                }
                100% {
                    transform: translate(-50%, calc(-50% - 5px)) scaleX(1.8) scale(1);
                }
            }
            img.animatedImg2#c {
                animation: animatedImgStart_3 1s linear forwards;
            }
            img.animatedImg22#c {
                animation: animatedImgStart3 0.2s linear forwards;
            }
            img.animatedImg222#c {
                animation: animatedImgStart3_3 10s linear infinite;
            }
            @keyframes animatedImgStart3 {
                0% {
                    opacity: 0.8;
                }
                100% {
                    opacity: 0;
                }
            }
            @keyframes animatedImgStart_3 {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 0.8;
                }
            }
            @keyframes animatedImgStart3_3 {
                0% {
                    transform: translate(-50%, calc(-50% - 5px)) scale(1);
                    clip-path: circle(40% at 50% 50%);
                }
                25% {
                    transform: translate(-74%, calc(-24% - 5px)) scale(1.333);
                    clip-path: circle(30% at 70% 30%);
                }
                50% {
                    transform: translate(-23%, calc(-24% - 5px)) scale(1.333);
                    clip-path: circle(30% at 30% 30%);
                }
                75% {
                    transform: translate(-51%, calc(-77% - 5px)) scale(1.333);
                    clip-path: circle(30% at 50% 70%);
                }
                100% {
                    transform: translate(-50%, calc(-50% - 5px)) scale(1);
                    clip-path: circle(40% at 50% 50%);
                }
            }
            .index {
                position: absolute;
                top: 0;
                left: 50%;
                width: 1000px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 5rem;
                font-weight: bold;
                color: #fff;
                z-index: 100;
                transform: translateX(-50%) translateZ(-700px);
            }
            .indexWrapper {
                position: relative;
                width: 1000px;
                height: 1000px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 5rem;
                font-weight: bold;
                color: #fff;
                border-radius: 100%;
                box-shadow: 0 0 100px 10px #0cf,
                0 0 100px 100px #007;
            }
            .indexWrapper2 {
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 5rem;
                font-weight: bold;
                color: #fff;
                overflow: hidden;
                border-radius: 100%;
            }
            .indexWrapper2 img {
                all: initial;
                position: absolute;
                height: 100%;
                object-fit: cover;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 10;
            }
            .indexWrapper2 img:nth-of-type(2) {
                width: calc(100% + 40px);
                height: calc(100% + 40px);
                object-fit: cover;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                filter: hue-rotate(80deg);
            }
            .indexWrapper > img {
                
                all: initial;
                position: absolute;
                height: calc(148%);
                object-fit: cover;
                z-index: 100;
                opacity: 0.8;
            }
            .indexWrapper > img:nth-of-type(2) {
                
                all: initial;
                position: absolute;
                height: calc(148%);
                object-fit: cover;
                z-index: 1;
                opacity: 0.1;
            }
            .indexWrapper > img:nth-of-type(3) {
                
                all: initial;
                position: absolute;
                height: calc(148%);
                object-fit: cover;
                z-index: 110;
                opacity: 0.2;
                filter: sepia(1);
            }
            .animatedStars0 {
                animation: animateStars0 0.7s linear forwards;
            }
            @keyframes animateStars0 {
                100% {
                    background-position: 0px 0px;
                }
            }
            .animatedStars1 {
                animation: animateStars1 0.7s linear forwards;
            }
            @keyframes animateStars1 {
                100% {
                    background-position: 200px 10px;
                }
            }
            .animatedStars2 {
                animation: animateStars2 0.7s linear forwards;
            }
            @keyframes animateStars2 {
                100% {
                    background-position: -200px -10px;
                }
            }
            .animatedStars3 {
                animation: animateStars3 0.7s linear forwards;
            }
            @keyframes animateStars3 {
                100% {
                    background-position: 100px -10px;
                }
            }
            .animatedStars4 {
                animation: animateStars4 0.7s linear forwards;
            }
            @keyframes animateStars4 {
                100% {
                    background-position: -200px -200px;
                }
            }
            .animatedStars5 {
                animation: animateStars5 0.7s linear forwards;
            }
            @keyframes animateStars5 {
                100% {
                    background-position: 0px 200px;
                }
            }
            .animatedStarsLeft {
                animation: animateStarsLeft 0.7s linear forwards;
            }
            @keyframes animateStarsLeft {
                100% {
                    background-position: 700px 0px;
                }
            }
            .animatedStarsRight {
                animation: animateStarsRight 0.7s linear forwards;
            }
            @keyframes animateStarsRight {
                100% {
                    background-position: -700px 0px;
                }
            }
            img.animatedBigGate#a, img.animatedBigGate#b , img.animatedBigGate#c
            , .animatedBigGate{
                animation: animateBigGate 0.7s linear forwards;
            }
            @keyframes animateBigGate {
                0% {
                    transform: scale(0);
                }
                100% {
                    transform: scale(1);
                }
            }
            img.animatedBigGate2#a, img.animatedBigGate2#b , img.animatedBigGate2#c
            , .animatedBigGate2{
                animation: animateBigGate2 0.7s linear forwards;
            }
            @keyframes animateBigGate2 {
                0% {
                    transform: scale(1);
                }
                100% {
                    transform: scale(0);
                }
            }
            img.animatedBigGate#d {
                animation: animateBigGate3 0.7s linear forwards;
                
            }
            @keyframes animateBigGate3 {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
            img.animatedBigGate2#d {
                animation: animateBigGate4 0s linear forwards;
            }
            @keyframes animateBigGate4 {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
            .gateDescription {
                position: absolute;
                width: 600px;
                height: fit-content;
                padding: 2rem 0;
                bottom: 0;
                left: 0;
                z-index: 100;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
                font-weight: bold;
                color: #fff;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 50px;
                box-shadow: 0 0 50px 10px #0007;
            }
            .gateDescription img {
                position: relative;
                width: 100%;
            }
            .gateDescription > img:nth-of-type(1) {
                position: absolute;
                width: 10%;
                left: 0;
                top: 10px;
            }
            .gateDescription > img:nth-of-type(2) {
                position: relative;
                width: 95%;
                height: 100%;
                left: 6px;
                display: flex;
                flex-direction: column;
            }
            .gateDescriptionText {
                position: absolute;
                right: 5px;
                width: 68%;
                height: 70%;
                display: flex;
                flex-direction: column;
                margin: 0 23px;
                opacity: 0;
                animation: animateGateDescription 1s linear forwards 3s;
            }
            @keyframes animateGateDescription {
                100% {
                    opacity: 1;
                }
            }
            #timeLine {
                animation: animateGateDescription1 2s linear forwards;
            }
            @keyframes animateGateDescription1 {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                }
                100% {
                    transform: translate(0, 0) scale(1);
                }
            }
            .gateDescriptionTitleWrapper {
                position: relative;
                width: 100%;
                height: 30%;
                display: flex;
                justify-content: right;
                align-items: center;
                border: 1px solid #f0f0;
            }
            .gateDescriptionTitleWrapper h1 {
                position: relative;
                top: 8px;
                left: -15px;
                width: 40%;
                border: 1px solid #f0f0;
                margin: 0;
                font-size: 2rem;
                
            }
            .gateDescriptionTextWrapper {
                position: relative;
                width: 100%;
                height: 70%;
                display: flex;
                flex-direction: column;
                border: 5px solid #fff0;
            }
            .gateDescriptionTextWrapper .infs {
                position: relative;
                width: 100%;
                height: 65%;
                display: flex;
                flex-direction: column;
                align-items: center;
                border: 1px solid #f000;
            } 
            .gateDescriptionTextWrapper .infs span {
                position: relative;
                width: 100%;
                height: 50%;
                display: flex;
                flex-direction: column;
                justify-content: left;
                border: 1px solid #f000;
                padding: 10px 0;
            }
            .gateDescriptionTextWrapper .infs span h1 {
                all: initial;
                font-family: "Share Tech", sans-serif;
                position: relative;
                width: 90%;
                font-size: 16px;
                color: #0f5;
                margin: 0 15px;
            }
            .gateDescriptionTextWrapper .infs .info2 h1 {
                width: 35%;
                top: -10px;
                left: 15px;
                font-size: 14px;
            }
            .gateDescriptionTextWrapper .infs span h1:nth-of-type(2) {
                text-align: center;
                transform: translateX(80px);
            }
            em {
                position: absolute;
                top: 50%;
                left: 10%;
                transform: translateY(-60%) translateX(70%);
                font-style: bolder;
                font-size: 3rem;

            }
            .activateSpecialPower {
                position: absolute;
                right: 10px;
                bottom: 0;
                width: 55%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
            }
            .activateSpecialPower h1 {
                all: initial;
                font-family: "Share Tech", sans-serif;
                position: relative;
                font-size: 12px;
                width: 50%;
                font-size: 18px;
                text-align: center;
                vertical-align: center;
            }
            .activateSpecialPower h1:nth-of-type(1) {
                color: #0f0;
                font-style: bolder;
            }
            .activateSpecialPower h1:nth-of-type(2) {
                color: #0fa;
            }
            .activateSpecialPower button {
                position: relative;
                background: #5fa7;
                width: 100px;
                height: 30px;
                border-radius: 5px;
                clip-path: polygon(20% 0, 100% 0, 80% 100%, 0 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                overflow: hidden;
                box-shadow: 0 0 10px 1px #fff7 inset;
            }
            .activateSpecialPower button div {
                position: absolute;
                right: 0;
                clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%); 
                height: 100%;
                width: 64%;
                background: #5faa;
                border: 1px solid #f00;    
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 10px 1px #fff7 inset;
            }
            .activateSpecialPower button:hover div {
                animation: animateSpecialPower 1s infinite;
            }
            @keyframes animateSpecialPower {
                0% {
                    width: 64%;
                }
                50% {
                    width: 80%;
                }
                100% {
                    width: 64%;
                }
            }

            .base00 {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .frontGroundGatesBase {
                all: initial;
                position: relative;
                top: 0;
                left: 0;
                transition: 0.5s ease-in-out;
            }
            .gatePort {
                all: initial;
                opacity: 1;
            }
            .gatePath .gatePort img {
                all: initial;
            }
            @media screen and (max-width: 768px) {
                .gateDescription {
                    transform: scale(0.7) translateY(20%) translateX(-20%);
                }
            }
            @media screen and (max-width: 400px) {
                .gateDescription {
                    transform: scale(0.5) translateY(50%) translateX(-50%);
                }
            }
        </style>
        <div class="gates">
            <div class="bgWrapper2Wrapper bgWrapper2WrapperAnimated">
            </div>
            <div class="gatesWrapper">
                <div class="gates__content">
                    <div class="gatesFrontGround">
                        <div class="base00">
                            <img src="../../app/assets/images/gameGate/baseGate1.svg" class="frontGroundGatesBase" id="land">
                        </div>   
                        <img src="../../app/assets/images/gameGate/baseGate2.svg" class="frontGroundGatesBase" id="land">
                    </div>
                    <div class='gateWorld' id='gate1'></div>
                    <div class='gateWorld' id='gate2'></div>
                    <div class='gateWorld' id='gate3'></div>
                    <div class='laserHologram' id="base">
                        <img src='../../app/assets/images/gameGate/gate.gif' alt='laserHologram'>
                    </div>
                    <div class='laserHologram' id="laser">
                        <span></span>
                        <div class='laserHoloWrapper'>
                            <img src='../../app/assets/images/gameGate/laser1.gif' alt='laserHologram'>
                        </div>
                    </div>
                </div>
            </div>
            <div class='gateDescription'>
                <img src='../../app/assets/images/gameGate/tenor.gif' alt='gateDescription'>
                <img src='../../app/assets/images/gameGate/pastInfo.svg' alt='gateDescription' id="timeLine">
                <div class='gateDescriptionText'>
                    <div class='gateDescriptionTitleWrapper'>
                        <h1 class='gateDescriptionTitle'></h1>
                    </div>
                    <div class='gateDescriptionTextWrapper'>
                        <div class='infs'>
                            <span class='info1'>
                                <h1 id="inf1"> Set your belt and get ready. The time machine will sand you to the past : </h1>
                                <h1 id="inf2"> 	<em>⇝</em> To 3000 years BC. </h1>
                            </span>
                            <span class='info2'>
                                <h1 id="inf3"> Silent guardians, mummies beckon with secrets preserved through millennia. </h1>
                            </span>
                        </div>
                        <div class='activateSpecialPower'>
                            <h1> Power : </h1>
                            <h1 id="inf4"> Mummy catch </h1>
                            <button id='activateSpecialPower'> <div>On</div> </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const gateWorld = this.shadowRoot.querySelectorAll('.gateWorld');
        gateWorld.forEach((gate, index) => {
            const gatePath = `
                <div class='gatePath' id='gatePath${index + 1}'>
                    <div class='gatePort'>
                        <img src="../../app/assets/images/gameGate/gatePort.svg" alt="gatePort">
                    </div>
                    <img id="a" src="../../app/assets/images/gameGate/portal0.gif" alt="gate">
                    <img id="b" src="../../app/assets/images/gameGate/portal2.gif" alt="gate">
                    <img id="c" src="${
                        index === 0 ? '../../app/assets/images/gameGate/egypt.png' : index === 1 ? '../../app/assets/images/gameGate/space.png' : '../../app/assets/images/gameGate/factory.png'
                    }" alt="gate">
                    <div class="index">
                        <div class="indexWrapper">
                            <img id="a" src="../../app/assets/images/gameGate/effect3.gif" alt="index">
                            <img id="b" src="../../app/assets/images/gameGate/smoke.gif" alt="index">
                            <img id="c" src="../../app/assets/images/gameGate/waves.gif" alt="index">
                            <div class="indexWrapper2">
                                <img id="d" src="../../app/assets/images/gameGate/${index === 0 ? 'past.png' : index === 2 ? 'present.jpeg' : 'future.jpeg'}" alt="index">
                                <img id="e" src="../../app/assets/images/gameGate/blackHole1.gif" alt="index">
                            </div>
                        </div>
                    </div>
                </div> 
            `;
            gate.innerHTML += gatePath;
        });

        let executedDate, executedDate2, executedDate3;
        executedDate = executedDate2 = executedDate3 = new Date() - 2000;

        let timeOut1, timeOut2, timeOut3, timeOut4, timeOut5;
        
        function triggerKey() {
            clearTimeout(timeOut1);
            clearTimeout(timeOut2);
            clearTimeout(timeOut3);
            clearTimeout(timeOut4);
            clearTimeout(timeOut5);
            this.resetAnimation();
            
            timeOut1 = setTimeout(() => {this.animation1();      }, 500);
            let indx = this.__direction === 0 ? 1 : this.__direction === 1 ? 0 : 2;
            timeOut2 = setTimeout(() => {this.animation2(indx);  }, 2000);
            timeOut3 = setTimeout(() => {this.animation3(indx);  }, 2200);
            timeOut4 = setTimeout(() => {this.animation4(indx);  }, 2700);
            timeOut5 = setTimeout(() => {this.animation5(indx);  }, 3500);
        }
        triggerKey.call(this);

        document.addEventListener('keydown', (e) => {
            if (new Date() - executedDate > 1400) {
                executedDate = new Date();
                (e.key === 'ArrowLeft')     &&  this.pressLeft();
                (e.key === 'ArrowRight')    &&  this.pressRight();

                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.__activateSpecialPower = false;
                    this.triggerClickSPower();
                    this.shadowRoot.querySelector('.bgWrapper2Wrapper').classList.remove('bgWrapper2WrapperAnimated');
                    this.shadowRoot.querySelector('.bgWrapper2Wrapper').offsetWidth;
                    triggerKey.call(this);
                }
                if (e.key === 'Enter') {
                    this.shadowRoot.querySelector('.gates__content').style.transform = 'translateY(1010px) translateZ(70px) rotateX(10deg)';
                }
            }
            if (new Date() - executedDate3 > 700) { 
                executedDate3 = new Date();
                (e.key === 'ArrowUp')       &&  this.pressUp();
                (e.key === 'ArrowDown')     &&  this.pressDown();

                (e.key === 'ArrowUp'
                || e.key === 'ArrowDown')   && this.animateView2();
            }
        });
        document.addEventListener('wheel', (e) => {
            if (new Date() - executedDate2 > 500) {
                executedDate2 = new Date();
                this.animateView1(e.deltaY);
            }
        });
        this.shadowRoot.querySelector('#activateSpecialPower').addEventListener('click', () => {
            this.triggerClickSPower();
            this.__activateSpecialPower = !this.__activateSpecialPower;
        }
        );
        this.shadowRoot.querySelector('.gatesFrontGround').style.transform = `rotate(${this.__angle}deg)`;
    }

    fillCords(x, y, t_x, t_y, t_z, r, r_x) {
        this.__x = x;
        this.__y = y;
        this.__t_x = t_x;
        this.__t_y = t_y;
        this.__t_z = t_z;
        this.__r = r;
        this.__r_x = r_x;
    }

    triggerClickSPower() {
        if (this.__activateSpecialPower === true) {
            this.shadowRoot.querySelector('#activateSpecialPower div').textContent = 'Off';
            this.shadowRoot.querySelector('#activateSpecialPower div').style.right = 'auto';
            this.shadowRoot.querySelector('#activateSpecialPower div').style.left = '0';

        } else {
            this.shadowRoot.querySelector('#activateSpecialPower div').textContent = 'On';
            this.shadowRoot.querySelector('#activateSpecialPower div').style.left = 'auto';
            this.shadowRoot.querySelector('#activateSpecialPower div').style.right = '0';
        }
    }

    pressLeft() {
        this.__angle += 120;
        this.__direction = (this.__direction + 1) % 3;
        this.__dir += 1;
    }
    
    pressRight() {
        this.__angle -= 120;
        this.__direction = (this.__direction + 2) % 3;
        this.__dir -= 1;
    }
    
    pressUp() {
        this.__r_x += 20;
        this.__y += 700;
    }
    
    pressDown() {
        this.__r_x -= 20;
        this.__y -= 700;
    }

    resetAnimation() {
        this.shadowRoot.querySelector('.frontGroundGatesBase').style.transform = `rotate(${-this.__angle}deg)`;
        this.shadowRoot.querySelector('.laserHoloWrapper').classList.remove('animated');
        this.shadowRoot.querySelector('.laserHologram#laser').classList.remove('animated2');
        this.shadowRoot.querySelector('.laserHologram#base').classList.remove('animated3');
        void this.shadowRoot.querySelector('.laserHoloWrapper').offsetWidth;
        void this.shadowRoot.querySelector('.laserHologram#laser').offsetWidth;
        void this.shadowRoot.querySelector('.laserHologram#base').offsetWidth;
        this.shadowRoot.querySelector('.laserHoloWrapper').classList.add('animated');
        this.shadowRoot.querySelector('.laserHologram#laser').classList.add('animated2');
        this.shadowRoot.querySelector('.laserHologram#base').classList.add('animated3');
        this.shadowRoot.querySelectorAll('.gatePath').forEach((gatePathC, index) => {

            gatePathC.querySelector('#a').classList.remove('animatedImg0');
            gatePathC.querySelector('#a').classList.add('animatedImg00');
            gatePathC.querySelector('#b').classList.remove('animatedImg1');
            gatePathC.querySelector('#b').classList.add('animatedImg11');
            gatePathC.querySelector('#c').classList.remove('animatedImg2', 'animatedImg222');
            gatePathC.querySelector('#c').classList.add('animatedImg22');
            gatePathC.querySelector('.indexWrapper').style.boxShadow = 'none';
            gatePathC.querySelector('.index').querySelector('#a').classList.remove('animatedBigGate');
            gatePathC.querySelector('.index').querySelector('#b').classList.remove('animatedBigGate');
            gatePathC.querySelector('.index').querySelector('#c').classList.remove('animatedBigGate');
            gatePathC.querySelector('.index').querySelector('#d').classList.remove('animatedBigGate');
            gatePathC.querySelector('.indexWrapper').classList.remove('animatedBigGate');
            gatePathC.querySelector('.index').querySelector('#a').classList.add('animatedBigGate2');
            gatePathC.querySelector('.index').querySelector('#b').classList.add('animatedBigGate2');
            gatePathC.querySelector('.index').querySelector('#c').classList.add('animatedBigGate2');
            gatePathC.querySelector('.index').querySelector('#d').classList.add('animatedBigGate2');
            gatePathC.querySelector('.indexWrapper').classList.add('animatedBigGate2');
        });
    }
    
    animation1() {
        this.shadowRoot.querySelector('.gatesFrontGround').style.transform = `rotate(${this.__angle}deg)`;
        this.shadowRoot.querySelector('#gate1').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${this.__angle}deg)`;
        this.shadowRoot.querySelector('#gate2').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${120 + this.__angle}deg)`;
        this.shadowRoot.querySelector('#gate3').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${240 + this.__angle}deg)`;

        this.shadowRoot.querySelector('.bgWrapper2Wrapper').style.backgroundPosition = `${this.__dir * 400 + this.__x}px ${this.__y}px`;
        if (this.__direction === 1) {
            this.shadowRoot.querySelector('#gate1').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${this.__angle}deg)`;
            this.shadowRoot.querySelector('.gateDescription #timeLine').src = '../../app/assets/images/gameGate/pastInfo.svg';
            this.shadowRoot.querySelector('.gateDescriptionTitle').textContent = 'Egypt';
            this.shadowRoot.querySelector('#inf1').textContent = 'Set your belt and get ready. The time machine will sand you to the past :';
            this.shadowRoot.querySelector('#inf2').innerHTML = '<em>⇝</em> To 3000 years BC. ';
            this.shadowRoot.querySelector('#inf3').textContent = ' Silent guardians, mummies beckon with secrets preserved through millennia. ';
            this.shadowRoot.querySelector('#inf4').textContent = ' Mummy catch ';
        }
        if (this.__direction === 0) {
            this.shadowRoot.querySelector('#gate2').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${120 + this.__angle}deg)`;
            this.shadowRoot.querySelector('.gateDescription #timeLine').src = '../../app/assets/images/gameGate/futureInfo.svg';
            this.shadowRoot.querySelector('.gateDescriptionTitle').textContent = 'Space';
            this.shadowRoot.querySelector('#inf1').textContent = 'Set your belt and get ready. The time machine will sand you to the future :';
            this.shadowRoot.querySelector('#inf2').innerHTML = '<em>⇝</em> To 3000 years AD. ';
            this.shadowRoot.querySelector('#inf3').textContent = ' Humanity thrives in vast space habitats, forging a cosmic legacy. ';
            this.shadowRoot.querySelector('#inf4').textContent = ' black hole ';
        }
        if (this.__direction === 2) {
            this.shadowRoot.querySelector('#gate3').style.transform = `translate(-50%, -50%) translateZ(300px) rotate(${240 + this.__angle}deg)`;
            this.shadowRoot.querySelector('.gateDescription #timeLine').src = '../../app/assets/images/gameGate/presentInfo.svg';
            this.shadowRoot.querySelector('.gateDescriptionTitle').textContent = 'Factory';
            this.shadowRoot.querySelector('#inf1').textContent = 'Set your belt and get ready. The time machine will sand you to the present :';
            this.shadowRoot.querySelector('#inf2').innerHTML = '<em>⇝</em> To 2045. ';
            this.shadowRoot.querySelector('#inf3').textContent = ' A world of industry and progress, where the air is thick with promise. ';
            this.shadowRoot.querySelector('#inf4').textContent = ' buildings block ';
        }
    }
    
    animation2(indx) {
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#b').classList.remove('animatedImg11');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#b').classList.add('animatedImg1');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.indexWrapper').classList.remove('animatedBigGate2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.indexWrapper').classList.add('animatedBigGate');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#a').classList.remove('animatedBigGate2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#a').classList.add('animatedBigGate');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#b').classList.remove('animatedBigGate2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#b').classList.add('animatedBigGate');
    }
    
    animation3(indx) {
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#a').classList.remove('animatedImg00');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#a').classList.add('animatedImg0');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#c').classList.remove('animatedBigGate2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#c').classList.add('animatedBigGate');
    }
    
    animation4(indx) {
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#a').classList.remove('animatedImg0');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#c').classList.remove('animatedImg22', 'animatedImg222');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#c').classList.add('animatedImg2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.indexWrapper').style.boxShadow = ' 0 0 100px 10px #0cf, 0 0 100px 100px #007';
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#d').classList.remove('animatedBigGate2');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('.index').querySelector('#d').classList.add('animatedBigGate');
    }
    
    animation5(indx) {
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#c').classList.remove('animatedImg2', 'animatedImg22');
        this.shadowRoot.querySelectorAll('.gatePath').item(indx).querySelector('#c').classList.add('animatedImg222');
    }
    
    animateView1(deltaY) {
        if (deltaY > 0)   this.__switch = (this.__switch + 1) % 6;
        else                this.__switch = (this.__switch + 5) % 6;

        if (this.__switch === 0)    this.fillCords(0, 0, 0, 0, 0, 0, 0);
        if (this.__switch === 1)    this.fillCords(100, 100, 0, -500, -100, 30, 0);
        if (this.__switch === 2)    this.fillCords(-100, 90, -100, -500, 0, -30, 0);
        if (this.__switch === 3)    this.fillCords(-50, 0, 100, -200, 0, -30, 0);
        if (this.__switch === 4)    this.fillCords(0, -400, 0, -800, -500, 0, -60);
        if (this.__switch === 5)    this.fillCords(0, -300, 0, -1000, -100, 0, -10);
        
        this.shadowRoot.querySelector('.gates__content').style.transform = `translateY(${this.__t_y}px) translateZ(${this.__t_z}px) translateX(${this.__t_x}px) rotate(${this.__r}deg) rotateX(${this.__r_x}deg)`;
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').classList.remove('bgWrapper2WrapperAnimated');
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').offsetWidth;
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').style.backgroundPosition = `${this.__dir * 400 + this.__x}px ${this.__y}px`;
    }
    
    animateView2() {
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').style.backgroundPosition = `${this.__dir * 400 + this.__x}px ${this.__y}px`;
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').classList.remove('bgWrapper2WrapperAnimated');
        this.shadowRoot.querySelector('.bgWrapper2Wrapper').offsetWidth;
        this.shadowRoot.querySelector('.gates__content').style.transform = `translateY(${this.__t_y}px) translateZ(${this.__t_z}px) translateX(${this.__t_x}px) rotate(${this.__r}deg) rotateX(${this.__r_x}deg)`;
    }
}

customElements.define('game-gates', GameGates);

function createGates() {
    const div = document.createElement('div');
    const gates = document.createElement('game-gates');

    gates.setAttribute('id', 'gates');

    div.appendChild(gates);
    div.setAttribute('class', 'page gamePage');
    document.body.appendChild(div);
}