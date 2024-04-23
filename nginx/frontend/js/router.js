function navigation() {
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
            context.initProfileOfUser(context.track.initProfileOfUser.name);
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
                const profilePath = `/profile/${context.track.initProfileOfUser.name}`;

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
                            a.addEventListener("click", async (event) => {
                                event.preventDefault();
                                if (context.track.gameMode === "ai") context.track.gameId = "play";
                                else await context.getAvailableGame();
                                setTimeout( () => {
                                    location = `${pathname}/${context.track.gameId}`;
                                    handleLinkClick(event);
                                }, 1000);
                            })
                        );
                    }
                    if (pageId === "profilePage") {
                        const shadowRoot = document.querySelector("custom-profile").shadowRoot;
                        shadowRoot.querySelectorAll("a#pages").forEach((a) =>
                            a.addEventListener("click", async (event) => {
                                event.preventDefault();
                                context.track.initProfileOfUser.name = event.target.getAttribute("playerName");
                                await handleLinkClick(event);
                            })
                        );
                    }
                } else if (pathname === "") {
                    showPage("homePage"); // Default to home page if route not found
                    document.querySelector("background-component").style.display = "block";
                } else {
                    showPage("notFoundPage");
                    document.querySelector("background-component").style.display = "block";
                }
                if (pageId === "profilePage" || pageId === "homePage")
                    document.querySelector("background-component").style.display = "block";
                clearInterval(timeInterval);
            }
        }, 100);
    }

    async function handleLinkClick(event) {
        let pathname = event.target.getAttribute("href");
        if (pathname === "/tournament") {
            await context.getAvailableTournament();
            pathname = `${pathname}/${context.track.tournamentId}`;
        }
        
        if (pathname === "/profile") {
            pathname = `${pathname}/${event.target.getAttribute("playerName")}`;
            await context.initProfileOfUser(context.track.initProfileOfUser.name);
        }
        if (location !== "") pathname = location;
        // check if the link is for the same page
        if (window.location.pathname === pathname) return;
        window.history.pushState(
            {},
            pathname,
            window.location.origin + pathname
        );
        navigateTo(pathname);
    }
    // if (context.navigation === undefined)
    context.navigation = handleLinkClick;

    window.addEventListener("popstate", async () => {
        if (window.location.pathname.includes("/profile")) {
            context.track.initProfileOfUser.name = window.location.pathname.split("/").pop();
            await context.initProfileOfUser(context.track.initProfileOfUser.name);
        }
        if (window.location.pathname.includes("/game")) {
            context.track.tournamentId = window.location.pathname.split("/").pop();
        }
        navigateTo(window.location.pathname);
    });

    // Initial page load
    if (window.location.pathname === `/tournament/${context.track.tournamentId}` && context.track.gameId !== undefined)
        navigateTo(`/game/1v1/${context.track.gameId}`);
    else
        navigateTo(window.location.pathname);
}

document.addEventListener("DOMContentLoaded", async () => {
    // remove the / at the end of the pathname
    
    function getCookie(cookieName) {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + "=")) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

    const username = getCookie("username");

    await context.initContext({ username: username });

    if (window.location.pathname.endsWith("/")) {
        window.history.pushState(
            {},
            window.location.pathname,
            window.location.origin + window.location.pathname.slice(0, -1)
        );
    }
    if (window.location.pathname == "/profile") {
        console.log("profile", context)
        window.history.pushState(
            {},
            window.location.pathname,
            window.location.origin + window.location.pathname + `/${context.user.name}`
        );
    }
    if (window.location.pathname.includes("/profile")) {
        context.track.initProfileOfUser.name = window.location.pathname.split("/").pop();
        await context.initProfileOfUser(context.track.initProfileOfUser.name);
    }
    // check if /tournament at the end of the pathname
    if (window.location.pathname == "/tournament") {
        await context.getAvailableTournament();
        window.history.pushState(
            {},
            window.location.pathname,
            window.location.origin + window.location.pathname + `/${context.track.tournamentId}`
        );
    }
    
    console.log("DOMContentLoaded", window.location.pathname);
    navigation()
});
