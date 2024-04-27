async function startTournament() {
    if (await context.getUserStatus()) {
        console.log("User is already playing in a tournament");
        return;
    }

    const tournamentPage = document.querySelector("custom-tournament");
    const tournamentID = context.track.tournamentId;
    const url = `wss://${window.location.host}/ws/tournament/${tournamentID}/`;
    const socket = new WebSocket(url);

    context.track.previousLocation = window.location.pathname;
    let players = [];

    socket.onopen = async () => {
        await context.setUserStatus(true);
        console.log("Tournament Connected to server");
    };

    socket.onclose = async () => {
        await context.setUserStatus(false);
        console.log("Tournament Disconnected from server");
    };

    socket.onerror = async (event) => {
        await context.setUserStatus(false);
        console.log("Tournament Connection error: ", event);
    };

    socket.onmessage = async (event) => {
        const jsonData = JSON.parse(event.data);
        const data = jsonData["data"];

        switch (data.event) {
            case "player_connected":
                addPlayer();
                break;
            case "add_player":
                context.track.tournamentPlayers = data.players;
                tournamentPage.playersEnter();
                console.log(context.track.tournamentPlayers);
                break;
            case "remove_player":
                context.track.tournamentPlayers = data.players;
                tournamentPage.playersEnter();
                console.log(context.track.tournamentPlayers);
                break;
            case "tournament_ongoing":
                context.track.tournamentStatus = "ongoing";
                await context.setTournamentState("ongoing");
                break;
            case "tournament_over":
                context.track.tournamentStatus = "over";
                await context.setTournamentState("over");
                socket.close();
                break;
            case "play_semifinal_first_game":
                context.track.gameId = context.track.semiFinalFirstGameId;
                context.track.gameMode = "1v1";
                context.track.gameMap = "egypt";
                setTimeout(async () => {
                    await context.setUserStatus(false);
                    navigation();

                    const interval = setInterval(async () => {
                        await context.getGameById(context.track.semiFinalFirstGameId);
                        if (context.track.gameData.state === "over") {
                            context.track.gameId = undefined;
                            context.track.semiFinalFirstGameStatus = "over";
                            navigation();
                            playAnimation();
                            if ((context.track.gameData.player1.username === context.user.name && context.track.gameData.isTeam1Won) ||
                                (context.track.gameData.player2.username === context.user.name && !context.track.gameData.isTeam1Won)) {
                                playFinalGame();
                            }
                            clearInterval(interval);
                        }
                    }, 3000);
                } , 5000);
                break;
            case "play_semifinal_second_game":
                context.track.gameId = context.track.semiFinalSecondGameId;
                context.track.gameMode = "1v1";
                context.track.gameMap = "factory";
                setTimeout(async () => {
                    await context.setUserStatus(false);
                    navigation();

                    const interval = setInterval(async () => {
                        await context.getGameById(context.track.semiFinalSecondGameId);
                        if (context.track.gameData.state === "over") {
                            context.track.gameId = undefined;
                            context.track.semiFinalSecondGameStatus = "over";
                            navigation();
                            playAnimation();
                            if ((context.track.gameData.player1.username === context.user.name && context.track.gameData.isTeam1Won) ||
                                (context.track.gameData.player2.username === context.user.name && !context.track.gameData.isTeam1Won)) {
                                playFinalGame();
                            }
                            clearInterval(interval);
                        }
                    }, 3000);
                } , 5000);
                break;
            case "play_final_game":
                context.track.gameId = context.track.finalGameId;
                context.track.gameMode = "1v1";
                context.track.gameMap = "space";
                setTimeout(async () => {
                    await context.setUserStatus(false);
                    navigation();

                    const interval = setInterval(async () => {
                        await context.getGameById(context.track.finalGameId);
                        if (context.track.gameData.state === "over") {
                            context.track.gameId = undefined;
                            context.track.finalGameStatus = "over";
                            navigation();
                            playAnimation();
                            tournamentOver();
                            clearInterval(interval);
                        }
                    }, 3000);
                } , 17000);
                break;
            case "play_animation":
                tournamentPage.playAnimation();
                break;
        }
    };

    function addPlayer() {
        const message = {
            event: "add_player",
            player: {
                username: context.user.name,
                nickname: context.user.nickname,
                avatar: context.user.avatarUrl,
            },
        };

        sendMessage(message);
    }

    function playFinalGame() {
        const message = {
            event: "play_final_game",
        };

        sendMessage(message);
    }

    function playAnimation() {
        const message = {
            event: "play_animation",
        };

        sendMessage(message);
    }

    function tournamentOver() {
        const message = {
            event: "tournament_over",
        };

        sendMessage(message);
    }

    function sendMessage(message) {
        if (socket.readyState !== WebSocket.OPEN) {
            console.log("Message not sent: Tournament Connection closed");
            return;
        }

        socket.send(JSON.stringify(message));
    }

    function handleConnectionLost() {
        const popstateHandler = () => {
            socket.close();
            window.removeEventListener("popstate", popstateHandler);
        };
        const beforeunloadHandler = async (e) => {
            await context.setUserStatus(false);
            socket.close();
        };

        window.addEventListener("popstate", popstateHandler);
        window.addEventListener("beforeunload", beforeunloadHandler);
    }

    handleConnectionLost();
}
