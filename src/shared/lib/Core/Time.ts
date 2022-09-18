import { MotionScript } from './MotionScript';

export class Time {
    private static _pauseTimeOut: number = undefined;

    private static _timeScale: number = 1;
    private static _targetFps: number = 60;
    private static _paused: boolean = false;
    
    private static _targetDeltaTime: number = Math.round(Time._timeScale * 0.001 * Time._targetFps);

    private static _deltaTime: number = 0;
    private static _fixedDeltaTime: number = Time._targetDeltaTime;
    
    private static _realDeltaTime: number = 0;
    private static _realFixedDeltaTime: number;
        
    private static _frameCount: number = 0;
    private static _fixedFrameCount: number = 0;

    private static _lastFrameTime: number = 0;
    private static _lastFixedFrameTime: number = 0;
    
    private static _instanceTime: number = Date.now();
    
    public static get timeScale(): number      { return Time._timeScale;                                                   }
    public static set timeScale(value: number) { Time._timeScale = value; Time.targetFps = Time._targetFps;                }

    public static get targetFps(): number      { return Time._targetFps;                                                   }
    public static set targetFps(value: number) { Time._targetFps = value; Time._targetDeltaTime = value  * Time.timeScale; }
    
    public  static get paused(): boolean      { return Time._paused;  }
    private static set paused(value: boolean) { Time._paused = value; }
    
    public static get targetDeltaTime(): number      { return Time._targetDeltaTime;                                                     }
    public static set targetDeltaTime(value: number) { Time._targetDeltaTime = value; Time._targetFps = Time._timeScale * 0.001 * value; }
    
    public  static get deltaTime(): number      { return Time._deltaTime;  }
    private static set deltaTime(value: number) { Time._deltaTime = value; }
    
    public static get fixedDeltaTime(): number      { return Time._fixedDeltaTime;                                 }
    public static set fixedDeltaTime(value: number) { Time._fixedDeltaTime = value; MotionScript.beginFixedLoop(); }
    
    public static  get realDeltaTime(): number      { return Time._realDeltaTime;  }
    private static set realDeltaTime(value: number) { Time._realDeltaTime = value; }

    public static get realFixedDeltaTime(): number      { return Time._realFixedDeltaTime;  }
    public static set realFixedDeltaTime(value: number) { Time._realFixedDeltaTime = value; }
    
    public  static get frameCount(): number      { return Time._frameCount;  }
    private static set frameCount(value: number) { Time._frameCount = value; }  

    public  static get fixedFrameCount(): number      { return Time._fixedFrameCount;  }
    private static set fixedFrameCount(value: number) { Time._fixedFrameCount = value; }

    private static get lastFrameTime(): number      { return Time._lastFrameTime;  }
    private static set lastFrameTime(value: number) { Time._lastFrameTime = value; }

    private static get lastFixedFrameTime(): number      { return Time._lastFixedFrameTime;  }
    private static set lastFixedFrameTime(value: number) { Time._lastFixedFrameTime = value; }

    /**
     * Pauses time
     * @param [length] how long should it be paused
     */
    public static pause(length: number = undefined){
        if(Time.paused) return;
        Time.paused = true;

        if(length != undefined) 
            Time._pauseTimeOut = setTimeout(() => { Time.resume(); }, length);
    }

    /**
     * Resumes time
     */
    public static resume() {
        if(!Time.paused) return;
        Time.clearPauseTimeout();
        Time.paused = false;
    }

    /**
     * Toggles time ON and OFF     
     * @return {boolean} The new state of the pause
     */
    public static toggle() : boolean { 
        Time.clearPauseTimeout(); 
        Time.paused = !Time.paused; 

        return Time.paused; 
    }

    /**
     * Gets the time the game was started
     */
    public static get instanceTime(): number { return Time._instanceTime; }

    /**
     * Gets current time
     */
    public static get realTime(): number { return Date.now(); }

    /**
     * Gets current time since the game loaded.
     */
    public static get time(): number { return (Time.realTime - Time.instanceTime) * Time.timeScale; }

    /**
     * Advances the frame count
     * and calculates delta time this frame.
     * @param {boolean} [silent=false] should it advance the frame count?
     */
    public static advanceFrame(silent = false) : boolean{
        /**
         * === COMPUTING BIASED DELTA TIME ===
         * 1. [ tdt = 1000 /tFps                         ] => take the ratio of 1000 milliseconds (a.k.a a full second) by our target frames per second to get the target delta time
         * 2. [ dt1 = t1 - t0                            ] => calculate the real delta time on this frame by taking te difference of the time this frame and the time last frame
         * 3. [ avg = (dt0 + dt1) /2                     ] => take the average delta time on this and last frames
         * 4. [ bdt = (avg + tdt) /2                     ] => our biased delta time will be the average of that with the target delta time
         * 5. [ bdt = (dt0 + dt1) * 0.25 + tFps * 0.0005 ] => we can apply some optimizations and simplify everything into a single formula
         * 6. [ bdt = (dt0 + dt1) * 0.25 + tdt  * 0.5    ] => finally, we can store the target delta time, so we don't have to compute it every frame
         */

        const t0  = Time.lastFrameTime;            // time last frame         (-)
        const t1  = Time.time;                      // time this frame         (-)
        const tdt = this.targetDeltaTime            // target delta time       (1)
        const dt0 = Time.realDeltaTime;             // last frame's delta time (-)
        const dt1 = t1 - t0;                        // this frame's delta time (2)
        const bdt = (dt0 + dt1) * 0.5 + tdt;        // biased delta time       (6)

        if(bdt) {
            Time.lastFrameTime = t1;
            Time.realDeltaTime = dt1 * Time.timeScale;
            Time.deltaTime     = Math.round(bdt) * Time.timeScale;
            Time.frameCount   += silent ? 0 : 1;
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Advances the fixed frame count
     * and calculates fixed delta time this frame (should be constant but better safe than sorry)
     * @param {boolean} [silent=false] should it advance the frame count?
     */
    public static advanceFixedFrame(silent = false){
        const t0 = Time._lastFixedFrameTime;
        const t1 = Time.time;

        Time.fixedFrameCount   += silent ? 0 : 1;
        Time.realFixedDeltaTime = (t1 - t0) * Time.timeScale;
        Time.lastFixedFrameTime = t1 * Time.timeScale;
    }

    public static sleep(t: number) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    public static async waitUntil(check: () => boolean){
        while(!check())
            await Time.sleep(1);
    }

    private static clearPauseTimeout() {
        if (Time._pauseTimeOut != undefined) {
            clearTimeout(Time._pauseTimeOut);
            Time._pauseTimeOut = undefined;
        }
    }
}
