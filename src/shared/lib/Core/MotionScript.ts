import { Debugger } from "../Debug/Debugger.js";
import { Time } from "./Time.js";

export enum MSEventKeys 
{ 
    None = "none",
    Load = "load", 
    Setup = "setup", 
    Update = "update", 
    Draw = "draw", 
}

class MotionScriptEvent implements Event{    
    constructor(type: MSEventKeys, detail: any = null) { this.updateEvent(new CustomEvent(type, { detail: detail })); }
    
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    currentTarget: EventTarget;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    returnValue: boolean;
    srcElement: EventTarget;
    target: EventTarget;
    timeStamp: number;
    type: string;    
    detail: any;

    private event: CustomEvent;    
    private updateEvent(event: CustomEvent) {
        this.detail = event.detail;
        this.bubbles = event.bubbles;
        this.event = event;
        this.cancelBubble = event.cancelBubble;
        this.cancelable = event.cancelable;
        this.composed = event.composed;
        this.currentTarget = event.currentTarget;
        this.defaultPrevented = event.defaultPrevented;
        this.eventPhase = event.eventPhase;
        this.isTrusted = event.isTrusted;
        this.returnValue = event.returnValue;
        this.srcElement = event.srcElement;
        this.target = event.target;
        this.timeStamp = event.timeStamp;
        this.type = event.type;
        this.AT_TARGET = event.AT_TARGET;
        this.BUBBLING_PHASE = event.BUBBLING_PHASE;
        this.CAPTURING_PHASE = event.CAPTURING_PHASE;
        this.NONE = event.NONE;
    }

    composedPath(): EventTarget[] { const r = this.event.composedPath(); this.updateEvent(this.event); return r; }
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void { this.event.initEvent(type,bubbles,cancelable); this.updateEvent(this.event); }
    preventDefault(): void { this.event.preventDefault(); this.updateEvent(this.event); }
    stopImmediatePropagation(): void { this.event.stopImmediatePropagation(); this.updateEvent(this.event); }
    stopPropagation(): void { this.event.stopPropagation(); this.updateEvent(this.event); }

    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
    NONE: number;
}

class MotionScriptObserver implements EventTarget{
    private listeners : {
        load:   Function[],
        setup:  Function[],
        update: Function[],
        draw:   Function[],
    }

    constructor() {
        this.listeners = {
            load: [],
            setup: [],
            update: [],
            draw: []
        }
    }
    
    addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.listeners[type].push(callback);
    }

    removeEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.listeners[type].remove(callback);
    }

    dispatchEvent(event: MotionScriptEvent): boolean {
        try{
            this.listeners[event.type].forEach(listener => {
                if(listener) listener(event);
            });     
            return true;
        }
        catch{
            return false;
        }
    }
}

export namespace MotionScript{
    export const MS = new MotionScriptObserver();

    let objectsLoading = 0;

    window.addEventListener("load", async function(e){             
        const loadEvent = new MotionScriptEvent(MSEventKeys.Load);
        const setupEvent = new MotionScriptEvent(MSEventKeys.Setup);
        const updateEvent = new MotionScriptEvent(MSEventKeys.Update, Time.deltaTime);
        const drawEvent = new MotionScriptEvent(MSEventKeys.Draw, Time.deltaTime);
        
        MS.dispatchEvent(loadEvent);
        
        if(objectsLoading > 0)
            await Time.waitUntil(() => objectsLoading <= 0);

        MS.dispatchEvent(setupEvent);
        nextFrame();

        function nextFrame() {
            Time.advanceFrame(Time.paused);
            
            if(Time.paused) pausedLoop();
            else gameLoop();                

            requestAnimationFrame(nextFrame);

            function gameLoop(){
                updateEvent.detail = Time.deltaTime;
                drawEvent.detail = Time.deltaTime;

                MS.dispatchEvent(updateEvent);
                MS.dispatchEvent(drawEvent);
            }

            function pausedLoop(){

            }
        }
    });
}