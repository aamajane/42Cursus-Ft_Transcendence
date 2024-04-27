class Nickname {
    constructor(value, x, y, map) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.map = map;
    }

    draw(ctx) {
        ctx.font = this.map.nicknameFont;
        ctx.fillStyle = this.map.fillStyle;
        ctx.strokeStyle = this.map.strokeStyle;
        ctx.lineWidth = this.map.nicknameLineWidth;

        ctx.strokeText(this.value, this.x, this.y);
        ctx.fillText(this.value, this.x, this.y);
    }
}
