class Avatar {
    constructor(url, x, y) {
        this.image =  new Image();
        this.image.src = url;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        const centerX = AVATAR_SIZE / 2;
        const centerY = AVATAR_SIZE / 2;
        const radius = AVATAR_SIZE / 2;

        ctx.save();

        ctx.beginPath();
        ctx.arc(centerX + this.x, centerY + this.y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.globalAlpha = 0.7;

        ctx.drawImage(this.image, this.x, this.y, AVATAR_SIZE, AVATAR_SIZE);

        ctx.beginPath();
        ctx.arc(centerX + this.x, centerY + this.y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.restore();
    }
}
