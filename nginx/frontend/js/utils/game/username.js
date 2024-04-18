class Username {
    constructor(username, x, y) {
        this.username = username;
        this.x = x;
        this.y = y;
    }

    update(username) {
        this.username = username;
    }

    draw(ctx) {
        ctx.font = "50px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(this.username, this.x, this.y);
    }
}
