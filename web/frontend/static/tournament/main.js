import Tournament from "./tournament.js";

window.addEventListener("load", function () {
    const tournamentID = document.getElementById("tournament").getAttribute("data-tournament-id");
    const tournament = new Tournament(tournamentID);

    tournament.socket.onOpen();
    tournament.socket.onClose();
    tournament.socket.onError();
    tournament.socket.onMessage();
});
