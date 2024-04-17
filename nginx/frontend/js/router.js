document.addEventListener("DOMContentLoaded", function () {
    const pages = {
        homePage: createDashboardPage,
        gatePage: createGatePage,
        profilePage: createProfilePage,
        tournamentPage: createTournamentPage,
        gamePage: createGamePage,
    };

    function showPage(pageId) {
        document.querySelectorAll("div.page").forEach((Div) => {
            document.body.removeChild(Div);
        });
        pages[pageId]();
    }
    let location = "";

    function navigateTo(pathname) {
        if (pathname === "/profile") {
            context.initProfileOfUser("hel-mefe");
        }
        // if (pathname === "/tournament") {
        //     context.initTournament();
        //     context.track.tournamentStatus = true;
        // }
        if (pathname === "/game/1v1") {
            context.track.gameId = "1";
            context.track.gameMode = "1v1";
        }
        if (pathname === "/game/2v2") {
            context.track.gameId = "2";
            context.track.gameMode = "2v2";
        }
        if (pathname === "/game/aiBot") {
            context.track.gameId = "";
            context.track.gameMode = "ai";
        }

        const timeInterval = setInterval(() => {
            if (context.api.loading === false) {
                const gamePath1v1 = `/game/1v1/${context.track.gameId}`;
                const gamePath2v2 = `/game/2v2/${context.track.gameId}`;
                const gamePathAi = `/game/aiBot/${context.track.gameId}`;
                const routes = {
                    "/": "homePage",
                    "/home": "homePage",
                    "/profile": "profilePage",
                    "/game/1v1": "gatePage",
                    "/game/2v2": "gatePage",
                    "/game/aiBot": "gatePage",
                    "/tournament": "tournamentPage",
                };
                routes[gamePath1v1] = "gamePage";
                routes[gamePath2v2] = "gamePage";
                routes[gamePathAi] = "gamePage";

                const pageId = routes[pathname];
                location = "";
                if (pageId) {
                    showPage(pageId);
                    document.querySelector("background-component").style.display = "none";
                    if (pageId === "gatePage") {
                        const shadowRoot = document.querySelector("custom-gate").shadowRoot;
                        shadowRoot.querySelectorAll("a#pages").forEach((a) =>
                            a.addEventListener("click", (event) => {
                                event.preventDefault();
                                location = `${pathname}/${context.track.gameId}`;
                                setTimeout(() => {
                                    handleLinkClick(event);
                                }, 1000);
                            })
                        );
                    }
                } else {
                    showPage("homePage"); // Default to home page if route not found
                    document.querySelector("background-component").style.display = "block";
                    if (document.querySelector("custom-dashboard") !== null) {
                        const shadowRoot = document.querySelector("custom-dashboard").shadowRoot;
                        shadowRoot.querySelectorAll("a#pages").forEach((a) =>
                            a.addEventListener("click", handleLinkClick)
                        );
                    }
                }
                if (pageId === "profilePage" || pageId === "homePage")
                    document.querySelector("background-component").style.display = "block";
                clearInterval(timeInterval);
            }
        }, 100);
    }

    function handleLinkClick(event) {
        event.preventDefault();
        let pathname = event.target.getAttribute("href");
        if (location !== "") pathname = location;
        window.history.pushState(
            {},
            pathname,
            window.location.origin + pathname
        );
        navigateTo(pathname);
    }

    window.onpopstate = function (event) {
        navigateTo(window.location.pathname);
    };
    // Initial page load
    navigateTo(window.location.pathname);
});

window.addEventListener("beforeunload", function (event) {
    alert("You are leaving the page");
});
