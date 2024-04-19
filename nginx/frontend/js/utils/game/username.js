class Username {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.font = "50px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(this.value, this.x, this.y);
    }
}
