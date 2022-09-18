import { MSEventKeys } from "./MSEventKeys";


export class MSEvent implements Event {
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
    detail: { deltaTime: number; realDeltaTime: number; isFixedTime: boolean};

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
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void { this.event.initEvent(type, bubbles, cancelable); this.updateEvent(this.event); }
    preventDefault(): void { this.event.preventDefault(); this.updateEvent(this.event); }
    stopImmediatePropagation(): void { this.event.stopImmediatePropagation(); this.updateEvent(this.event); }
    stopPropagation(): void { this.event.stopPropagation(); this.updateEvent(this.event); }

    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
    NONE: number;
}
