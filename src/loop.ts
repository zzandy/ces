type updateFn = (delta: number) => void;

export class Loop {
    private isRunning: boolean = false;
    private then: number = 0;
    private acc: number = 0;
    constructor(private readonly fixedDelta: number, private readonly fixedUpdate: updateFn, private readonly variableUpdate: updateFn) { }

    public start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.then = 0;
        this.acc = 0;

        const self = this;

        const tick = function (ts: number) {

            if (!self.isRunning) return;

            const delta = self.then == 0
                ? self.fixedDelta
                : ts - self.then;

            self.update(delta);

            self.then = ts;
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    private update(delta: number) {
        this.acc += delta;

        while (this.acc >= this.fixedDelta) {
            this.acc -= this.fixedDelta;
            this.fixedUpdate(this.fixedDelta);
        }

        this.variableUpdate(delta);
    }


    public stop() { this.isRunning = false }
}