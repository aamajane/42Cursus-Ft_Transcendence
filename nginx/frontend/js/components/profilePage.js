class PopUpProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.__show = false;
        this.__toShow = 0;
        this.__choice = "1v1";
        this.__enter = true;
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const id = this.getAttribute("id");
        this.shadowRoot.innerHTML = `
        <style>
        .popup {
            position: relative;
            width: 100%;
            height: 100%;
            // border: 1px solid #fff;
            background-color: rgba(0, 0, 0, 0.8);
            overflow-x: hidden;
        }
        .popup > img {
            position: absolute;
            width: 100px;
            bottom: 180px;
            left: 50%;
            z-index: 1001;
            animation: animateScale 2s infinite;
        }
        @keyframes animateScale {
            0% {
                transform: translateX(-45%) scale(1);
            }
            50% {
                transform: translateX(-45%) scale(1.5);
            }
            100% {
                transform: translateX(-45%) scale(1);
            }
        }
        .popup-inner {
            position: relative;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: fit-content;
            height: fit-content;
            min-height: 100vh;
            max-width: 1300px;
            // background-color: #fff;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;
            // padding: 200px 0;
            animation: animatePopup 1s;
            // border: 1px solid white;
        }
        @keyframes animatePopup {
            0% {
                height: 0;
            }
            100% {
                height: 60%;
            }
        }
        .popup-inner > img {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            // top: 50%;
            // left: 0;
            // transform: translateY(-50%);
            // border: 1px solid #f00;
            margin-top: 240px;
            margin-bottom: 200px;
            animation: pathDraw 4s;
        }
        @keyframes pathDraw {
            from {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
            }
            to {
                stroke-dasharray: 1000;
                stroke-dashoffset: 0;
            }
        }
        .popup-inner > .avatar {
            position: absolute;
            width: 230px;
            height: 160px;
            margin-bottom: 20px;
            border-radius: 10px;
            top: 63px;
            left: 50%;
            transform: translate(-49.7% , 0);
            // overflow: hidden;
            // border: 1px solid #24C2E5;
            // z-index: -1;
            // border : 1px solid #24C2E5;
            animation: animateShadow 2s infinite;
        }
        @keyframes animateShadow {
            0% {
                box-shadow: 0 0 10px 3px #aaa,
                0 0 10px 10px #aaa inset;
            }
            50% {
                box-shadow: 0 0 8px 0px #aaa;
            }
            100% {
                box-shadow: 0 0 10px 3px #aaa,
                0 0 10px 10px #aaa inset;
            }
        }
        @keyframes moveLine {
            0% {
                right: -1000%;
            }
            80% {
                right: -1000%;
            }
            90% {
                right: 20%;
            }
            100% {
                right: 1000%;
            }
        }
        @keyframes moveGradient {
            0% {
                left: -400%;
            }
            80% {
                left: -400%;
            }
            90% {
                left: 20%;
            }
            100% {
                left: 400%;
            }
        }
        .popup-inner > .avatar h2 {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%);
            color: #00FFF0;
            font-size: 20px;
            font-weight: 600;
            z-index: 2;
            text-shadow: 0 0 10px #00FFF0;
        }
        .popup-inner > .avatar img {
            position: absolute;
            width: 120%;
            // border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0.8;
            transform: translate(-50%, -50%);
            z-index: -1;
        }
        .popup-inner > .avatar img:nth-child(2) {
            position: absolute;
            width: 85px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
            box-shadow: 0 0 5px 1px #24C2E5;
            border-radius: 50%;
        }
        .popup-inner .follow, .popup-inner .submit {
            position: absolute;
            width: 200px;
            height: 50px;
            top: 935px;
            left: 160px;
            justify-content: center;
            align-items: center;
        }
        .popup-inner .follow-inner {
            position: relative;
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 50px;
            overflow: hidden;
            cursor: pointer;
            color: #fff;
            text-shadow: 0 0 3px #24C2E5,
                         0 0 5px #24C2E5,
                         0 0 7px #24C2E5,
                         0 0 10px #24C2E5,
                         0 0 15px #24C2E5;
        }
        .popup-inner .follow:hover svg, .popup-inner .submit:hover svg {
            animation: followBg 1s infinite;
        }
        .popup-inner .follow:hover .follow-inner, .popup-inner .submit:hover .follow-inner {
            animation: followText 1s infinite;
            text-shadow: 0 0 5px #fff;
        }
        .popup-inner .follow:hover svg, .popup-inner .submit:hover svg {
            filter: url(#drop-shadow);
        }
        .popup-inner .follow:hover followText, .popup-inner .submit:hover followText {
            filter: url(#drop-shadow);
        }
        @keyframes followText {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: translateY(0);
            }
        }
        .popup-inner .follow:active .follow-inner, .popup-inner .submit:active .follow-inner {
            transition: 0s;
            transform: scale(0.9);
            animation: none;
        }
        
        .popup-inner #followBg {
            position: absolute;
            width: 200px;
            top: 0;
            left: 0;
            transform: scaleY(.5) translateY(-50%);
        }
        .popup-inner .friends {
            position: absolute;
            width: 400px;
            height: 550px;
            top: 360px;
            right: 200px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
       
        .popup-inner .friends svg#bg, .popup-inner .friends img#bg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            transform: translateY(0%);
        }
        .popup-inner .friends div:nth-of-type(1) h3 {
            position: absolute;
            top: -2px;
            left: 20px;
            color: #24C2E5;
            font-size: 20px;
            font-weight: 600;
            z-index: 2;
            text-shadow: 0 0 10px #24C2E5;
        }
        .popup-inner .friends div:nth-of-type(2) h3 {
            position: absolute;
            top: -2px;
            right: 20px;
            color: #24C2E5;
            font-size: 20px;
            font-weight: 600;
            z-index: 2;
            text-shadow: 0 0 10px #24C2E5;
        }
        .popup-inner .friends div:hover h3 {
            color: #aff;
            text-shadow: 0 0 10px #fff;
            cursor: pointer;
        }
        .popup-inner .friends div:active h3 {
            transition: 0s;
            transform: scale(0.9);
        }
        .popup-inner .statistics {
            position: absolute;
            width: 500px;
            height: 200px;
            top: 360px;
            left: 160px;
            border-radius: 5px;
            justify-content: center;
            align-items: center;
            padding: 0px;
        }
        .popup-inner .history {
            position: absolute;
            width: 500px;
            height: 300px;
            top: 600px;
            left: 170px;
            justify-content: center;
            align-items: center;
            padding: 0px;
        }
        .popup-inner .history svg#bg, .popup-inner .history img#bg {
            position: absolute;
            width: 100%;
            height: 100%;
            animation: pathDraw 1s;
        }
        .popup-inner .history .content {
            position: relative;
            width: calc(100% - 17px); 
            height: calc(100% - 10px);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #aaa;
            clip-path: url(#clip-history);
        }
        .popup-inner .history .content .nav {
            position: relative;
            width: 100%;
            height: 20%;
            display: flex;
            justify-content: space-between;
        }
        .popup-inner .history .content .nav > div {
            position: relative;
            width: 35%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #aff;
            font-size: 14px;
            font-weight: 600;
            text-shadow: 0 0 5px #aff;
            cursor: pointer;
            box-shadow: 0 0 20px 1px #24C2E5 inset;
            // border: 1px solid #fff;
        }
        .popup-inner .history .content .nav > div:nth-child(1) {
            clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
            background: #24C2E531;
        }
        .popup-inner .history .content .nav > div:nth-child(2) {
            clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%);
            width: 50%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: #24C2E533;
        }
        .popup-inner .history .content .nav > div:nth-child(3) {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 10% 100%);
            background: #24C2E533;
        }
        .popup-inner .history .content .nav > div:hover {
            color: #fff;
            text-shadow: 0 0 5px #fff;
            background: #24C2E555;
        }
        // .popup-inner .history .content .contentWrapper {
        //     position: relative;
        //     width: 100%;
        //     height: 100%;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     overflow: auto;
        //     border: 1px solid #aaa2E5a3;
        // }

        .popup-inner .friends .friendWrapper::-webkit-scrollbar {
            display: none;
            width: 0;
        }
        .popup-inner .friends .wrapper {
            position: absolute;
            left: 50%;
            transform: translateX(calc(-50% + 1px));
            width: 395px;
            height: 487px;
            overflow: hidden;
            bottom: 8px;
            clip-path: url(#clip-friends);
        }
        .popup-inner .friends .friendWrapper {
            position: absolute;
            display: grid;
            gap: 10px;
            left: 0;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            width: 100%;
            height: 100%;
            overflow: auto;
            z-index: -2;
            // background: #07a2; 
            box-shadow: 0 0 100px 1px #24C2E527 inset; 
        }
        .friendWrapper .profile {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100px;
            height: 200px;
            // border : 1px solid #ff0;
            margin: 0 auto;
        }
        .friendWrapper .profile .avatar {
            position: relative;
            width: 100%;
            height: 70%;
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid blue;
        }
        .friendWrapper .profile .info {
            position: relative;
            height: 40px;
            cursor: pointer;
            flex-direction: column;
            justify-content: center;
            // border: 1px solid red;
        }
        .friendWrapper .profile .info img {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            filter: hue-rotate(60deg);
        }
        .friendWrapper .profile .avatar > img {
            position: absolute;
            width: 100%;
            object-fit: cover;
            object-position: center;
            filter: hue-rotate(60deg);
        }
        .friendWrapper .profile .avatar .avatarInfo {
            position: absolute;
            width: 84%;
            height: 84%;
            display: flex;
            flex-direction: column;
            transform: translateY(-2px);
            justify-content: center;
            align-items: center;
            clip-path: url(#userMask);
        }
        .friendWrapper .profile .avatar .avatarInfo img {
            position: relative;
            width: 100%;
            height: 50%;
            object-fit: cover;
            filter: hue-rotate(60deg);
        }
        .friendWrapper .profile .avatar .avatarInfo h3 {
            position: relative;
            width: 100%;
            height: 50%;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #00e5ff;
            font-size: 14px;
            font-weight: 600;
            text-shadow: 0 0 5px #00e5ff;
            border: 1px solid #00e5ff55;
        }
        .friendWrapper .profile .avatar .avatarInfo svg{
            position: absolute;
            top: -5%;
            left: -10%;
            width: 100%;
            height: 100%;
            fill: #00e5ff;
        }
        .friendWrapper .profile .info .infoWrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #00e5ff;
            // border: 1px solid white; 
        }
        .friendWrapper .profile .info .infoWrapper h3 {
            position: relative;
            width: 100%;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            text-shadow: 0 0 5px #00e5ff;
        }

        .statisticsWrapper {
            height: 100%;
            // border: 1px solid #24C2E5;
        }
        
        .circle {
            fill: none;
            stroke-width: 7px;
            stroke: url(#grad);
            transform: rotate(-90deg);
            transform-origin: center;
            animation: animate 2s linear forwards;
        }
        .circle-two{
            fill: none;
            stroke-width: 10px;
            stroke: #0cc;
        }
        @keyframes animate{
            0%{
                stroke-dasharray: 0 1000;
            }
        }
        .statisticsWrapper .title {
            position: absolute;
            height: 50px;
            top: 0;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateX(-50%);
            color: #24C2E5;
            font-size: 20px;
            font-weight: 600;
            text-shadow: 0 0 20px #24C2E5;
        }
        .statisticsWrapper .title h3 {
            position: relative;
        }
        .statisticsWrapper .average {
            position: absolute;
            width: 100%;
            top: 40px;
            height: fit-content;
            display: flex;
            justify-content: space-between;
            // border: 1px solid #24C2E5;
            color: #24C2E5;
        }
        .statisticsWrapper .average h3, .statisticsWrapper .average p {
            position: relative;
            width: 30%;
            color: #bcbcbc;
            font-size: 20px;
            margin: 0 20px;
            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .average p {
            font-size: 12px;
            color: #bcbcbc;
            text-shadow: 0 0 5px #00e5ff;
        }
        .statisticsWrapper .average p em {
            font-size: 20px;
            color: #5AE1A1;
            text-shadow: 0 0 5px #00e5ff;
        }
        .statisticsWrapper .average p em.Iron {
            color: #D3D3D3;
        }

        .statisticsWrapper .average p em.Bronze {
            color: #D2977E;
        }
        .statisticsWrapper .average p em.Silver {
            color: #C0C0C0;
        }
        .statisticsWrapper .average p em.Gold {
            color: #FFD700;
        }
        .statisticsWrapper .average p em.Platinum {
            color: #E5E4E2;
        }
        .statisticsWrapper .average p em.Diamond {
            color: #B9F2FF;
        }
        .statisticsWrapper .average p em.Master {
            color: #FFA500;
        }
        .statisticsWrapper .average p em.Grandmaster {
            color: #FF0000;
        }
        .statisticsWrapper .average p em.Challenger {
            color: #24C2E5;
        }


        .statisticsWrapper .rankIcon {
            position: absolute;
            bottom: 0;
            left: calc(50% + 8px);
            transform: translateX(-50%) translateY(-50%);
            background: radial-gradient(#24C2E5, #0000 70%);
            background-size: 100% 100%;
            background-position: 50% 50%;
            animation: animateRank 4s infinite;
            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .rankIcon img {
            position: relative;
            width: 80px;
        }
        @keyframes animateRank {
            0% {
                transform: translateX(-50%) translateY(-0%) scale(1);
                padding: 70px 0 0 0;
            }
            50% {
                transform: translateX(-50%) translateY(-55%) scale(1.2);
                padding: 0 0 0 0;
            }
            100% {
                transform: translateX(-50%) translateY(-0%) scale(1);
                padding: 70px 0 0 0;
            }
        }
        .statisticsWrapper .stats {
            position: absolute;
            bottom: 15px;
            left: 6px;
            width: 100%;
            height: 90px;
            display: flex;
            justify-content: space-between;
            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .chan1, .statisticsWrapper .stats .chan2 {
            position: relative;
            width: 35%;
            display: flex;
            justify-content: space-between;
            margin: 0 20px;
            color: #a4C2E5;
            align-items: center;
            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .chan1 h3, .statisticsWrapper .stats .chan2 h3 {
            position: relative;
            color: #24C2E5;
            font-size: 10px;
            // border: 1px solid #24C2E5;
        }

        .statisticsWrapper .stats .matches {
            position: relative;
            width: 40%;
            height: 100%;
            text-align: center; 
            justify-content: center;
            align-items: center;

            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .wins {
            position: relative;
            width: 40%;
            height: 100%;
            text-align: center; 
            justify-content: center;
            align-items: center;

            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .losses {
            position: relative;
            width: 40%;
            height: 100%;
            text-align: center; 
            justify-content: center;
            align-items: center;

            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .winRate {
            position: relative;
            width: 40%;
            height: 100%;
            display: flex;
            flex-direction: column;
            text-align: center; 
            justify-content: center;
            align-items: center;

            // border: 1px solid #24C2E5;
        }
        .statisticsWrapper .stats .matches h3 ,.statisticsWrapper .stats .wins h3, .statisticsWrapper .stats .losses h3, .statisticsWrapper .stats .winRate h3 {
            color: #55BCBC;
            font-size: 10px;
        }
        .statisticsWrapper .stats .matches h2, .statisticsWrapper .stats .wins h2, .statisticsWrapper .stats .losses h2 {
            positoin: relative;
            transform: translateY(8px);
            font-size: 18px;
            text-align: center;
        }
        .statisticsWrapper .stats .matches h2 {
            color: #D2977E;
        }
        .statisticsWrapper .stats .wins h2 {
            color: #5AE1A1;
        }
        .statisticsWrapper .stats .losses h2 {
            color: #FF0000;
        }
        .statisticsWrapper .winRate svg {
            position: relative;
            animation: none;
            // border: 1px solid #f00;
            transform: translateY(0);
            top: 0;
        }

        .contentWrapper::-webkit-scrollbar {
            width: 0;
        }
        .contentWrapper {
            position: relative;
            // background-color: #fff;
            
            width: 100%;
            height: 80%;
            overflow: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            // background: #000000;
        }
        .contentWrapper svg {
            position: absolute;
            all: initial;
        }
        .info {
            position: sticky;
            top: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            height: 30px;
            z-index: 10;
            // border: 1px solid #ffffff44;
            font-size: 0.4em;
            // background-color: #055;
        }
        .info h1 {
            position: relative;
            width: 25%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background-color: #055;
            // background-color: #f0f0f0;
        }
        .player {
            width: 100%;
            height: 25%;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            // border: 1px solid #ffffff44;
        }
        .HeroInfo {
            width: 75%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            // border: 1px solid #f00;
        }
        .HeroInfo h1 {
            width: 25%;
            // border: 1px solid #ffffff44;
            text-align: center;
            font-size: 0.9em;
        }
        .Hero {
            width: 25%;
            justify-content: space-between;
            height: 100%;
            display: flex;
            align-items: center;
            // border: 1px solid #f00;
        }
        .Hero h1 {
            position: relative;
            width: 60%;
            font-size: 0.5em;
            color: #fff;
            // border: 1px solid #ffffff44;
        }
        .player img {
            position: relative;
            left: 5px;
            width: 30%;
            height: 67%;

            clip-path: url(#clip10);
            // border: 1px solid #ffffff44;
        }
        .player svg {
            width: 36px;
            left: 6px;
            // border: 1px solid #ffffff44;
        }
        .game {
            position: relative;
            width: 100%;
            height: 25%;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            border: 1px solid #ffffff22;
        }
        .game div {
            position: relative;
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            // border: 1px solid #ffffff44;
        }
        .game .win, .game .lose {
            position: absolute;
            width: 50%;
            height: 100%;
            z-index: -1;
            opacity: 0.5;
        }
        .game .win {
            left: 0;
            opacity: 0.6;
        }
        .game .lose {
            right: 0;
        }
        .game .win img, .game .lose img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: hue-rotate(150deg);
        }
        .game div:nth-of-type(2) {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 0.5em;
            color: #fff;
        }
        .game div:nth-of-type(1), .game div:nth-of-type(3) {
            position: relative;
            width: 35%;
            text-align: space-between;
            // border: 1px solid #ffffff44;
            font-size: 0.5em;
        }
        .game div:nth-of-type(3) {
            transform: translateX(-10px);
        }
        .game div:nth-of-type(1) img, .game div:nth-of-type(3) img {
            width: 25%;
            height: 100%;
            // border: 1px solid #ffffff44;
        }
        .game div:nth-of-type(1) h1, .game div:nth-of-type(3) h1 {
            width: 70%;
            // border : 1px solid #ffffff44;
        }
        .game div:nth-of-type(1) h1 {
            transform: translateX(8px);
        }
        .game div:nth-of-type(1) svg {
            position: absolute;
            height: 100%;
            left: 9px;
            // border: 1px solid #ffffff44;
        }
        .game div:nth-of-type(3) svg {
            position: absolute;
            height: 100%;
            left: calc(100% - 38px);
            // border: 1px solid #ffffff44;
        }
        .game div:nth-of-type(3) h1 {
            text-align: right;
        }
        .game div:nth-of-type(1) img {
            border 
        }
        .game div:nth-of-type(2) h1 {
            width: 25%;
            text-align: center;
            // border: 1px solid #ffffff44;
        }
        .game div:nth-of-type(2) > :nth-child(2) {
            font-size: 3em;
            width: 60%;
            color: #055;
            // border: 1px solid #ffffff44;
        }
        .game2 {
            position: relative;
            width: 100%;
            height: 45%;
            display: flex;
            justify-content: space-between;
            // border: 1px solid #ffffff22;
            // background: linear-gradient( #0ff00000, #5524, #0ff00000);
        }
        .game2 .win, .game2 .lose {
            position: absolute;
            width: 50%;
            height: 100%;
            z-index: -1;
            opacity: 0.5;
        }
        .game2 .win {
            left: 0;
            opacity: 0.6;
        }
        .game2 .lose {
            right: 0;
        }
        .game2 .win img, .game2 .lose img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: hue-rotate(150deg);
        }
        .team {
            position: relative;
            width: 35%;
            height: 100%;
            display: flex;
            flex-direction: column;
            // border: 1px solid #f00;
        }
        .game2 > div:nth-of-type(1) {
            transform: translateX(10px);
        }
        .game2 > div:nth-of-type(3) {
            transform: translateX(-10px);
        }
        .game2 > div:nth-of-type(2) {
            position: relative;
            width: 30%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            text-align: center;
            align-items: center;
            font-size: 0.5em;
            color: #fff;
        }
        .game2 > div:nth-of-type(2) h1 {
            width: 40%;
            border: 1px solid #ffffff44;
        }
        .game2 > div:nth-of-type(2) h1:nth-of-type(2) {
            width: 20%;
            font-size: 5em;
            // border: 1px solid #ffffff44;
        }
        .teamPlayer {
            position: relative;
            height: 50%;
            width: 100%;
            display: flex;
            flex-direction: row;
            font-size: 1em;
            justify-content: space-around;
            align-items: center;
            // border: 1px solid #000;
        }
        .teamPlayer h1 {
            position: relative;
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 18px;
            // border: 1px solid #ffffff44;
        }
        .teamPlayer img {
            position: relative;
            clip-path: url(#clip12);
        }
        .team:nth-of-type(1) img, .team:nth-of-type(3) img {
            position: relative;
            width: 100%;
            height: 100%;
            // border: 1px solid #ffffff44;
        }
        .teamPlayer svg {
            position: absolute;
            height: 130%;
            width: 36px;
            top: calc(50% - 2px);
            transform: translateY(-50%);
            // border: 1px solid #ffffff44;
        }
        .team:nth-of-type(1) .teamPlayer:nth-of-type(1) svg {
            left: 24px;
        }
        .team:nth-of-type(1) .teamPlayer:nth-of-type(2) svg {
            left: 24px;
        }
        .team:nth-of-type(3) .teamPlayer:nth-of-type(1) svg {
            left: calc(100% - 61px);
        }
        .team:nth-of-type(3) .teamPlayer:nth-of-type(2) svg {
            left: calc(100% - 61px);
        }
        .tournament {
            position: relative;
            width: 100%;
            height: 80%;
            display: grid;
            grid-template-columns: 25% 25% 25% 25%;
            align-items: center;
            border: 1px solid #ffffff22;
        }
        .rank1, .rank2, .rank3, .rank4 {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            border: 1px solid #ffffff22;
        }
        .rank1 div, .rank2 div, .rank3 div, .rank4 div {
            position: relative;
            width: 100%;
            height: 33.33%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            // border: 1px solid #ffffff44;
        }
        .rank1 img, .rank2 img, .rank3 img, .rank4 img {
            position: relative;
            top: 5px;
            width: 45px;
            height: 45px;
            clip-path: url(#clip10);
            // border: 1px solid #00f;
        }
        .rank1 svg, .rank2 svg, .rank3 svg, .rank4 svg {
            position: absolute;
            top: 15.5px;
            height: 48px;
            width: 48px;
            // border: 1px solid #ffffff44;
        }
        .rank1 h1, .rank2 h1, .rank3 h1, .rank4 h1 {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            align-items: center;
            font-size: 0.5em;
            color: #fff;
            // border: 1px solid #ffffff44;
        }
        .rank1 .rankTitle, .rank2 .rankTitle, .rank3 .rankTitle, .rank4 .rankTitle {
            font-size: 1em;
            color: #ff0;
        }
        a#pages {
            position: absolute;
            width: 100%;
            height: 50px;
            z-index: 10;
        }
        img#avBg {
            all: initial;
            position: absolute;
            width: 300px;
            height: 224px;
            top: calc(50% + 7px);
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            z-index: 10;
        }
        .bg3Container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            z-index: -1;
            border-radius: 10px;
        }
        .bg3 {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
        @media screen and (min-width: 1350px) {
            .popup-inner  .bgs1 {
                display: block;
            }
            .popup-inner  .bgs2 {
                display: none;
            }

        }
        input[type="file"] {
            display: none;
          }
        .popup-inner .changeAvatar {
            position: absolute;
            width: 200px;
            height: 40px;
            top: 280px;
            left: 340px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #005550;
            border-bottom: 2px solid #00FFF0;
            border-left: 2px solid #00FFF0;
            border-right: 1px solid #005550;
            border-radius:  0 0 0 50px;
            overflow: hidden;
        }
        .popup-inner .changeUsername {
            position: absolute;
            width: 200px;
            height: 40px;
            top: 280px;
            right: 340px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #005550;
            border-bottom: 2px solid #00FFF0;
            border-left: 1px solid #005550;
            border-right: 2px solid #00FFF0;
            border-radius:  0 0 50px 0;
            overflow: hidden;
        }
        .popup-inner .changeUsername input {
            position: absolute;
            width: calc(100% - 40px);
            height: calc(100% - 40px);
            background-color: #0000;
            padding: 20px;
            color: #fff;
            // opacity: 0;
        }
        .popup-inner .changeUsername input::placeholder, .popup-inner .changeAvatar label {
            color: #fffa;
            font-size: 14px;
            text-align: center;
        }
        .popup-inner .changeUsername input:hover {
            background-color: #fff2;
        }
        .popup-inner .changeUsername input:focus {
            color: #aff;
        }
        .popup-inner .changeUsername input label {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .custom-file-upload {
            position: absolute;
            width: calc(100% - 40px);
            height: calc(100% - 40px);
            background-color: #0000;
            padding: 20px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;

            // opacity: 0;
        }
        
        .custom-file-upload:hover {
            background-color: #fff2;
        }
        .custom-file-upload:focus {
            color: #aff;
        }


        @media screen and (max-width: 1350px) {
            .popup-inner  .bgs1 {
                display: none;
            }
            .popup-inner  .bgs2 {
                display: block;
                width: 800px;
            }
            .popup-inner > .avatar {
                top: 96px;
            }
            .popup-inner .follow, .popup-inner .submit {
                top: 1650px;
                left: 20%;
                font-size: 14px;
                width: 150px;
            }
            .popup-inner .follow .follow-inner, .popup-inner .submit .follow-inner {
                top: -5px;
            }
            .popup-inner #followBg {
                width: 100%;
            }
            .popup-inner {
                max-width: 800px;
                justify-content: center;
            }
            .popup > img {
                top: 1750px;
            }
            .popup-inner .friends {
                top: 1050px;
                // border: 1px solid #24C2E5;
            }
            .popup-inner .statistics {
                top: 440px;
                left: calc(50% - 10px);
                transform: translateX(-50%);
                // border: 1px solid #24C2E5;
            }
            .popup-inner .history {
                top: 680px;
                left: 50%;
                transform: translateX(-50%);
                // border: 1px solid #24C2E5;
            }
            .popup-inner .changeAvatar {
                top: 330px;
                left: 150px;
            }
            .popup-inner .changeUsername {
                top: 330px;
                right: 150px;
            }

        }
        @media screen and (max-width: 800px) {
            .popup-inner {
                max-width: 400px;
                transform: translateX(-50%) scale(0.7) translateY(-400px);
                justify-content: none;
            }
            .popup-inner > .avatar {
                transform: translateX(-50%) scale(0.9) translateY(10px) translateX(3px);

            }
            .popup-inner .statistics, .popup-inner .history {
                transform: translateX(-50%) scale(0.9);
            }
            .popup-inner .friends {
                left: 50%;
                transform: scale(0.9) translateX(-50%) translateX(-23px);
            }
            .popup > img {
                top: 1220px;
                transform: translateX(-20) scale(0.7);
            }
            .popup-inner .follow, .popup-inner .submit {
                left: 0;
            }
            .popup-inner .changeAvatar {
                top: 330px;
                left: -20px;
            }
            .popup-inner .changeUsername {
                top: 330px;
                right: -20px;
            }
        }
        </style>
        <div class="popup">
            <img src="https://localhost/assets/images/tenor.gif">
            <div class="popup-inner">
                <img src="https://localhost/assets/images/profile/screen.svg" id="bg" class="bgs1">
                <img src="https://localhost/assets/images/profile/screen 2.svg" id="bg" class="bgs2">
                <div class="avatar">
                    <div class="bg3Container">
                        <img src="https://localhost/assets/images/bg3.gif" class="bg3">
                    </div>
                    <img src="${context.profileOfUser.player.avatarUrl}">
                    <img id="avBg" src="https://localhost/assets/images/profile/avatarScreen.svg">
                    <h2>${context.profileOfUser.player.nickname}</h2>
                </div>
                <div class="follow" style="display: ${context.profileOfUser.player.name === context.user.name ? "none" : "block"}">
                    <img id="followBg" src="https://localhost/assets/images/profile/followScreen.svg">
                    <div class="follow-inner" onclick="followUser()">
                        <h3>${context.profileOfUser.doIFollow ? "Unfollow" : "Follow"}</h3>
                    </div>
                </div>
                <div class="submit" style="display: ${context.profileOfUser.player.name !== context.user.name ? "none" : "block"}">
                    <img id="followBg" src="https://localhost/assets/images/profile/followScreen.svg">
                    <div class="follow-inner" onclick="submitChanges()">
                        <h3>Submit Changes</h3>
                    </div>
                </div>
                <div class="changeAvatar" style="display: ${context.profileOfUser.player.name === context.user.name ? "flex" : "none"}">
                    <label for="avatar" class="custom-file-upload">
                        <span>Change Avatar</span>
                    </label>
                    <input type="file" id="avatar" accept="image/*">
                </div>
                <div class="changeUsername" style="display: ${context.profileOfUser.player.name === context.user.name ? "flex" : "none"}">
                    <input type="text" id="username" placeholder="Change Username">
                </div>
                <div class="friends">
                    <img id="bg" src="https://localhost/assets/images/profile/friendsScreen2.svg">
                    <svg id="bg" width="180" height="241" viewBox="0 0 180 241" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <clipPath id="clip-friends" transform="translate(-2 -46) scale(2.21)">
                            <path d="M1 21H179.5V218.5L157.5 240.5H24.5L1 217V21Z" fill="#073C7011" fill-opacity="0.55" stroke="#00FFF0" stroke-opacity="0.63"/>
                        </clipPath>
                    </svg>
                    <div class="title1" onclick="changeFriends('followers')">
                        <h3>Followers</h3>
                    </div>
                    <div class="title2" onclick="changeFriends('following')">
                        <h3>Following</h3>
                    </div>
                    <div class="wrapper">
                        <div class="friendWrapper">
                        </div>
                    </div>
                </div>
                <div class="statistics">
                    <img src="https://localhost/assets/images/profile/statisticsScreen.svg">
                    <div class="statisticsWrapper">
                    </div>
                </div>
                <div class="history">
                    <img id="bg" src="https://localhost/assets/images/profile/historyScreen.svg">
                    <svg id="bg" width="576" height="346" viewBox="0 0 576 346" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <clipPath id="clip-history" transform="translate(-8 -4) scale(0.866)">
                                <path d="M22 15.5L30.5 7H50.5L59 15.5H22Z" fill="#00FF66" fill-opacity="0.1" stroke-width="5"/>
                                <path d="M517.5 15.5L526 7H546L554.5 15.5H517.5Z" fill="#00FF66" fill-opacity="0.1" stroke-width="5"/>
                                <path d="M564.5 25.5L558.5 19.5H382.5L378.5 15.5H197.5L193.5 19.5H17.5L10.5 26.5V56.5L17.5 63.5V95.5L10.5 102.5V158.5L18.5 166.5V266.5L9.5 275.5V282.5L12.5 285.5V305.5L10.5 307.5V327.5L18.5 335.5H45L47 333.5H83.5L85.5 335.5H239.5L250.5 324.5H325.5L337 336H490L492.5 333.5H528.5L531 336H557.5L565.5 328V308L563.5 306V285.5L566.5 282.5V275.5L557.5 266.5V166.5L564.5 159.5V101.5L557.5 94.5V64.5L564.5 57.5V25.5Z" fill="#005F16aa" fill-opacity="0.1" stroke-width="5"/>
                        </clipPath>
                    </svg>
                    
                    <div class="content">
                        <div class="nav">
                            <div class="game1vs1" onclick="changeHistory('1v1')">
                                <h3>1v1</h3>
                            </div>
                            <div class="tournament" onclick="changeHistory('tournament')">
                                <h3>tournament</h3>
                            </div>
                            <div class="game2vs2" onclick="changeHistory('2v2')">
                                <h3>2v2</h3>
                            </div>
                        </div>
                        <div class="contentWrapper">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
        this.fillFriends("followers");
        this.fillStatistics();
        this.fillHistory();

    }
    fillFriends(toShow) {
        const friendWrapper = this.shadowRoot.querySelector(".friendWrapper");
        friendWrapper.innerHTML = "";
        const followUsers = toShow === "followers" ? context.profileOfUser.followers : context.profileOfUser.following;
        for (let i = 0; i < followUsers.length; i++) {
            friendWrapper.innerHTML += `
                <div class="profile" id="profile${i}">
                    <div class="avatar">
                        <img src="https://localhost/assets/images/profileScreen.svg" alt="profile">
                        <div class="avatarInfo">
                            <img src="${followUsers[i].avatarUrl}" alt="profile">
                            <h3>${followUsers[i].nickname}</h3>
                            <svg viewBox="0 0 277 363" fill="none">
                                <clipPath id="userMask" x="0" y="0" transform="scale(0.36) translate(-22, -15)">
                                    <path d="M234 22H43L22 43V319.5L43 340.5H234L255 319.5V43L234 22Z" fill="#00FEFF30"/>
                                </clipPath>
                            </svg>
                        </div>
                    </div>
                    <div class="info">
                        <a href="/profile" id="pages" class="profilePage" playerName="${followUsers[i].name}"></a>
                        <img src="https://localhost/assets/images/nameScreen.svg" alt="profile">
                        <div class="infoWrapper">
                            <h3>show</h3>
                        </div>
                    </div>
                </div>
            `;
        }
        const theAllProfile = this;
        this.shadowRoot.querySelectorAll("a#pages").forEach((a) =>
            a.addEventListener("click", async (event) => {
                if (theAllProfile.__enter) {
                    theAllProfile.__enter = false;
                    console.log(event.target.getAttribute("playerName"), "]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
                    event.preventDefault();
                    context.track.initProfileOfUser.name = event.target.getAttribute("playerName");
                    await context.navigation(event);
                }
            })
        );
    }
    fillStatistics() {
        const statisticsWrapper =
            this.shadowRoot.querySelector(".statisticsWrapper");
        statisticsWrapper.innerHTML = `
            <div class="title">
                <h3>Your Summary</h3>
            </div>
            <div class="average">
                <h3>On average:</h3>
                <p>You played like <em class="${context.profileOfUser.grade}">${context.profileOfUser.grade}</em></p>
            </div>
            <div class="stats">
                <div class="chan1">
                    <div class="matches">
                        <h3>MATCHES</h3>
                        <h2>${context.profileOfUser.totalGamesPlayed}</h2>
                    </div>
                    <div class="wins">
                        <h3>WINS</h3>
                        <h2>${context.profileOfUser.totalGamesWon}</h2>
                    </div>
                </div>
                <div class="chan2">
                    <div class="losses">
                        <h3>LOSSES</h3>
                        <h2>${context.profileOfUser.totalGamesLost}</h2>
                    </div>
                    <div class="winRate">
                        <h3>WINRATE</h3>
                        <svg viewbox= "0 0 100 100" class="pers">
                            <defs>
                                <linearGradient id = "grad">
                                    <stop offset = "0%" style = "stop-color: rgba(120,50,170)"/>
                                    <stop offset = "100%" style = "stop-color: rgba(10,20,200)"/>
                                </linearGradient>
                            </defs>
                            <circle
                                cx = "${100 / 2}",
                                cy = "${100 / 2}",
                                r = 45
                                class = 'circle-two'
                            />
                            <circle
                                cx = "${100 / 2}",
                                cy = "${100 / 2}",
                                r = 45
                                class = 'circle'
                                stroke-dasharray = "calc(2 * 3.14 * 45 * ${context.profileOfUser.winRate} / 100) calc(2 * 3.14 * 45)"
                            />
                            <text x="50" y="50" text-anchor="middle" dy=".1em" fill="url(#grad)" font-size="26" transform="translate(0, 7)">${context.profileOfUser.winRate}%</text>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="rankIcon">
                <img src="https://localhost/assets/images/leagues/${context.profileOfUser.league}.png" alt="rank">
            </div>
        `;
    }
    fillHistory() {
        const contentWrapper = this.shadowRoot.querySelector(".contentWrapper");
        if (!this.__show) {
            if (this.__choice === "1v1")
                showGame1Vs1HistoryProfile(contentWrapper);
            else if (this.__choice === "tournament")
                showTournamentHistoryProfile(contentWrapper);
            else if (this.__choice === "2v2")
                showGame2Vs2HistoryProfile(contentWrapper);
        }
    }
    set __choice(value) {
        this._choice = value;
    }
    get __choice() {
        return this._choice;
    }
}

function changeHistory(choice) {
    const popup = document.querySelector("custom-profile");
    popup.__choice = choice;
    popup.__show = false;
    popup.fillHistory();
}

customElements.define("custom-profile", PopUpProfile);

function createProfilePage() {
    const div = document.createElement("div");
    const popup = document.createElement("custom-profile");

    popup.setAttribute("id", 0);

    div.appendChild(popup);
    div.setAttribute("class", "page profilePage");
    document.body.appendChild(div);
}

function showGame1Vs1HistoryProfile(data) {
    data.innerHTML = `
            ${context.profileOfUser.games1v1
                .map(
                    (game) => `
                <div class="game">
                    <div class="player">
                        <img src="${game.player1.avatarUrl}" alt="friend">
                        <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                            <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                            <clipPath id="clip10" transform="translate(2.500642 6.576274)">
                                <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="2"/>
                            </clipPath>
                            <defs>
                                <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#000"/>
                                    <stop offset="1" stop-color="#00EBFF55"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <h1>${game.player1.nickname}</h1>
                    </div>
                    <div>
                        <h1>${game.score1}</h1>
                        <h1>Vs</h1>
                        <h1> ${game.score2}</h1>
                    </div>
                    <div class="player">
                        <h1>${game.player2.nickname}</h1>
                        <img src="${game.player2.avatarUrl}" alt="friend">
                        <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                            <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                            <defs>
                                <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#000"/>
                                    <stop offset="1" stop-color="#00EBFF55"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div class="win">
                        <img src="https://localhost/assets/images/win.jpeg" alt="win">
                    </div>
                    <div class="lose">
                        <img src="https://localhost/assets/images/lose.jpeg" alt="lose">
                    </div>
                </div>
            `
                )
                .join("")}
        `;
}
function showGame2Vs2HistoryProfile(data) {
    data.innerHTML = `
            ${context.profileOfUser.games2v2
                .map(
                    (game) => `
                <div class="game2">
                    <div class="team">
                        <div class="teamPlayer">
                            <img src="${game.player1?.avatarUrl}" alt="friend">
                            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                                <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                                <clipPath id="clip12" transform="translate(24.500642 1.076274)">
                                    <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="2"/>
                                </clipPath>
                                <defs>
                                    <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#000"/>
                                        <stop offset="1" stop-color="#00EBFF55"/>
                                    </linearGradient>
                                </
                            </svg>
                            <h1>${game.player1?.nickname}</h1>
                        </div>
                        <div class="teamPlayer">
                            <img src="${game.player3?.avatarUrl}" alt="friend">
                            <h1>${game.player3?.nickname}</h1>
                            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                                <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                                <defs>
                                    <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#000"/>
                                        <stop offset="1" stop-color="#00EBFF55"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1>${game.score1}</h1>
                        <h1>Vs</h1>
                        <h1> ${game.score2}</h1>
                    </div>
                    <div class="team">
                        <div class="teamPlayer">
                            <h1>${game.player2?.nickname}</h1>
                            <img src="${game.player2?.avatarUrl}" alt="friend">
                            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                                <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                                <defs>
                                    <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#000"/>
                                        <stop offset="1" stop-color="#00EBFF55"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="teamPlayer">
                            
                            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                                <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
                                <defs>
                                    <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#000"/>
                                        <stop offset="1" stop-color="#00EBFF55"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h1>${game.player4?.nickname}</h1>
                            <img src="${game.player4?.avatarUrl}" alt="friend">
                        </div>
                    </div>
                    <div class="win">
                        <img src="https://localhost/assets/images/win.jpeg" alt="win">
                    </div>
                    <div class="lose">
                        <img src="https://localhost/assets/images/lose.jpeg" alt="lose">
                    </div>
                </div>
            `
                )
                .join("")}
        `;
}

function showTournamentHistoryProfile(data) {
    const tournamentData = [
        [
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 1",
                score: 20,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 2",
                score: 15,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 3",
                score: 10,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 4",
                score: 5,
            },
        ],
        [
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 5",
                score: 30,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 6",
                score: 25,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 7",
                score: 20,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 8",
                score: 15,
            },
        ],
        [
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 9",
                score: 10,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 10",
                score: 5,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 11",
                score: 30,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 12",
                score: 25,
            },
        ],
        [
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 13",
                score: 20,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 14",
                score: 15,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 15",
                score: 10,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 16",
                score: 5,
            },
        ],
        [
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 17",
                score: 30,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 18",
                score: 25,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar1.svg",
                player: "Player 19",
                score: 20,
            },
            {
                avatar: "https://localhost/assets/images/devCard/avatar3.svg",
                player: "Player 20",
                score: 15,
            },
        ],
    ];
    const rankTitle = ["1st", "2nd", "3rd", "4th", "5th"];
    // data.innerHTML = `
    //         ${context.profileOfUser.tournaments
    //             .map(
    //                 (tournaments) => `
    //             <div class="tournament">
    //                 ${tournaments
    //                     .map(
    //                         (player, index) => `
    //                     <div class="rank${index + 1}">
    //                         <img src="${player.avatar}" alt="friend">
    //                         <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
    //                             <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="3"/>
    //                             <defs>
    //                                 <clipPath id="clip10" transform="translate(4.50064 1.07627)">
    //                                     <path d="M18.5204 2.14608L18 1.82893L17.4796 2.14608L1.89114 11.6461L1.41154 11.9384V12.5V31.5V32.0616L1.89114 32.3539L17.4796 41.8539L18 42.1711L18.5204 41.8539L34.1089 32.3539L34.5885 32.0616V31.5V12.5V11.9384L34.1089 11.6461L18.5204 2.14608Z" fill="url(#pattern0)" stroke="url(#paint0_linear_268_905)" stroke-width="1"/>
    //                                 </clipPath>
    //                                 <linearGradient id="paint0_linear_268_905" x1="8.59091" y1="3" x2="29.0565" y2="40.091" gradientUnits="userSpaceOnUse">
    //                                     <stop stop-color="#000"/>
    //                                     <stop offset="1" stop-color="#00EBFF55"/>
    //                                 </linearGradient>
    //                             </defs>
    //                         </svg>
    //                         <div>
    //                             <h1>${player.player}</h1>
    //                             <h1>Score : ${player.score}</h1>
    //                             <h1 class="rankTitle">${rankTitle[index]}</h1>
    //                         </div>
    //                     </div>
    //                 `
    //                     )
    //                     .join("")}
    //             </div>
    //         `
    //             )
    //             .join("")}
    // `;
}

