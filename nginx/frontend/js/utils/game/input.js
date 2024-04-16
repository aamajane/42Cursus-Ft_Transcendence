class Input {
    constructor(leftKey, rightKey) {
        this.currentKey = null;
        this.touchStartX = null;

        if (leftKey === null || rightKey === null) {
            return;
        }

        window.addEventListener("keydown", (event) => {
            if (event.key === leftKey || event.key === rightKey) {
                this.currentKey = event.key;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === leftKey || event.key === rightKey) {
                this.currentKey = null;
            }
        });

        window.addEventListener("touchstart", (event) => {
            this.touchStartX = event.touches[0].clientX;
        });

        window.addEventListener("touchmove", (event) => {
            if (this.touchStartX !== null) {
                const deltaX = event.touches[0].clientX - this.touchStartX;

                if (deltaX > 0) {
                    this.currentKey = rightKey;
                } else if (deltaX < 0) {
                    this.currentKey = leftKey;
                }
            }
        });

        window.addEventListener("touchend", (event) => {
            this.currentKey = null;
            this.touchStartX = null;
        });
    }
}
