class Score {
    constructor(x, y) {
        this.value = 0;
        this.x = x;
        this.y = y;
    }

    update() {
        this.value++;
    }

    draw(context) {
        context.font = "180px sans-serif";
        context.fillStyle = "hsla(0, 0%, 100%, 0.5)";
        context.fillText(this.value, this.x, this.y);
    }
}
