function navigation(mainPath) {
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
        console.log("mainPath: " + mainPath, "pathname: " + pathname);
        if (pathname === "/profile") {
            context.initProfileOfUser("hel-mefe");
        }
        // if (pathname === "/tournament") {
        //     context.initTournament();
        //     context.track.tournamentStatus = true;
        // }
        if (pathname === "/game/1v1") {
            context.track.gameMode = "1v1";
        }
        if (pathname === "/game/2v2") {
            context.track.gameMode = "2v2";
        }
        if (pathname === "/game/aiBot") {
            context.track.gameMode = "ai";
        }
        if (pathname === `/tournament/${context.track.tournamentId}`)
            context.track.gameId = undefined;

        const timeInterval = setInterval(() => {
            if (context.api.loading === false) {
                const gamePath1v1 = `/game/1v1/${context.track.gameId}`;
                const gamePath2v2 = `/game/2v2/${context.track.gameId}`;
                const gamePathAi = `/game/aiBot/${context.track.gameId}`;
                const tournamentPath = `/tournament/${context.track.tournamentId}`;
                const profilePath = `/profile/null`;

                const routes = {
                    "/": "homePage",
                    "/home": "homePage",
                    "/game/1v1": "gatePage",
                    "/game/2v2": "gatePage",
                    "/game/aiBot": "gatePage"
                };

                routes[gamePath1v1] = "gamePage";
                routes[gamePath2v2] = "gamePage";
                routes[gamePathAi] = "gamePage";
                routes[tournamentPath] = "tournamentPage";
                routes[profilePath] = "profilePage";

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
                                context.track.gameId = 100;
                                location = `${pathname}/${context.track.gameId}`;
                                setTimeout(() => {
                                    handleLinkClick(event);
                                }, 1000);
                            })
                        );
                    }
                    if (pageId === "profilePage") {
                        const shadowRoot = document.querySelector("custom-profile").shadowRoot;
                        shadowRoot.querySelectorAll("a#pages").forEach((a) =>
                            a.addEventListener("click", handleLinkClick)
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
        if (pathname === "/tournament") {
            context.track.tournamentId = "123545679";
            pathname = `${pathname}/${context.track.tournamentId}`;
        }

        if (pathname === "/profile") {
            context.initProfileOfUser("hel-mefe");
            // context.track.initProfileOfUser.player.name = event.target.getAttribute("playerName");
            pathname = `${pathname}/${event.target.getAttribute("playerName")}`;
        }
        console.log("pathname:::::::: " + pathname);
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
    if (window.location.pathname === `/tournament/${context.track.tournamentId}` && context.track.gameId !== undefined)
        navigateTo(`/game/1v1/${context.track.gameId}`);
    else
        navigateTo(window.location.pathname);
}

document.addEventListener("DOMContentLoaded", navigation);