function changeFriends(choice) {
    const popup = document.querySelector("custom-profile");
    popup.fillFriends(choice);
}

function followUser() {
    const popup = document.querySelector("custom-profile");

    if (context.profileOfUser.player.name === context.user.name) return;

    if (context.profileOfUser.doIFollow === true) {
        console.log(context.profileOfUser.followers)
        context.profileOfUser.followers = context.profileOfUser.followers.filter(
            (user) => user.name !== context.user.name
        );
        context.unfollow(context.profileOfUser.player.name);

        context.profileOfUser.doIFollow = false;
    } else {
        context.profileOfUser.followers.push(context.user);
        context.follow(context.profileOfUser.player.name);
        context.profileOfUser.doIFollow = true;
    }
    popup.fillFriends("followers");

    popup.shadowRoot.querySelector(".follow-inner").innerHTML = `
        <h3>${context.profileOfUser.followers.includes(context.user) ? "Unfollow" : "Follow"}</h3>
    `;
}

function submitChanges() {
    const popup = document.querySelector("custom-profile");

    const username = popup.shadowRoot.querySelector("#username").value;
    const avatar = popup.shadowRoot.querySelector("#avatar").files[0];
    console.log(username, avatar);

    if (username) {
        context.changeNickname(username);
        // check if successful and change the username in the profile

        popup.shadowRoot.querySelector(".avatar h2").innerHTML = username;
        popup.shadowRoot.querySelector("#username").value = "";
        context.user.nickname = username;
    }
    if (avatar) {
        context.changeAvatar(avatar);
    }
}