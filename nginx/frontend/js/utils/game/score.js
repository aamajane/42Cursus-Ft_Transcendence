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
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(this.value, this.x, this.y);
    }
}
