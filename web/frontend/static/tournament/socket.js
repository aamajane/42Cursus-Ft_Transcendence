export class Socket {
    constructor(tournament) {
        this.tournament = tournament;
        this.url = `ws://${window.location.host}/ws/tournament/${tournament.id}/`;
        this.socket = new WebSocket(this.url);
    }

    onOpen() {
        this.socket.onopen = () => {
            console.log("Connected to server");
        };
    }

    onClose() {
        this.socket.onclose = () => {
            console.log("Disconnected from server");
            this.socket.close();
        };
    }

    onError() {
        this.socket.onerror = (event) => {
            console.error("Error:", event);
            this.socket.close();
        };
    }

    onMessage() {
        this.socket.onmessage = (event) => {
            const jsonData = JSON.parse(event.data);
            const data = jsonData["data"];

            switch (data.event) {
            }
        };
    }
}
