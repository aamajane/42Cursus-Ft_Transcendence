class Score {
    constructor(x, y, map) {
        this.value = 0;
        this.x = x;
        this.y = y;
        this.map = map;
    }

    update() {
        this.value++;
    }

    draw(ctx) {
        ctx.font = this.map.scoreFont;
        ctx.fillStyle = this.map.fillStyle;
        ctx.strokeStyle = this.map.strokeStyle;
        ctx.lineWidth = this.map.scoreLineWidth;

        ctx.strokeText(this.value, this.x, this.y);
        ctx.fillText(this.value, this.x, this.y);
    }
}
