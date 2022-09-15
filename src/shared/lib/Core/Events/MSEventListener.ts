import { MSEvent } from "./MSEvent";

export class MSAddEventListenerOptions implements AddEventListenerOptions{
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
    /**
     * Order to add the event: 
     * [n < 0] -> before previous events. |
     * [n > 0] -> after previous events. |
     * [n = 0] -> default behaviour (after).
     */
    order?: number;
}

export class MSEventListener implements EventTarget {
    private listeners: {
        load: Function[];
        setup: Function[];
        update: Function[];
        fixedUpdate: Function[];
        draw: Function[];
        fixedDraw: Function[];
    };

    constructor() {
        this.listeners = {
            load: [],
            setup: [],
            update: [],
            fixedUpdate: [],
            draw: [],
            fixedDraw: [],
        };
    }

    addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | MSAddEventListenerOptions): void {
        if(options && options instanceof MSAddEventListenerOptions && options.order < 0) this.listeners[type].push(callback);
        else this.listeners[type].unshift(callback)
    }

    removeEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.listeners[type].remove(callback);
    }

    dispatchEvent(event: MSEvent): boolean {
        try {
            this.listeners[event.type].forEach(listener => {
                if (listener)
                    listener(event);
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
