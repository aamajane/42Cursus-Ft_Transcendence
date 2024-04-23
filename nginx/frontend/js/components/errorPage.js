class CustomErrorPage extends HTMLElement {
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
                /* Styles for the custom error page component */
                .custom-error-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    // background-color: #f4f4f4;
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 9999;
                }

                .custom-error-page .container {
                    width: 80%;
                    margin: auto;
                    text-align: center;
                    padding-top: 100px;
                }

                .custom-error-page h1 {
                    color: #00FFF0;
                    text-shadow: 0px 7px 7px #000,
                        0px 0px 6px #000,
                        0px -6px 7px #00FFF0;
                    font-size: 48px;
                    margin-bottom: 20px;
                }

                .custom-error-page p {
                    color: #0fa;
                    font-size: 18px;
                    margin-bottom: 40px;
                }

                .custom-error-page .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #0fafa0;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }

                .custom-error-page .button:hover {
                    background-color: #0056b3;
                }

            </style>
            <div class="custom-error-page">
                <div class="container">
                    <h1>Oops! Something went wrong.</h1>
                    <p>We're sorry, but it seems that an error has occurred.</p>
                    <a href="http://localhost/" class="button">Go Back</a>
                </div>
            </div>
        `;
        this.shadowRoot.querySelector("h1").innerText = this.getAttribute("message");
        this.shadowRoot.querySelector("p").innerText = this.getAttribute("secondMessage");
    }
}

customElements.define('custom-error-page', CustomErrorPage);

function createErrorPage(message = "Oops! Something went wrong.",
                        secondMessage = "We're sorry, but it seems that an error has occurred.") {
    const div = document.createElement("div");
    const popup = document.createElement("custom-error-page");

    popup.setAttribute("id", 0);
    popup.setAttribute("message", message);
    popup.setAttribute("secondMessage", secondMessage);

    div.appendChild(popup);
    div.setAttribute("class", "page errorPage");
    document.body.appendChild(div);
}