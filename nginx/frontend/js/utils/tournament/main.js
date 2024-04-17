function startTournament() {
    const tournamentID = context.track.tournamentId;
    const url = `ws://${window.location.host}/ws/tournament/${tournamentID}/`;
    const socket = new WebSocket(url);
    let tournamentStatus = "pending";
    let user1 = null;
    let user2 = null;
    let user3 = null;
    let user4 = null;
    const game1 = {
        player1: user1,
        player2: user2,
        player1Score: 0,
        player2Score: 0,
        winner: null,
    };
    const game2 = {
        player1: user3,
        player2: user4,
        player1Score: 0,
        player2Score: 0,
        winner: null,
    };
    const game3 = {
        player1: game1.winner,
        player2: game2.winner,
        player1Score: 0,
        player2Score: 0,
        winner: null,
    };

    socket.onopen = () => {
        console.log("Connected to server");
    };

    socket.onclose = () => {
        console.log("Disconnected from server");
        socket.close();
    };

    socket.onerror = (event) => {
        console.error("Error:", event);
        socket.close();
    };

    socket.onmessage = (event) => {
        const jsonData = JSON.parse(event.data);
        const data = jsonData["data"];

        switch (data.event) {
            case "update_usernames":
                user1 = data.usernames[0];
                user2 = data.usernames[1];
                user3 = data.usernames[2];
                user4 = data.usernames[3];
                console.log("user 1:", user1);
                console.log("user 2:", user2);
                console.log("user 3:", user3);
                console.log("user 4:", user4);
                break;
            case "ongoing":
                tournamentStatus = "ongoing";
                console.log("Tournament ongoing");
                break;
            case "over":
                tournamentStatus = "over";
                console.log("Tournament over");
                break;
            case "play_game1":
                const game1ID = 500505;
                context.track.gameId = game1ID;
                context.track.gameMode = "1v1";
                context.track.gameMap = "egypt";
                navigation(`/game/1v1/${game1ID}/`);
                console.log("Playing game 1");
                break;
            case "play_game2":
                const game2ID = 605005;
                context.track.gameId = game2ID;
                context.track.gameMode = "1v1";
                context.track.gameMap = "factory";
                navigation(`/game/1v1/${game2ID}/`);
                console.log("Playing game 2");
                break;
            case "play_game3":
                const game3ID = 700605;
                context.track.gameId = game3ID;
                context.track.gameMode = "1v1";
                context.track.gameMap = "space";
                navigation(`/game/1v1/${game3ID}/`);
                console.log("Playing game 3");
                break;
        }
    };
}
