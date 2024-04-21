class Input {
    constructor(leftKey, rightKey) {
        this.keys = [];
        this.touchKey = null;
        this.touchStartX = null;

        if (leftKey === null || rightKey === null) {
            return;
        }

        window.addEventListener("keydown", (event) => {
            if (
                (event.key === leftKey || event.key === rightKey) &&
                !this.keys.includes(event.key)
            ) {
                this.keys.push(event.key);
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === leftKey || event.key === rightKey) {
                this.keys = this.keys.filter((key) => key !== event.key);
            }
        });

        window.addEventListener("touchstart", (event) => {
            this.touchStartX = event.touches[0].clientX;
        });

        window.addEventListener("touchmove", (event) => {
            if (this.touchStartX !== null) {
                const deltaX = event.touches[0].clientX - this.touchStartX;

                if (deltaX > 0) {
                    this.touchKey = rightKey;
                } else if (deltaX < 0) {
                    this.touchKey = leftKey;
                }
            }
        });

        window.addEventListener("touchend", (event) => {
            this.touchKey = null;
            this.touchStartX = null;
        });
    }
}
