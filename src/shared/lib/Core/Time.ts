export class Time {
    private static _frameCount: number = 0;
    private static _lastFrameStartTime: number = 0.0;
    private static _deltaTime: number = 0.0;
    private static _paused: boolean = false;
    private static _gameStartTime: number = Date.now();
    
    public static get frameCount(): number { return this._frameCount; }
    private static set frameCount(value: number) { this._frameCount = value; }

    public static get deltaTime(): number { return this._deltaTime; }
    private static set deltaTime(value: number) { this._deltaTime = value; }

    public static get paused(): boolean { return this._paused; }
    public static set paused(value: boolean) { this._paused = value; }

    /**
     * Gets the time the game was started
     */
    public static get gameStartTime(): number { return this._gameStartTime; }

    /**
     * Gets current time
     */
    public static get realTime(): number { return Date.now(); }

    /**
     * Gets current time since the game loaded.
     */
    public static get gameTime(): number { return this.realTime - this.gameStartTime; }

    /**
     * Advances the frame count
     * and calculates delta time this frame.
     * @param {boolean} [silent=false] should it advance the frame count?
     */
    public static advanceFrame(silent = false) {
        const thisFrameStartTime = this.gameTime / 1000;

        this.deltaTime = thisFrameStartTime - this._lastFrameStartTime;
        this._lastFrameStartTime = thisFrameStartTime;
        this.frameCount += silent ? 0 : 1;
    }

    static sleep(t: number) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    static async waitUntil(check: () => boolean){
        while(!check())
            await this.sleep(1);
    }
}
