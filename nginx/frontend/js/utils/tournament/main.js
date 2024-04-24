async function startTournament() {
    if (await context.getUserStatus()) {
        console.log("User is already playing in a tournament");
        return;
    }

    // const tournamentPage = document.querySelector("custom-tournament");
    const tournamentID = context.track.tournamentId;
    const url = `ws://${window.location.host}/ws/tournament/${tournamentID}/`;
    const socket = new WebSocket(url);

    let players = [];
    // let playersData = [];

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
                console.log("Player connected: ", context.user.name);
                addPlayer();
                break;
            case "add_player":
                players = data.players;
                break;
            case "remove_player":
                players = data.players;
                console.log("Players: ", players);
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
                await context.setUserStatus(false);
                setTimeout(() => {
                    navigation();
                    setTimeout(() => {
                        context.track.gameId = undefined;
                        playFinalGame
                    }, 120000);
                } , 5000);
                break;
            case "play_semifinal_second_game":
                context.track.gameId = context.track.semiFinalSecondGameId;
                context.track.gameMode = "1v1";
                context.track.gameMap = "factory";
                await context.setUserStatus(false);
                setTimeout(() => {
                    navigation();
                    setTimeout(() => {
                        context.track.gameId = undefined;
                        playFinalGame();
                    }, 120000);
                } , 5000);
                break;
            case "play_final_game":
                context.track.gameId = context.track.finalGameId;
                context.track.gameMode = "1v1";
                context.track.gameMap = "space";
                await context.setUserStatus(false);
                setTimeout(() => {
                    navigation();
                    setTimeout(() => {
                        context.track.gameId = undefined;
                        context.track.tournamentId = undefined;
                    }, 120000);
                } , 10000);
                break;
        }
    };

    function addPlayer() {
        const message = {
            event: "add_player",
            username: context.user.name,
        };

        console.log("1");
        sendMessage(message);
    }

    function playFinalGame() {
        const message = {
            event: "play_final_game",
            channel_name_index: players.indexOf(context.user.name),
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
