export class tournament {
    constructor(tournamentID) {
        this.id = tournamentID;
        this.socket = new Socket(this);
    }
}
