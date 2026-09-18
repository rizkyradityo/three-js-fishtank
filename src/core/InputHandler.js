export class InputHandler {

    constructor() {

        this.keys = {};

        this.isFeedMode = false;

        this.selectedFoodId = 1;

        this.isMobile = this.checkMobile();

        this.onSpacePress = null;
        this.onFoodChange = null;
        this.onToggleFeedMode = null;
        this.onCameraMove = null;
        this.onClean = null;
        this.onTap = null;

        this.touchStart = null;

        this.setupEventListeners();
    }

    checkMobile() {

        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0
        );
    }

    setupEventListeners() {

        window.addEventListener(
            'keydown',
            (e) => this.handleKeyDown(e)
        );

        window.addEventListener(
            'keyup',
            (e) => this.handleKeyUp(e)
        );

        if (this.isMobile) {

            const canvas =
                document.querySelector('canvas');

            canvas.addEventListener(
                'touchstart',
                (e) => this.handleTouchStart(e),
                { passive: false }
            );

            canvas.addEventListener(
                'touchmove',
                (e) => this.handleTouchMove(e),
                { passive: false }
            );

            canvas.addEventListener(
                'touchend',
                (e) => this.handleTouchEnd(e)
            );

        } else {

            const canvas =
                document.querySelector('canvas');

            canvas.addEventListener(
                'click',
                (e) => this.handleClick(e)
            );
        }
    }

    handleKeyDown(e) {

        if (this.keys[e.code]) return;

        this.keys[e.code] = true;

        switch (e.code) {

            case 'Space':
                e.preventDefault();
                if (this.onSpacePress) {
                    this.onSpacePress();
                }
                break;

            case 'KeyF':
                this.isFeedMode = !this.isFeedMode;
                if (this.onToggleFeedMode) {
                    this.onToggleFeedMode(this.isFeedMode);
                }
                break;

            case 'KeyC':
                if (this.onClean) {
                    this.onClean();
                }
                break;

            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
                const foodId =
                    parseInt(e.code.replace('Digit', ''));
                this.selectedFoodId = foodId;
                if (this.onFoodChange) {
                    this.onFoodChange(foodId);
                }
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault();
                break;
        }
    }

    handleKeyUp(e) {

        this.keys[e.code] = false;
    }

    handleClick(e) {

        if (this.onTap) {

            this.onTap(e.clientX, e.clientY);
        }
    }

    handleTouchStart(e) {

        e.preventDefault();

        const touch = e.touches[0];

        this.touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
    }

    handleTouchMove(e) {

        e.preventDefault();
    }

    handleTouchEnd(e) {

        if (!this.touchStart) return;

        const touch = e.changedTouches[0];

        const dx =
            Math.abs(touch.clientX - this.touchStart.x);

        const dy =
            Math.abs(touch.clientY - this.touchStart.y);

        const dt =
            Date.now() - this.touchStart.time;

        if (dx < 20 && dy < 20 && dt < 300) {

            if (this.onTap) {

                this.onTap(touch.clientX, touch.clientY);
            }
        }

        this.touchStart = null;
    }

    isKeyPressed(code) {
        return this.keys[code] === true;
    }

    getCameraInput() {

        const direction = { x: 0, y: 0 };

        if (this.keys['ArrowLeft']) {
            direction.x = -1;
        }
        if (this.keys['ArrowRight']) {
            direction.x = 1;
        }
        if (this.keys['ArrowUp']) {
            direction.y = 1;
        }
        if (this.keys['ArrowDown']) {
            direction.y = -1;
        }

        return direction;
    }

    dispose() {

        window.removeEventListener(
            'keydown',
            this.handleKeyDown
        );

        window.removeEventListener(
            'keyup',
            this.handleKeyUp
        );
    }
}
