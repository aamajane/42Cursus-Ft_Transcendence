class CustomDiv extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    }
    render() {
        this.innerHTML = `
        <style>
            .svgsContainer {
                position: fixed;
                overflow: hidden;
                height: 100%;
                width: 100%;
                opacity: 1;
                z-index: 1;
            }
            
            .svgsContainer:nth-of-type(1) {
                transform: rotateX(180deg) rotateY(180deg);
            }
            
            .svgsContainer .svgBg {
                position : absolute;
                width: 30%;
                margin: 10px;
                height: 400px;
                right: 0;
                top: 0;
            }
            .svgsContainer .svgBg:hover {
                transform: scale(10);
            }
            .svgsContainer .svgBg svg  path {
                fill: red;
            }
            .svgsContainer .svgBg#to32 {
                left: 0;
                top: 1000px;
                transform: rotate(-9deg) scale(1.2);
                animation: trAnimation5 6s infinite;
            }
            .svgsContainer .svgBg#to33{
                left: 0;
                top: 850px;
                transform: rotate(-8deg) scale(1.2);
                animation: trAnimation4 6s infinite;
            }
            .svgsContainer .svgBg#to34{
                left: 0;
                top: 450px;
                transform: rotate(-4deg) scale(1.5) translateX(-10px);
                animation: trAnimation1 6s infinite;
            }
            .svgsContainer .svgBg#to35 {
                left: -200px;
                top: 320px;
                transform: rotate(-7.7deg) scale(4);
                animation: trAnimation2 12s infinite;
            }
            .svgsContainer .svgBg#to36 {
                left: -40px;
                top: 450px;
                transform: rotate(-6deg) translateX(-70px);
                animation: trAnimation1 8s infinite;
            }
            .svgsContainer .svgBg#to37 {
                left: -100px;
                top: 450px;
                transform: rotate(-3deg) translateX(-140px);
                animation: trAnimation1 10s infinite;
            }
            .svgsContainer .svgBg#to38 {
                left: -200px;
                top: 320px;
                transform: rotate(-7deg) scale(4);
                animation: trAnimation3 12s infinite;
            }
            .svgsContainer .svgBg#to39 {
                left: 0;
                top: -10px;
                transform: rotate(-8deg);
                animation: trAnimation6 12s infinite;
            }
            .svgsContainer .svgBg#to40 {
                left: 0;
                top: 100px;
                transform: rotate(-8deg);
                animation: trAnimation7 8s infinite;
            }
            .svgsContainer .svgBg#to41 {
                left: -100px;
                top: -150px;
                transform: rotate(-7deg);
                animation: trAnimation8 6s infinite;
            }
            .svgsContainer #gradient1 stop {
                animation: gradientAnimation1 6s infinite;
            }
            .svgsContainer #gradient01 stop {
                animation: gradientAnimation1 9s infinite;
            }
            .svgsContainer #gradient2 stop {
                animation: gradientAnimation2 3s infinite;
            }
            .svgsContainer #gradient3 stop {
                animation: gradientAnimation3 4s infinite;
            }
            .svgsContainer #gradient4 stop {
                animation: gradientAnimation4 5s infinite;
            }
            .svgsContainer #gradient5 stop {
                animation: gradientAnimation5 8s infinite;
            }
            .svgsContainer #gradient6 stop {
                animation: gradientAnimation6 7s infinite;
            }
            
            @keyframes trAnimation1 {
                0% {
                    left : 0;
                }
                50% {
                    left : 10px;
                }
                75% {
                    left : 50px;
                }
                100% {
                    left : 0;
                }
            }
            
            @keyframes trAnimation2 {
                0% {
                    left: -200px;
                    top: 320px;
                }
                25% {
                    left: -170px;
                    top: 270px;
                }
                100% {
                    left: -200px;
                    top: 320px;
                }
            }
            
            @keyframes trAnimation3 {
                0% {
                    left: -190px;
                    top: 320px;
                }
                25% {
                    left: -220px;
                    top: 360px;
                }
                100% {
                    left: -190px;
                    top: 320px;
                }
            }
            
            @keyframes trAnimation4 {
                0% {
                    left: 0;
                    top: 850px;
                }
                25% {
                    left: 30px;
                    top: 800px;
                }
                100% {
                    left: 0;
                    top: 850px;
                }
            }
            
            @keyframes trAnimation5 {
                0% {
                    left: 0;
                    top: 1000px;
                }
                75% {
                    left: -30px;
                    top: 1050px;
                }
                100% {
                    left: 0;
                    top: 1000px;
                }
            }
            
            @keyframes trAnimation6 {
                0% {
                    left: 0;
                    top: -10px;
                }
                20% {
                    left: 0;
                    top: -10px;
                }
                50% {
                    left: 100px;
                    top: 80px;
                }
                80% {
                    left: 0;
                    top: -10px;
                }
                100% {
                    left: 0;
                    top: -10px;
                }
            }
            
            @keyframes trAnimation7 {
                0% {
                    left: 150px;
                    top: 240px;
                }
                30% {
                    left: 0px;
                    top: 90px;
                }
                60% {
                    left: 0px;
                    top: 90px;
                }
                100% {
                    left: 150px;
                    top: 240px;
                }
            }
            
            @keyframes trAnimation8 {
                0% {
                    left: -100px;
                    top: -150px;
                }
                20% {
                    left: -100px;
                    top: -150px;
                }
                50% {
                    left: -50px;
                    top: -100px;
                }
                80% {
                    left: -100px;
                    top: -150px;
                }
                100% {
                    left: -100px;
                    top: -150px;
                }
            }
            
            @keyframes gradientAnimation1 {
                0% {
                    stop-color: #64ffb5;
                }
                50% {
                    stop-color: #0d7e75;
                }
                100% {
                    stop-color: #64ffb5;
                }
            }
            
            @keyframes gradientAnimation2 {
                0% {
                    stop-color: #bafffa;
                }
                50% {
                    stop-color: #64ffb5;
                }
                100% {
                    stop-color: #bafffa;
                }
            }
            
            @keyframes gradientAnimation3 {
                0% {
                    stop-color: #226666;
                }
                50% {
                    stop-color: #bbccdd;
                }
                100% {
                    stop-color: #bafffa;
                }
            }
            
            @keyframes gradientAnimation4 {
                0% {
                    stop-color: #bbccdd;
                }
                50% {
                    stop-color: #226666;
                }
                100% {
                    stop-color: #bbccdd;
                }
            }
            
            @keyframes gradientAnimation5 {
                0% {
                    stop-color: #2af4e5;
                }
                50% {
                    stop-color: #226666;
                }
                100% {
                    stop-color: #2af4e5;
                }
            }
            
            @keyframes gradientAnimation6 {
                0% {
                    stop-color: #2af4e5;
                }
                50% {
                    stop-color: #226666;
                }
                100% {
                    stop-color: #2af4e5;
                }
            }
        </style>
        <div  class="svgsContainer">
        <div class="bg"></div>
            <svg width="283" height="365" viewBox="0 0 283 365" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to32" alt="shap">
                <path d="M1 328.5L282 2V113.5L243.5 155V113.5L33.5 364L1 328.5Z" stroke="none" fill="url(#gradient1)"/>
            </svg>
            <svg width="346" height="455" viewBox="0 0 346 455" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to33" alt="shap">
                <path d="M216 56L264.5 1L345 102L43.5 453.5L1 408.5L252 97L216 56Z" stroke="none" fill="url(#gradient2)"/>
            </svg>
            <svg width="267" height="611" viewBox="0 0 267 611" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to34" alt="shap">
                <path d="M28 609L266 298.5L0.5 2V46L221 298.5L28 557.5V609Z" stroke="none" fill="url(#gradient01)"/>
            </svg>
            <svg width="464" height="832" viewBox="0 0 464 832" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to35" alt="shap">
                <path d="M224.5 831.5L462.5 550L1 1" stroke="#dbc8ff55"/>
            </svg>
            <svg width="337" height="775" viewBox="0 0 337 775" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to36" alt="shap">
                <path d="M17 1.5L335.5 384L10.5 773V730.5L297 379L1.5 21.5L17 1.5Z" stroke="none" fill="url(#gradient3)"/>
            </svg>
            <svg width="173" height="368" viewBox="0 0 173 368" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to37" alt="shap">
                <path d="M28 366.5L172 181.5L0.5 1.5V39L131 181.5L28 320.5V366.5Z" stroke="none" fill="url(#gradient4)"/>
            </svg>
            <svg width="405" height="832" viewBox="0 0 405 832" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to38" alt="shap" style="z-index: -1;">
                <path d="M1 1L404 471L100 831.5" stroke="#9988ff55"/>
            </svg>
            <svg width="399" height="416" viewBox="0 0 399 416" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to39" alt="shap">
                <path d="M397.5 0.5L338.5 414.5L2 0.5H41L316 338L357.5 0.5H397.5Z" stroke="none" fill="url(#gradient2)"/>
            </svg>
            <svg width="331" height="424" viewBox="0 0 331 424" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to40" alt="shap">
                <path d="M257 422.5L330 331.5L64.5 1L1 40L244.5 322.5L208.5 369L257 422.5Z" stroke="none" fill="url(#gradient5)"/>
            </svg>
            <svg width="157" height="205" viewBox="0 0 157 205" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to41" alt="shap">
                <path d="M156 102.5L117.5 59.5V102.5L30 1L1 16L156 203.5V102.5Z" stroke="none" fill="url(#gradient5)"/>
            </svg>
            <svg>
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 0, 255, 0.354);stop-opacity:0" />
                        <stop offset="10%" style="stop-color:rgba(0, 0, 255, 0.149);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgb(0, 45, 110);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient01" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 0, 255, 0.354);stop-opacity:0" />
                        <stop offset="10%" style="stop-color:rgba(0, 0, 255, 0.149);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgb(0, 45, 110);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="10%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgb(0, 3, 181);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="10%" style="stop-color:rgba(0, 0, 255, 0.291);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgba(0, 0, 255, 0.17);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 139, 255, 0.537);stop-opacity:0" />
                        <stop offset="20%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgba(0, 132, 255, 0.263);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:rgba(0, 139, 255, 0.537);stop-opacity:0" />
                        <stop offset="20%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgba(0, 132, 255, 0.233);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient6" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:rgb(0, 45, 110);stop-opacity:0" />
                        <stop offset="10%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:0" />
                        <stop offset="100%" style="stop-color:rgba(0, 0, 255, 0.537);stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div  class="svgsContainer">
            <svg width="283" height="365" viewBox="0 0 283 365" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to32" alt="shap">
                <path d="M1 328.5L282 2V113.5L243.5 155V113.5L33.5 364L1 328.5Z" stroke="none" fill="url(#gradient1)"/>
            </svg>
            <svg width="346" height="455" viewBox="0 0 346 455" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to33" alt="shap">
                <path d="M216 56L264.5 1L345 102L43.5 453.5L1 408.5L252 97L216 56Z" stroke="none" fill="url(#gradient2)"/>
            </svg>
            <svg width="267" height="611" viewBox="0 0 267 611" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to34" alt="shap">
                <path d="M28 609L266 298.5L0.5 2V46L221 298.5L28 557.5V609Z" stroke="none" fill="url(#gradient01)"/>
            </svg>
            <svg width="464" height="832" viewBox="0 0 464 832" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to35" alt="shap">
                <path d="M224.5 831.5L462.5 550L1 1" stroke="#dbc8ff55"/>
            </svg>
            <svg width="337" height="775" viewBox="0 0 337 775" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to36" alt="shap">
                <path d="M17 1.5L335.5 384L10.5 773V730.5L297 379L1.5 21.5L17 1.5Z" stroke="none" fill="url(#gradient3)"/>
            </svg>
            <svg width="173" height="368" viewBox="0 0 173 368" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to37" alt="shap">
                <path d="M28 366.5L172 181.5L0.5 1.5V39L131 181.5L28 320.5V366.5Z" stroke="none" fill="url(#gradient4)"/>
            </svg>
            <svg width="405" height="832" viewBox="0 0 405 832" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to38" alt="shap" style="z-index: -1;">
                <path d="M1 1L404 471L100 831.5" stroke="#9988ff55"/>
            </svg>
            <svg width="399" height="416" viewBox="0 0 399 416" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to39" alt="shap">
                <path d="M397.5 0.5L338.5 414.5L2 0.5H41L316 338L357.5 0.5H397.5Z" stroke="none" fill="url(#gradient2)"/>
            </svg>
            <svg width="331" height="424" viewBox="0 0 331 424" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to40" alt="shap">
                <path d="M257 422.5L330 331.5L64.5 1L1 40L244.5 322.5L208.5 369L257 422.5Z" stroke="none" fill="url(#gradient5)"/>
            </svg>
            <svg width="157" height="205" viewBox="0 0 157 205" fill="none" xmlns="http://www.w3.org/2000/svg" class='svgBg' id="to41" alt="shap">
                <path d="M156 102.5L117.5 59.5V102.5L30 1L1 16L156 203.5V102.5Z" stroke="none" fill="url(#gradient5)"/>
            </svg>
        </div>`;
    }
}

customElements.define('background-component', CustomDiv);

const backgroundBody = document.createElement('background-component');
document.body.appendChild(backgroundBody);