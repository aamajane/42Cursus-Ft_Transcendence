class Score {
    constructor(x, y) {
        this.value = 0;
        this.x = x;
        this.y = y;
    }

    update() {
        this.value++;
    }

    draw(ctx) {
        ctx.font = "180px sans-serif";
        ctx.fillStyle = "hsla(0, 0%, 100%, 0.5)";
        ctx.fillText(this.value, this.x, this.y);
    }
}
