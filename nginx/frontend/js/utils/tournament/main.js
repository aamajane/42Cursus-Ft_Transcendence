window.addEventListener("load", function () {
    const tournamentID = document.getElementById("tournament").getAttribute("data-tournament-id");
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
                const game1ID = 1;
                window.location.href = `/game/1v1/${game1ID}/`;
                console.log("Playing game 1");
                break;
            case "play_game2":
                const game2ID = 2;
                window.location.href = `/game/1v1/${game2ID}/`;
                console.log("Playing game 2");
                break;
            case "play_game3":
                const game3ID = 3;
                window.location.href = `/game/1v1/${game3ID}/`;
                console.log("Playing game 3");
                break;
        }
    };
});
